import React, { useState, useEffect, useCallback } from 'react';
import Map, { Marker, Popup, NavigationControl, FullscreenControl } from 'react-map-gl';
import { Clock, MapPin, AlertTriangle, Info, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '../lib/supabase';
import { isSupabaseConnected } from '../lib/supabase';
import { getRecentOutageIncidents } from '../services/incidentService';
import { Incident } from '../types';

interface OutageReportData {
  id: string;
  website_id: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  status: string;
  location_city: string | null;
  location_country: string | null;
  report_count: number;
}

const OutageMap: React.FC = () => {
  const [outageReports, setOutageReports] = useState<OutageReportData[]>([]);
  const [userReportedOutages, setUserReportedOutages] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<OutageReportData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  const [viewState, setViewState] = useState({
    latitude: 40,
    longitude: -95,
    zoom: 2
  });

  // Get Mapbox token from environment variables
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

  const fetchOutageReports = useCallback(async () => {
    try {
      setLoading(true);
      
      // Check if Supabase is connected
      const connected = await isSupabaseConnected;
      setUsingFallbackData(!connected);
      
      // Get real-time data from Supabase
      const { data, error } = await supabase
        .from('outage_reports')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      
      setOutageReports(data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch outage reports:', err);
      setError('Failed to load outage map data');
      
      // Use empty array instead of mock data
      setOutageReports([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const fetchUserReportedOutages = async () => {
    try {
      // Get recent outage incidents (down or partial) from the last 24 hours
      const incidents = await getRecentOutageIncidents();
      setUserReportedOutages(incidents);
    } catch (err) {
      console.error('Failed to fetch user reported outages:', err);
      setUserReportedOutages([]);
    }
  };

  useEffect(() => {
    fetchOutageReports();
    fetchUserReportedOutages();
    
    // Set up real-time subscription for outage_reports
    const outageSubscription = supabase
      .channel('outage_reports_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'outage_reports' }, 
        () => {
          // Refresh data when changes occur
          fetchOutageReports();
        }
      )
      .subscribe();
    
    // Set up real-time subscription for incidents
    const incidentSubscription = supabase
      .channel('incidents_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'incidents' }, 
        () => {
          // Refresh data when changes occur
          fetchUserReportedOutages();
        }
      )
      .subscribe();
    
    return () => {
      outageSubscription.unsubscribe();
      incidentSubscription.unsubscribe();
    };
  }, [fetchOutageReports]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchOutageReports(), fetchUserReportedOutages()]);
  };

  // Group reports by website for the summary section
  const reportsByWebsite = outageReports.reduce((acc, report) => {
    const websiteId = report.website_id;
    if (!acc[websiteId]) {
      acc[websiteId] = [];
    }
    acc[websiteId].push(report);
    return acc;
  }, {} as Record<string, OutageReportData[]>);

  // Add user reported outages to the reports by website
  userReportedOutages.forEach(incident => {
    const websiteId = incident.websiteId;
    
    // Skip if we don't have location data
    if (!incident.location) return;
    
    // Create a synthetic outage report
    const syntheticReport: OutageReportData = {
      id: incident.id,
      website_id: incident.websiteId,
      latitude: Math.random() * 180 - 90, // Random latitude if not available
      longitude: Math.random() * 360 - 180, // Random longitude if not available
      timestamp: incident.timestamp.toISOString(),
      status: 'down',
      location_city: incident.location.city,
      location_country: incident.location.country,
      report_count: incident.meTooCount + 1
    };
    
    if (!reportsByWebsite[websiteId]) {
      reportsByWebsite[websiteId] = [];
    }
    
    // Only add if we don't already have a report for this incident
    const exists = reportsByWebsite[websiteId].some(report => report.id === incident.id);
    if (!exists) {
      reportsByWebsite[websiteId].push(syntheticReport);
    }
  });

  // Sort websites by number of reports (descending)
  const sortedWebsites = Object.entries(reportsByWebsite)
    .sort(([, reportsA], [, reportsB]) => reportsB.length - reportsA.length)
    .slice(0, 5); // Top 5 websites with most outages

  // Combine outage reports and user reported outages for the map
  const combinedMapMarkers = () => {
    // Start with outage reports
    const markers = [...outageReports];
    
    // Add user reported outages that have location data
    userReportedOutages.forEach(incident => {
      if (incident.location) {
        // Check if this incident is already in the markers
        const exists = markers.some(marker => marker.id === incident.id);
        
        if (!exists) {
          // Create a synthetic marker with random coordinates (since we don't have real ones)
          markers.push({
            id: incident.id,
            website_id: incident.websiteId,
            latitude: Math.random() * 180 - 90, // Random latitude
            longitude: Math.random() * 360 - 180, // Random longitude
            timestamp: incident.timestamp.toISOString(),
            status: 'down',
            location_city: incident.location.city,
            location_country: incident.location.country,
            report_count: incident.meTooCount + 1
          });
        }
      }
    });
    
    return markers;
  };

  const displayMarkers = combinedMapMarkers();

  if (loading && !refreshing) {
    return (
      <div className="flex justify-center items-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <Clock className="animate-spin h-6 w-6 text-blue-500 mr-3" />
        <p className="text-gray-700 dark:text-gray-300">Loading outage map data...</p>
      </div>
    );
  }

  if (error && !outageReports.length && !userReportedOutages.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <p className="text-red-500 dark:text-red-400">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!mapboxToken) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <h2 className="text-xl font-bold text-yellow-800 dark:text-yellow-400 mb-2">Mapbox Token Required</h2>
          <p className="text-yellow-700 dark:text-yellow-300 mb-4">
            To display the outage map, you need to add a Mapbox access token to your environment variables.
          </p>
          <ol className="list-decimal list-inside text-yellow-700 dark:text-yellow-300 space-y-2 ml-4">
            <li>Create a free account at <a href="https://www.mapbox.com/" target="_blank" rel="noopener noreferrer" className="underline">Mapbox.com</a></li>
            <li>Generate an access token in your Mapbox dashboard</li>
            <li>Add the token to your <code className="bg-yellow-100 dark:bg-yellow-900 px-1 py-0.5 rounded">.env</code> file as <code className="bg-yellow-100 dark:bg-yellow-900 px-1 py-0.5 rounded">VITE_MAPBOX_TOKEN=your_token_here</code></li>
            <li>Restart your development server</li>
          </ol>
        </div>
      </div>
    );
  }

  // Function to get website name from URL or ID
  const getWebsiteName = (websiteId: string): string => {
    try {
      if (websiteId === 'twitter') {
        return 'X (Twitter)';
      }
      
      if (websiteId.includes('://')) {
        return new URL(websiteId).hostname.replace('www.', '');
      } else if (websiteId.includes('.')) {
        return websiteId.replace('www.', '');
      } else {
        // Capitalize first letter
        return websiteId.charAt(0).toUpperCase() + websiteId.slice(1);
      }
    } catch (e) {
      return websiteId;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Global Outage Map
          </h1>
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-3 py-1.5 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-1.5 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Map'}
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          View real-time outage reports from users around the world. Red markers indicate reported outages.
        </p>
        
        {usingFallbackData && (
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
            <p className="text-yellow-600 dark:text-yellow-400 text-sm">
              Using offline mode with sample data. Some features may be limited.
            </p>
          </div>
        )}
        
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6 flex items-start">
          <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-600 dark:text-gray-300">
            This map shows user-reported outages for various websites and services. Click on a marker to see details about the reported issue. The data is updated in real-time as users report problems.
          </p>
        </div>
        
        <div className="h-[500px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 relative">
          {refreshing && (
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-10">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg flex items-center">
                <Clock className="animate-spin h-5 w-5 text-blue-500 mr-2" />
                <span className="text-gray-800 dark:text-white">Refreshing map data...</span>
              </div>
            </div>
          )}
          <Map
            {...viewState}
            onMove={evt => setViewState(evt.viewState)}
            mapStyle="mapbox://styles/mapbox/dark-v10"
            mapboxAccessToken={mapboxToken}
            attributionControl={true}
            reuseMaps
          >
            <FullscreenControl position="top-right" />
            <NavigationControl position="top-right" />
            
            {displayMarkers.map(report => (
              <Marker
                key={report.id}
                latitude={report.latitude}
                longitude={report.longitude}
                anchor="bottom"
                onClick={e => {
                  e.originalEvent.stopPropagation();
                  setSelectedReport(report);
                }}
              >
                <div className="cursor-pointer">
                  <MapPin 
                    className={`h-6 w-6 ${report.status === 'down' ? 'text-red-500' : 'text-yellow-500'}`} 
                  />
                </div>
              </Marker>
            ))}
            
            {selectedReport && (
              <Popup
                latitude={selectedReport.latitude}
                longitude={selectedReport.longitude}
                anchor="top"
                onClose={() => setSelectedReport(null)}
                closeButton={true}
                closeOnClick={false}
                className="z-10"
              >
                <div className="p-2">
                  <h3 className="font-medium text-gray-800">
                    {getWebsiteName(selectedReport.website_id)}
                  </h3>
                  <div className="flex items-center mt-1">
                    <AlertTriangle className={`h-4 w-4 mr-1 ${
                      selectedReport.status === 'down' ? 'text-red-500' : 'text-yellow-500'
                    }`} />
                    <span className={`text-sm ${
                      selectedReport.status === 'down' ? 'text-red-500' : 'text-yellow-500'
                    }`}>
                      {selectedReport.status === 'down' ? 'Outage Reported' : 'Issues Reported'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(selectedReport.timestamp), { addSuffix: true })}
                  </p>
                  {(selectedReport.location_city || selectedReport.location_country) && (
                    <p className="text-xs text-gray-500 mt-1">
                      {[selectedReport.location_city, selectedReport.location_country].filter(Boolean).join(', ')}
                    </p>
                  )}
                  {selectedReport.report_count > 1 && (
                    <p className="text-xs font-medium text-red-500 mt-1">
                      {selectedReport.report_count} reports in this area
                    </p>
                  )}
                </div>
              </Popup>
            )}
          </Map>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Recent Outage Reports
          </h2>
          
          {displayMarkers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {displayMarkers.slice(0, 6).map(report => (
                <div 
                  key={report.id} 
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center mb-2">
                    <AlertTriangle className={`h-5 w-5 mr-2 ${
                      report.status === 'down' ? 'text-red-500' : 'text-yellow-500'
                    }`} />
                    <h3 className="font-medium text-gray-800 dark:text-white truncate">
                      {getWebsiteName(report.website_id)}
                    </h3>
                  </div>
                  <p className={`text-sm ${
                    report.status === 'down' ? 'text-red-500' : 'text-yellow-500'
                  } mb-2`}>
                    {report.status === 'down' ? 'Outage Reported' : 'Issues Reported'}
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(report.timestamp), { addSuffix: true })}
                    </p>
                    {report.report_count > 1 && (
                      <div className="flex items-center text-xs text-blue-600 dark:text-blue-400">
                        <span>{report.report_count} reports</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">No recent outage reports</p>
            </div>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Top Reported Websites
          </h2>
          
          {sortedWebsites.length > 0 ? (
            <div className="space-y-4">
              {sortedWebsites.map(([websiteId, reports]) => (
                <div key={websiteId} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-800 dark:text-white">
                      {getWebsiteName(websiteId)}
                    </h3>
                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-full text-xs font-medium">
                      {reports.length} {reports.length === 1 ? 'report' : 'reports'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Latest report: {formatDistanceToNow(new Date(reports[0].timestamp), { addSuffix: true })}
                  </p>
                  <div className="mt-2 flex items-center">
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                      <div 
                        className="bg-red-500 h-2.5 rounded-full" 
                        style={{ width: `${Math.min(100, (reports.length / displayMarkers.length) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 dark:text-gray-400">No website outage data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutageMap;
