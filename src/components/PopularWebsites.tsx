import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPopularWebsites } from '../services/websiteService';
import { Website, Incident } from '../types';
import { CheckCircle, XCircle, Clock, ExternalLink, RefreshCw, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { isSupabaseConnected } from '../lib/supabase';
import { supabase } from '../lib/supabase';
import { getMonitoringStatus, refreshWebsiteList } from '../services/monitoringService';
import { getRecentOutageIncidents } from '../services/incidentService';
import { getDomainName } from '../utils/urlUtils';

const PopularWebsites: React.FC = () => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [userReportedOutages, setUserReportedOutages] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usingFallbackData, setUsingFallbackData] = useState(false);
  const [monitoringStatus, setMonitoringStatus] = useState<{
    isRunning: boolean;
    websiteCount: number;
    currentIndex: number;
  } | null>(null);
  const navigate = useNavigate();

  const fetchWebsites = async () => {
    try {
      setLoading(true);
      
      // Check if Supabase is connected
      const connected = await isSupabaseConnected;
      setUsingFallbackData(!connected);
      
      const data = await getPopularWebsites();
      setWebsites(data);
      setError(null);
    } catch (err) {
      console.error('Error getting popular websites:', err);
      setError('Failed to load popular websites');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchUserReportedOutages = async () => {
    try {
      // Check if Supabase is connected
      const connected = await isSupabaseConnected;
      
      if (!connected) {
        console.log('Supabase not connected, skipping user reported outages fetch');
        return;
      }
      
      // Get recent outage incidents (down or partial) from the last 24 hours
      const incidents = await getRecentOutageIncidents();
      setUserReportedOutages(incidents);
      
      // Update website statuses based on user reports
      updateWebsiteStatusesFromReports(incidents);
    } catch (err) {
      console.error('Failed to fetch user reported outages:', err);
    }
  };

  // Update website statuses based on user reports
  const updateWebsiteStatusesFromReports = (incidents: Incident[]) => {
    if (incidents.length === 0 || websites.length === 0) return;
    
    // Create a map of website IDs to their latest incident
    const latestIncidentsByWebsite = new Map<string, Incident>();
    
    incidents.forEach(incident => {
      const websiteId = incident.websiteId;
      const existingIncident = latestIncidentsByWebsite.get(websiteId);
      
      // If no incident exists for this website yet, or this one is more recent
      if (!existingIncident || new Date(incident.timestamp) > new Date(existingIncident.timestamp)) {
        latestIncidentsByWebsite.set(websiteId, incident);
      }
    });
    
    // Update website statuses based on incidents
    setWebsites(prevWebsites => {
      return prevWebsites.map(website => {
        // Try to find by ID first
        let incident = latestIncidentsByWebsite.get(website.id);
        
        // If not found by ID, try to find by URL
        if (!incident) {
          const websiteHostname = getDomainName(website.url);
          
          // Look through all incidents
          for (const [_, inc] of latestIncidentsByWebsite.entries()) {
            try {
              const incidentHostname = getDomainName(inc.websiteUrl);
              if (incidentHostname === websiteHostname) {
                incident = inc;
                break;
              }
            } catch (e) {
              // Skip if URL parsing fails
              continue;
            }
          }
        }
        
        // If we found a relevant incident that's recent (within last 24 hours)
        if (incident && new Date().getTime() - new Date(incident.timestamp).getTime() < 24 * 60 * 60 * 1000) {
          // Only update if the incident is for a down or partial outage
          if (incident.type === 'down' || incident.type === 'partial') {
            return {
              ...website,
              userReported: true,
              incidentType: incident.type,
              reportCount: incident.meTooCount + 1,
              reportTimestamp: incident.timestamp
            };
          }
        }
        
        return website;
      });
    });
  };

  useEffect(() => {
    fetchWebsites();
    fetchUserReportedOutages();
    
    // Get monitoring status
    setMonitoringStatus(getMonitoringStatus());
    
    // Set up an interval to refresh the data every 60 seconds
    const intervalId = setInterval(() => {
      fetchWebsites();
      fetchUserReportedOutages();
      setMonitoringStatus(getMonitoringStatus());
    }, 60000);
    
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
    
    // Set up real-time subscription for websites
    const websiteSubscription = supabase
      .channel('websites_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'websites' }, 
        () => {
          // Refresh data when changes occur
          fetchWebsites();
        }
      )
      .subscribe();
    
    // Listen for data clearing events
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dataCleared' && e.newValue === 'true') {
        // Refresh data when data is cleared
        fetchWebsites();
        fetchUserReportedOutages();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also check for the flag directly in case the event was missed
    if (localStorage.getItem('dataCleared') === 'true') {
      fetchWebsites();
      fetchUserReportedOutages();
      // Clear the flag after handling it
      localStorage.removeItem('dataCleared');
    }
    
    // Custom event listener for data clearing
    const handleDataCleared = () => {
      console.log("Data cleared event received in PopularWebsites");
      fetchWebsites();
      fetchUserReportedOutages();
    };
    
    window.addEventListener('data-cleared', handleDataCleared);
    
    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
      incidentSubscription.unsubscribe();
      websiteSubscription.unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('data-cleared', handleDataCleared);
    };
  }, []);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      
      // Refresh the website list in the monitoring service
      await refreshWebsiteList();
      
      // Update monitoring status
      setMonitoringStatus(getMonitoringStatus());
      
      // Fetch websites and user reported outages
      await Promise.all([fetchWebsites(), fetchUserReportedOutages()]);
    } finally {
      setRefreshing(false);
    }
  };

  const handleWebsiteClick = (website: Website) => {
    // Navigate to the homepage with the website parameter
    navigate(`/?website=${encodeURIComponent(website.url)}`);
    
    // Scroll to the top of the page where the search bar is
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Focus on the website checker section
    const websiteCheckerElement = document.getElementById('website-checker');
    if ( websiteCheckerElement) {
      websiteCheckerElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Check if an outage was reported within the last 24 hours
  const wasOutageReportedToday = (website: Website): boolean => {
    return !!website.userReported && !!website.reportTimestamp && 
      (new Date().getTime() - new Date(website.reportTimestamp).getTime() < 24 * 60 * 60 * 1000);
  };

  if (loading && !refreshing) {
    return (
      <div className="flex justify-center items-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <Clock className="animate-spin h-6 w-6 text-blue-500 mr-3" />
        <p className="text-gray-700 dark:text-gray-300">Loading popular websites...</p>
      </div>
    );
  }

  if (error && !websites.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <p className="text-red-500 dark:text-red-400">{error}</p>
          <button 
            onClick={fetchWebsites}
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
            Popular Websites
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
            Current status of frequently monitored services
            {monitoringStatus?.isRunning && (
              <span className="ml-1 text-xs text-green-500">
                (Auto-updating)
              </span>
            )}
          </p>
        </div>
        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center px-3 py-1.5 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors"
          aria-label="Refresh website statuses"
        >
          <RefreshCw className={`h-4 w-4 mr-1.5 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      
      {usingFallbackData && (
        <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
          <p className="text-yellow-600 dark:text-yellow-400 text-sm">
            Using offline mode. Some features may be limited.
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 relative">
        {refreshing && (
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center z-10 rounded-lg">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg flex items-center">
              <Clock className="animate-spin h-5 w-5 text-blue-500 mr-2" />
              <span className="text-gray-800 dark:text-white">Refreshing website data...</span>
            </div>
          </div>
        )}
        
        {websites.map((website) => (
          <div
            key={website.id}
            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex flex-col items-center hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleWebsiteClick(website)}
          >
            <div className="mb-2">
              {wasOutageReportedToday(website) ? (
                <XCircle className="h-8 w-8 text-red-500" />
              ) : (
                <CheckCircle className="h-8 w-8 text-green-500" />
              )}
            </div>
            <p className="text-gray-800 dark:text-white font-medium text-center truncate w-full mb-1">
              {getDomainName(website.url)}
            </p>
            
            {wasOutageReportedToday(website) ? (
              <p className="text-sm text-red-500 mb-2">
                Outage reported {website.reportTimestamp && formatDistanceToNow(new Date(website.reportTimestamp), { addSuffix: true })}
              </p>
            ) : (
              <p className="text-sm text-green-500 mb-2">
                No outages reported today
              </p>
            )}
            
            {wasOutageReportedToday(website) && website.reportCount && website.reportCount > 0 && (
              <p className="text-xs text-red-500 mb-2">
                {website.reportCount} {website.reportCount === 1 ? 'report' : 'reports'}
              </p>
            )}
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Last checked: {formatDistanceToNow(new Date(website.lastChecked), { addSuffix: true })}
            </p>
            
            <a 
              href={website.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Visit
            </a>
          </div>
        ))}
      </div>
      
      {monitoringStatus?.isRunning && (
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-right">
          Monitoring {monitoringStatus.websiteCount} websites (one every 5 minutes)
        </div>
      )}
    </div>
  );
};

export default PopularWebsites;
