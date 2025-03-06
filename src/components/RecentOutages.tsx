import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, Clock, ExternalLink, MapPin, Users, RefreshCw } from 'lucide-react';
import { OutageReport, Incident } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '../lib/supabase';
import { getRecentOutageIncidents } from '../services/incidentService';
import { isSupabaseConnected } from '../lib/supabase';
import { getDomainName } from '../utils/urlUtils';

const RecentOutages: React.FC = () => {
  const [outageReports, setOutageReports] = useState<OutageReport[]>([]);
  const [userReportedOutages, setUserReportedOutages] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchOutageReports = async () => {
    try {
      setLoading(true);
      
      // Get real-time data from Supabase
      const { data, error } = await supabase
        .from('outage_reports')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      
      // Convert to our OutageReport type
      const formattedReports: OutageReport[] = (data || []).map(report => ({
        id: report.id,
        websiteId: report.website_id,
        latitude: report.latitude,
        longitude: report.longitude,
        timestamp: new Date(report.timestamp),
        status: report.status as 'up' | 'down'
      }));
      
      setOutageReports(formattedReports);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch outage reports:', err);
      setError('Failed to load recent outages');
      
      // Don't use mock data anymore - we want to show empty state
      setOutageReports([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

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
    
    // Listen for data clearing events
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dataCleared' && e.newValue === 'true') {
        // Refresh data when data is cleared
        fetchOutageReports();
        fetchUserReportedOutages();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check for the flag directly in case the event was missed
    if (localStorage.getItem('dataCleared') === 'true') {
      fetchOutageReports();
      fetchUserReportedOutages();
      // Clear the flag after handling it
      localStorage.removeItem('dataCleared');
    }
    
    // Custom event listener for data clearing
    const handleDataCleared = () => {
      console.log("Data cleared event received in RecentOutages");
      fetchOutageReports();
      fetchUserReportedOutages();
    };
    
    window.addEventListener('data-cleared', handleDataCleared);
    
    return () => {
      outageSubscription.unsubscribe();
      incidentSubscription.unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('data-cleared', handleDataCleared);
    };
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchOutageReports(), fetchUserReportedOutages()]);
  };

  // Function to get website name from URL or ID
  const getWebsiteName = (websiteId: string): string => {
    try {
      if (websiteId === 'twitter') {
        return 'X (Twitter)';
      }
      
      if (websiteId.includes('://')) {
        return getDomainName(websiteId);
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

  // Handle website click - navigate to website checker with the website
  const handleWebsiteClick = (websiteId: string) => {
    let url = websiteId;
    
    // Handle special cases
    if (websiteId === 'twitter') {
      url = 'twitter.com';
    } else if (!websiteId.includes('.') && !websiteId.includes('://')) {
      url = `${websiteId}.com`;
    }
    
    // Navigate to the homepage with the website parameter
    navigate(`/?website=${encodeURIComponent(url)}`);
    
    // Scroll to the top of the page where the search bar is
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Focus on the website checker section
    const websiteCheckerElement = document.getElementById('website-checker');
    if (websiteCheckerElement) {
      websiteCheckerElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Combine outage reports and user reported outages
  const combinedOutages = () => {
    // Start with outage reports
    const combined = [...outageReports];
    
    // Add user reported outages that aren't already in the list
    userReportedOutages.forEach(incident => {
      // Extract domain from websiteUrl for better matching
      const incidentDomain = getDomainName(incident.websiteUrl);
      
      // Check if this website is already in the list
      const existingIndex = combined.findIndex(report => {
        // Try to match by ID first
        if (report.websiteId === incident.websiteId) return true;
        
        // Then try to match by domain
        const reportDomain = getWebsiteName(report.websiteId);
        return reportDomain === incidentDomain;
      });
      
      if (existingIndex === -1) {
        // If not in the list, add it as an OutageReport
        combined.push({
          id: incident.id,
          websiteId: incident.websiteUrl, // Use full URL for better display
          latitude: 0, // We don't have this info from incidents
          longitude: 0, // We don't have this info from incidents
          timestamp: incident.timestamp,
          status: 'down'
        });
      } else if (new Date(incident.timestamp) > new Date(combined[existingIndex].timestamp)) {
        // If in the list but this incident is more recent, update the timestamp
        combined[existingIndex].timestamp = incident.timestamp;
      }
    });
    
    // Sort by timestamp (most recent first)
    return combined.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, 6); // Limit to 6 items
  };

  const displayOutages = combinedOutages();

  if (loading && !refreshing) {
    return (
      <div className="flex justify-center items-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <Clock className="animate-spin h-6 w-6 text-blue-500 mr-3" />
        <p className="text-gray-700 dark:text-gray-300">Loading recent outages...</p>
      </div>
    );
  }

  if (error && !outageReports.length && !userReportedOutages.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <p className="text-red-500 dark:text-red-400">{error}</p>
          <button 
            onClick={fetchOutageReports}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Recent Outages
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
            Major service disruptions reported by users
          </p>
        </div>
        <div className="flex items-center">
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-3 py-1.5 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors mr-2"
            aria-label="Refresh outage reports"
          >
            <RefreshCw className={`h-4 w-4 mr-1.5 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <Link 
            to="/outage-map" 
            className="flex items-center px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <MapPin className="h-4 w-4 mr-1.5" />
            View Map
          </Link>
        </div>
      </div>
      
      {refreshing && (
        <div className="relative">
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center z-10 rounded-lg">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg flex items-center">
              <Clock className="animate-spin h-5 w-5 text-blue-500 mr-2" />
              <span className="text-gray-800 dark:text-white">Refreshing outage data...</span>
            </div>
          </div>
        </div>
      )}
      
      {displayOutages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {displayOutages.map(report => (
            <div 
              key={report.id} 
              className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleWebsiteClick(report.websiteId)}
            >
              <div className="flex items-center mb-2">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                <h3 className="font-medium text-gray-800 dark:text-white truncate">
                  {getWebsiteName(report.websiteId)}
                </h3>
              </div>
              <p className="text-sm text-red-600 dark:text-red-400 mb-2">
                Outage Reported
              </p>
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(report.timestamp), { addSuffix: true })}
                </p>
                <div className="flex items-center text-xs text-blue-600 dark:text-blue-400">
                  <Users className="h-3 w-3 mr-1" />
                  <span>Multiple reports</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <AlertTriangle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 dark:text-gray-300">No major outages reported</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            All monitored services appear to be operating normally
          </p>
        </div>
      )}
      
      <div className="mt-6 text-center">
        <Link 
          to="/outage-map" 
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
        >
          View global outage map
          <ExternalLink className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default RecentOutages;
