import React, { useState, useEffect } from 'react';
import { getPopularWebsites, checkWebsiteStatus } from '../services/websiteService';
import { Website, Incident } from '../types';
import { CheckCircle, XCircle, Clock, Bell, BellOff, ExternalLink, RefreshCw, AlertCircle, Search, PlusCircle, Trash2, Globe } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import UptimeChart from '../components/UptimeChart';
import IncidentReport from '../components/IncidentReport';
import { useAuth } from '../contexts/AuthContext';
import { formatUrl, isValidUrl } from '../utils/urlUtils';
import { supabase } from '../lib/supabase';
import { isSupabaseConnected } from '../lib/supabase';
import { getRecentOutageIncidents } from '../services/incidentService';

const UptimeMonitor: React.FC = () => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [userReportedOutages, setUserReportedOutages] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedWebsite, setSelectedWebsite] = useState<Website | null>(null);
  const [monitoredWebsites, setMonitoredWebsites] = useState<Record<string, boolean>>({});
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [statusResult, setStatusResult] = useState<Website | null>(null);
  const [newWebsiteUrl, setNewWebsiteUrl] = useState('');
  const [addingWebsite, setAddingWebsite] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [showIncidentReport, setShowIncidentReport] = useState(false);
  const { user } = useAuth();

  const fetchWebsites = async () => {
    try {
      setLoading(true);
      const data = await getPopularWebsites();
      setWebsites(data);
      setError(null);
    } catch (err) {
      setError('Failed to load website data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReportedOutages = async () => {
    try {
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
          const websiteHostname = new URL(website.url).hostname.replace('www.', '');
          
          // Look through all incidents
          for (const [_, inc] of latestIncidentsByWebsite.entries()) {
            try {
              const incidentHostname = new URL(inc.websiteUrl).hostname.replace('www.', '');
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
    
    // Load monitored websites from localStorage
    const storedMonitored = localStorage.getItem('monitoredWebsites');
    if (storedMonitored) {
      setMonitoredWebsites(JSON.parse(storedMonitored));
    }
    
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
    
    // Clean up subscriptions when component unmounts
    return () => {
      incidentSubscription.unsubscribe();
      websiteSubscription.unsubscribe();
    };
  }, []);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await Promise.all([fetchWebsites(), fetchUserReportedOutages()]);
    } finally {
      setRefreshing(false);
    }
  };

  const toggleMonitor = (websiteId: string) => {
    const updatedMonitored = {
      ...monitoredWebsites,
      [websiteId]: !monitoredWebsites[websiteId]
    };
    
    // If false, remove it from the object
    if (!updatedMonitored[websiteId]) {
      delete updatedMonitored[websiteId];
    }
    
    setMonitoredWebsites(updatedMonitored);
    localStorage.setItem('monitoredWebsites', JSON.stringify(updatedMonitored));
  };

  const handleCheckNow = async () => {
    if (!selectedWebsite) return;
    
    try {
      setCheckingStatus(true);
      setStatusResult(null);
      
      const result = await checkWebsiteStatus(selectedWebsite.url);
      setStatusResult(result);
      
      // Update the selected website with the new status
      setSelectedWebsite(result);
      
      // Also update the website in the list
      setWebsites(prevWebsites => 
        prevWebsites.map(website => 
          website.id === result.id ? result : website
        )
      );
      
      // Show incident report after checking
      setShowIncidentReport(true);
    } catch (err) {
      console.error('Error checking website status:', err);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleAddWebsite = async () => {
    try {
      setAddingWebsite(true);
      setAddError(null);
      
      if (!newWebsiteUrl.trim()) {
        setAddError('Please enter a website URL');
        return;
      }
      
      const formattedUrl = formatUrl(newWebsiteUrl);
      
      if (!isValidUrl(formattedUrl)) {
        setAddError('Please enter a valid URL');
        return;
      }
      
      // Check if the website is already in the list
      const existingWebsite = websites.find(website => 
        website.url.toLowerCase() === formattedUrl.toLowerCase()
      );
      
      if (existingWebsite) {
        // If it exists, just select it
        setSelectedWebsite(existingWebsite);
        // And add it to monitored websites
        toggleMonitor(existingWebsite.id);
        setNewWebsiteUrl('');
        // Show incident report
        setShowIncidentReport(true);
        return;
      }
      
      // Otherwise, check the website status
      const result = await checkWebsiteStatus(formattedUrl);
      
      // Add to websites list
      setWebsites(prevWebsites => [...prevWebsites, result]);
      
      // Select the new website
      setSelectedWebsite(result);
      
      // Add to monitored websites
      toggleMonitor(result.id);
      
      // Clear the input
      setNewWebsiteUrl('');
      
      // Show incident report
      setShowIncidentReport(true);
    } catch (err) {
      console.error('Error adding website:', err);
      setAddError('Failed to add website. Please try again.');
    } finally {
      setAddingWebsite(false);
    }
  };

  const handleRemoveWebsite = (websiteId: string) => {
    // Remove from monitored websites
    const updatedMonitored = { ...monitoredWebsites };
    delete updatedMonitored[websiteId];
    setMonitoredWebsites(updatedMonitored);
    localStorage.setItem('monitoredWebsites', JSON.stringify(updatedMonitored));
    
    // If the selected website is being removed, clear the selection
    if (selectedWebsite && selectedWebsite.id === websiteId) {
      setSelectedWebsite(null);
      setStatusResult(null);
      setShowIncidentReport(false);
    }
  };

  // Filter websites to only show monitored ones
  const monitoredWebsitesList = websites.filter(website => monitoredWebsites[website.id]);

  // Check if an outage was reported within the last 24 hours
  const wasOutageReportedToday = (website: Website): boolean => {
    return !!website.userReported && !!website.reportTimestamp && 
      (new Date().getTime() - new Date(website.reportTimestamp).getTime() < 24 * 60 * 60 * 1000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <Clock className="animate-spin h-6 w-6 text-blue-500 mr-3" />
        <p className="text-gray-700 dark:text-gray-300">Loading uptime data...</p>
      </div>
    );
  }

  if (error) {
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
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Uptime Monitor
          </h1>
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-3 py-1.5 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-1.5 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Monitor the uptime and performance of your websites and services. Add websites below to start monitoring.
        </p>
        
        {!user && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
            <p className="text-blue-600 dark:text-blue-400 text-sm">
              <a href="/login" className="font-medium underline">Sign in</a> or <a href="/register" className="font-medium underline">create an account</a> to set up personalized uptime monitoring for any website and receive alerts when they go down.
            </p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 h-[600px] overflow-y-auto">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                Add Website to Monitor
              </h2>
              <div className="flex">
                <input
                  type="text"
                  value={newWebsiteUrl}
                  onChange={(e) => setNewWebsiteUrl(e.target.value)}
                  placeholder="Enter website URL (e.g., google.com)"
                  className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={addingWebsite}
                />
                <button
                  onClick={handleAddWebsite}
                  disabled={addingWebsite}
                  className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition-colors flex items-center"
                >
                  {addingWebsite ? (
                    <Clock className="animate-spin h-5 w-5" />
                  ) : (
                    <PlusCircle className="h-5 w-5" />
                  )}
                </button>
              </div>
              {addError && (
                <p className="mt-2 text-sm text-red-500">{addError}</p>
              )}
            </div>
            
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 mt-6">
              Monitored Websites
            </h2>
            
            {monitoredWebsitesList.length === 0 ? (
              <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg">
                <Globe className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400 mb-2">No websites monitored yet</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Add websites above to start monitoring their uptime
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {monitoredWebsitesList.map(website => (
                  <div 
                    key={website.id}
                    onClick={() => {
                      setSelectedWebsite(website);
                      setShowIncidentReport(true);
                    }}
                    className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${
                      selectedWebsite?.id === website.id 
                        ? 'bg-blue-100 dark:bg-blue-800/30' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center">
                      {wasOutageReportedToday(website) ? (
                        <XCircle className="h-5 w-5 text-red-500 mr-2" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      )}
                      <span className="text-gray-800 dark:text-white truncate max-w-[120px]">
                        {new URL(website.url).hostname.replace('www.', '')}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveWebsite(website.id);
                        }}
                        className="p-1 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                        title="Remove from monitoring"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-800 dark:text-white mb-2">
                Popular Websites
              </h3>
              <div className="space-y-2">
                {websites.slice(0, 5).map(website => (
                  <div 
                    key={website.id}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center">
                      {wasOutageReportedToday(website) ? (
                        <XCircle className="h-4 w-4 text-red-500 mr-2" />
                      ) : (
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      )}
                      <span className="text-sm text-gray-800 dark:text-white truncate max-w-[120px]">
                        {new URL(website.url).hostname.replace('www.', '')}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => {
                        setSelectedWebsite(website);
                        toggleMonitor(website.id);
                        setShowIncidentReport(true);
                      }}
                      className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors"
                    >
                      Monitor
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            {selectedWebsite ? (
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        {new URL(selectedWebsite.url).hostname.replace('www.', '')}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Last checked: {formatDistanceToNow(new Date(selectedWebsite.lastChecked), { addSuffix: true })}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        wasOutageReportedToday(selectedWebsite)
                          ? 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400'
                          : 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400'
                      }`}>
                        {wasOutageReportedToday(selectedWebsite) ? 'OUTAGE REPORTED' : 'UP'}
                      </span>
                      
                      <a 
                        href={selectedWebsite.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-md">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                      <p className={`text-lg font-semibold ${
                        wasOutageReportedToday(selectedWebsite) ? 'text-red-500' : 'text-green-500'
                      }`}>
                        {wasOutageReportedToday(selectedWebsite) ? 'Outage Reported' : 'Operational'}
                      </p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-md">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Response Time</p>
                      <p className="text-lg font-semibold text-gray-800 dark:text-white">
                        {selectedWebsite.responseTime ? `${selectedWebsite.responseTime}ms` : 'N/A'}
                      </p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-md">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Monitoring</p>
                      <p className="text-lg font-semibold text-gray-800 dark:text-white">
                        {monitoredWebsites[selectedWebsite.id] ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                  
                  {wasOutageReportedToday(selectedWebsite) && selectedWebsite.reportTimestamp && (
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md mb-4">
                      <p className="text-red-600 dark:text-red-400">
                        <strong>Outage reported:</strong> {formatDistanceToNow(new Date(selectedWebsite.reportTimestamp), { addSuffix: true })}
                      </p>
                      {selectedWebsite.reportCount && selectedWebsite.reportCount > 0 && (
                        <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                          {selectedWebsite.reportCount} {selectedWebsite.reportCount === 1 ? 'user has' : 'users have'} reported this outage
                        </p>
                      )}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => toggleMonitor(selectedWebsite.id)}
                      className={`px-4 py-2 rounded-md text-white ${
                        monitoredWebsites[selectedWebsite.id]
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-blue-500 hover:bg-blue-600'
                      } transition-colors`}
                    >
                      {monitoredWebsites[selectedWebsite.id] ? (
                        <>
                          <BellOff className="h-4 w-4 inline mr-1" />
                          Stop Monitoring
                        </>
                      ) : (
                        <>
                          <Bell className="h-4 w-4 inline mr-1" />
                          Monitor This Website
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={handleCheckNow}
                      disabled={checkingStatus}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors flex items-center"
                    >
                      {checkingStatus ? (
                        <>
                          <Clock className="animate-spin h-4 w-4 mr-2" />
                          Checking...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Check Now
                        </>
                      )}
                    </button>
                  </div>
                  
                  {/* Status check result */}
                  {statusResult && (
                    <div className={`mt-4 p-4 rounded-lg ${
                      statusResult.status === 'up'
                        ? 'bg-green-50 dark:bg-green-900/20'
                        : 'bg-red-50 dark:bg-red-900/20'
                    }`}>
                      <div className="flex items-center mb-2">
                        {statusResult.status === 'up' ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                        )}
                        <h3 className="font-medium text-gray-800 dark:text-white">
                          {statusResult.status === 'up'
                            ? "It's just you! The website is UP."
                            : "It's not just you! The website appears to be DOWN."}
                        </h3>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 rounded-md p-3">
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-semibold">URL checked:</span> {statusResult.url}
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-semibold">Status:</span>{' '}
                          <span className={statusResult.status === 'up' ? 'text-green-500' : 'text-red-500'}>
                            {statusResult.status.toUpperCase()}
                          </span>
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-semibold">Last checked:</span>{' '}
                          {new Date(statusResult.lastChecked).toLocaleString()}
                        </p>
                        {statusResult.responseTime && (
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-semibold">Response time:</span>{' '}
                            {statusResult.responseTime}ms
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Incident Report Component */}
                {showIncidentReport && (
                  <div className="mt-6">
                    <IncidentReport 
                      websiteUrl={selectedWebsite.url} 
                      websiteId={selectedWebsite.id} 
                    />
                  </div>
                )}
                
                <UptimeChart 
                  websiteId={selectedWebsite.id} 
                  websiteUrl={selectedWebsite.url} 
                  timeRange="24h" 
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-gray-50 dark:bg-gray-700 rounded-lg p-8">
                <Globe className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  Add Websites to Monitor
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-center mb-6 max-w-md">
                  Start by adding websites you want to monitor. You'll be able to track their uptime, 
                  response times, and receive notifications when they go down.
                </p>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-2 mr-3">
                      <PlusCircle className="h-5 w-5 text-blue-500" />
                    </div>
                    <span>Add a website using the form on the left</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-2 mr-3">
                      <Bell className="h-5 w-5 text-blue-500" />
                    </div>
                    <span>Monitor its status in real-time</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-2 mr-3">
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                    </div>
                    <span>Get notified when websites go down</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UptimeMonitor;
