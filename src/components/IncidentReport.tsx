import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, ThumbsUp, Users, Activity, WifiOff, Loader, Calendar, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { submitIncidentReport, getRecentIncidents } from '../services/incidentService';
import { Incident, IncidentType } from '../types';
import { formatDistanceToNow, format, isToday, isYesterday, isSameWeek } from 'date-fns';
import { isSupabaseConnected } from '../lib/supabase';
import { getDomainName } from '../utils/urlUtils';

interface IncidentReportProps {
  websiteUrl: string;
  websiteId: string;
}

const IncidentReport: React.FC<IncidentReportProps> = ({ websiteUrl, websiteId }) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userHasReported, setUserHasReported] = useState(false);
  const [showAllIncidents, setShowAllIncidents] = useState(false);
  const [activeTimeFilter, setActiveTimeFilter] = useState<'hour' | 'day' | 'week' | 'all'>('hour');
  const [usingFallbackData, setUsingFallbackData] = useState(false);

  const incidentTypes: { type: IncidentType; icon: React.ReactNode; label: string }[] = [
    { type: 'down', icon: <WifiOff className="h-5 w-5" />, label: 'Down' },
    { type: 'slow', icon: <Clock className="h-5 w-5" />, label: 'Slow' },
    { type: 'intermittent', icon: <Activity className="h-5 w-5" />, label: 'Intermittent' },
    { type: 'partial', icon: <Loader className="h-5 w-5" />, label: 'Partial Outage' }
  ];

  useEffect(() => {
    fetchIncidents();
    
    // Check if user has already reported in this session
    const reportedSites = JSON.parse(localStorage.getItem('reportedSites') || '{}');
    
    // Check by URL domain rather than ID for better matching
    const domain = getDomainName(websiteUrl);
    if (reportedSites[domain]) {
      setUserHasReported(true);
    } else if (reportedSites[websiteId]) {
      setUserHasReported(true);
    }
  }, [websiteId, websiteUrl]);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      
      // Check if Supabase is connected
      const connected = await isSupabaseConnected;
      setUsingFallbackData(!connected);
      
      const data = await getRecentIncidents(websiteId);
      
      // If no incidents found by ID, try to find by URL domain
      if (data.length === 0) {
        const domain = getDomainName(websiteUrl);
        const domainIncidents = await getRecentIncidents(domain);
        setIncidents(domainIncidents);
      } else {
        setIncidents(data);
      }
      
      setError(null);
    } catch (err) {
      console.error('Failed to fetch incidents:', err);
      setError('Failed to load recent reports');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchIncidents();
    } finally {
      setRefreshing(false);
    }
  };

  const handleReportIncident = async (type: IncidentType) => {
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      
      // Check if Supabase is connected
      const connected = await isSupabaseConnected;
      
      if (!connected) {
        // If not connected, just simulate a successful report
        setTimeout(() => {
          // Mark this site as reported by the user using domain for better matching
          const reportedSites = JSON.parse(localStorage.getItem('reportedSites') || '{}');
          const domain = getDomainName(websiteUrl);
          reportedSites[domain] = true;
          reportedSites[websiteId] = true;
          localStorage.setItem('reportedSites', JSON.stringify(reportedSites));
          
          setUserHasReported(true);
          setSuccess('Thank you for your report! (Using offline mode)');
          
          // Add a mock incident to the list
          const mockIncident: Incident = {
            id: Math.random().toString(36).substring(2, 9),
            websiteId,
            websiteUrl,
            type,
            timestamp: new Date(),
            ipAddress: 'anonymous',
            location: {
              city: 'Your Location',
              country: 'Your Country'
            },
            meTooCount: 0
          };
          
          setIncidents(prev => [mockIncident, ...prev]);
        }, 500);
        return;
      }
      
      await submitIncidentReport({
        websiteId,
        websiteUrl,
        type,
        timestamp: new Date(),
        ipAddress: 'anonymous' // In a real app, this would be handled server-side
      });
      
      // Mark this site as reported by the user using domain for better matching
      const reportedSites = JSON.parse(localStorage.getItem('reportedSites') || '{}');
      const domain = getDomainName(websiteUrl);
      reportedSites[domain] = true;
      reportedSites[websiteId] = true;
      localStorage.setItem('reportedSites', JSON.stringify(reportedSites));
      
      setUserHasReported(true);
      setSuccess('Thank you for your report!');
      
      // Refresh the incident list
      fetchIncidents();
    } catch (err) {
      console.error('Failed to submit report:', err);
      setError('Failed to submit your report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMeToo = async (incidentId: string) => {
    try {
      // Check if Supabase is connected
      const connected = await isSupabaseConnected;
      
      if (!connected) {
        // If not connected, just simulate a successful "me too"
        setTimeout(() => {
          // Mark this site as reported by the user using domain for better matching
          const reportedSites = JSON.parse(localStorage.getItem('reportedSites') || '{}');
          const domain = getDomainName(websiteUrl);
          reportedSites[domain] = true;
          reportedSites[websiteId] = true;
          localStorage.setItem('reportedSites', JSON.stringify(reportedSites));
          
          setUserHasReported(true);
          
          // Update the incident in the list
          setIncidents(prev => prev.map(inc => 
            inc.id === incidentId 
              ? { ...inc, meTooCount: inc.meTooCount + 1 } 
              : inc
          ));
        }, 300);
        return;
      }
      
      await submitIncidentReport({
        websiteId,
        websiteUrl,
        type: 'metoo',
        timestamp: new Date(),
        ipAddress: 'anonymous',
        relatedIncidentId: incidentId
      });
      
      // Mark this site as reported by the user using domain for better matching
      const reportedSites = JSON.parse(localStorage.getItem('reportedSites') || '{}');
      const domain = getDomainName(websiteUrl);
      reportedSites[domain] = true;
      reportedSites[websiteId] = true;
      localStorage.setItem('reportedSites', JSON.stringify(reportedSites));
      
      setUserHasReported(true);
      
      // Refresh the incident list
      fetchIncidents();
    } catch (err) {
      console.error('Failed to submit Me Too:', err);
    }
  };

  // Filter incidents based on time
  const getFilteredIncidents = () => {
    const now = new Date();
    
    switch (activeTimeFilter) {
      case 'hour':
        return incidents.filter(incident => 
          now.getTime() - new Date(incident.timestamp).getTime() < 3600000
        );
      case 'day':
        return incidents.filter(incident => 
          isToday(new Date(incident.timestamp)) || isYesterday(new Date(incident.timestamp))
        );
      case 'week':
        return incidents.filter(incident => 
          isSameWeek(new Date(incident.timestamp), now)
        );
      case 'all':
      default:
        return incidents;
    }
  };

  const filteredIncidents = getFilteredIncidents();

  // Group incidents by type and count them
  const incidentCounts = incidents.reduce((acc, incident) => {
    if (incident.type !== 'metoo') {
      acc[incident.type] = (acc[incident.type] || 0) + 1;
    }
    return acc;
  }, {} as Record<IncidentType, number>);

  // Count total reports in the last hour
  const lastHourReports = incidents.filter(
    incident => new Date().getTime() - new Date(incident.timestamp).getTime() < 3600000
  ).length;

  // Group incidents by date for display
  const groupIncidentsByDate = (incidents: Incident[]) => {
    const groups: { [key: string]: Incident[] } = {};
    
    incidents.forEach(incident => {
      const date = new Date(incident.timestamp);
      let groupKey: string;
      
      if (isToday(date)) {
        groupKey = 'Today';
      } else if (isYesterday(date)) {
        groupKey = 'Yesterday';
      } else {
        groupKey = format(date, 'MMMM d, yyyy');
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      
      groups[groupKey].push(incident);
    });
    
    return groups;
  };

  const groupedIncidents = groupIncidentsByDate(filteredIncidents);

  // Format the incident type for display
  const formatIncidentType = (type: IncidentType): string => {
    switch (type) {
      case 'down': return 'Website Down';
      case 'slow': return 'Slow Performance';
      case 'intermittent': return 'Intermittent Issues';
      case 'partial': return 'Partial Outage';
      default: return type;
    }
  };

  // Get icon for incident type
  const getIncidentIcon = (type: IncidentType) => {
    switch (type) {
      case 'down': return <WifiOff className="h-5 w-5 text-red-500 mr-2" />;
      case 'slow': return <Clock className="h-5 w-5 text-yellow-500 mr-2" />;
      case 'intermittent': return <Activity className="h-5 w-5 text-orange-500 mr-2" />;
      case 'partial': return <Loader className="h-5 w-5 text-purple-500 mr-2" />;
      default: return <AlertTriangle className="h-5 w-5 text-gray-500 mr-2" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          User Reports for {getDomainName(websiteUrl)}
        </h2>
        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center px-3 py-1.5 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors"
          aria-label="Refresh user reports"
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
      
      {loading && !refreshing ? (
        <div className="flex justify-center items-center p-4">
          <Clock className="animate-spin h-5 w-5 text-blue-500 mr-2" />
          <p>Loading reports...</p>
        </div>
      ) : (
        <>
          {refreshing && (
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center z-10 rounded-lg">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg flex items-center">
                  <Clock className="animate-spin h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-gray-800 dark:text-white">Refreshing user reports...</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Report summary */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <Users className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-gray-700 dark:text-gray-300">
                {lastHourReports} {lastHourReports === 1 ? 'user has' : 'users have'} reported issues in the last hour
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
              {incidentTypes.map(({ type, icon, label }) => (
                <div key={type} className="bg-gray-50 dark:bg-gray-700 rounded-md p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    {icon}
                    <span className="ml-2 text-gray-700 dark:text-gray-300">{label}</span>
                  </div>
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {incidentCounts[type] || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Report buttons */}
          {!userHasReported ? (
            <div className="mb-6">
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Having issues with this website? Let others know:
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {incidentTypes.map(({ type, icon, label }) => (
                  <button
                    key={type}
                    onClick={() => handleReportIncident(type)}
                    disabled={submitting}
                    className="flex items-center justify-center px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                  >
                    {icon}
                    <span className="ml-2">{label}</span>
                  </button>
                ))}
              </div>
              
              {error && (
                <div className="mt-3 text-red-500 text-sm">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="mt-3 text-green-500 text-sm">
                  {success}
                </div>
              )}
            </div>
          ) : (
            <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
              <p className="text-blue-600 dark:text-blue-400">
                Thanks for your report! We've recorded your feedback.
              </p>
            </div>
          )}
          
          {/* Time filter tabs */}
          {incidents.length > 0 && (
            <div className="mb-4">
              <div className="flex space-x-1 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setActiveTimeFilter('hour')}
                  className={`px-3 py-2 text-sm font-medium ${
                    activeTimeFilter === 'hour'
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Last Hour
                </button>
                <button
                  onClick={() => setActiveTimeFilter('day')}
                  className={`px-3 py-2 text-sm font-medium ${
                    activeTimeFilter === 'day'
                      ? 'text- blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  24 Hours
                </button>
                <button
                  onClick={() => setActiveTimeFilter('week')}
                  className={`px-3 py-2 text-sm font-medium ${
                    activeTimeFilter === 'week'
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  This Week
                </button>
                <button
                  onClick={() => setActiveTimeFilter('all')}
                  className={`px-3 py-2 text-sm font-medium ${
                    activeTimeFilter === 'all'
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-500'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  All Time
                </button>
              </div>
            </div>
          )}
          
          {/* Recent reports */}
          {incidents.length > 0 ? (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Recent Reports
                </h3>
                {filteredIncidents.length > 5 && (
                  <button 
                    onClick={() => setShowAllIncidents(!showAllIncidents)}
                    className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {showAllIncidents ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-1" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-1" />
                        Show All ({filteredIncidents.length})
                      </>
                    )}
                  </button>
                )}
              </div>
              
              <div className="space-y-4">
                {Object.entries(groupedIncidents).map(([date, dateIncidents]) => (
                  <div key={date} className="space-y-2">
                    <div className="flex items-center mb-1">
                      <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-300">{date}</h4>
                    </div>
                    
                    <div className="space-y-2">
                      {(showAllIncidents ? dateIncidents : dateIncidents.slice(0, date === 'Today' ? 5 : 2)).map(incident => (
                        <div key={incident.id} className="bg-gray-50 dark:bg-gray-700 rounded-md p-3">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center">
                              {getIncidentIcon(incident.type)}
                              
                              <div>
                                <p className="text-gray-800 dark:text-white font-medium">
                                  {formatIncidentType(incident.type)}
                                </p>
                                <div className="text-sm text-gray-500 dark:text-gray-400 flex flex-wrap items-center">
                                  <span>{formatDistanceToNow(new Date(incident.timestamp), { addSuffix: true })}</span>
                                  {incident.location && (
                                    <>
                                      <span className="mx-1">•</span>
                                      <span>{incident.location.city}, {incident.location.country}</span>
                                    </>
                                  )}
                                  <span className="mx-1">•</span>
                                  <span>{format(new Date(incident.timestamp), 'h:mm a')}</span>
                                </div>
                              </div>
                            </div>
                            
                            <button
                              onClick={() => handleMeToo(incident.id)}
                              disabled={userHasReported}
                              className={`flex items-center px-2 py-1 rounded-md text-sm ${
                                userHasReported
                                  ? 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                  : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/30'
                              }`}
                            >
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              <span>Me too ({incident.meTooCount || 0})</span>
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      {!showAllIncidents && dateIncidents.length > (date === 'Today' ? 5 : 2) && (
                        <button 
                          onClick={() => setShowAllIncidents(true)}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline ml-8"
                        >
                          + {dateIncidents.length - (date === 'Today' ? 5 : 2)} more from {date.toLowerCase()}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 dark:text-gray-300">No incidents reported yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Be the first to report an issue with this website
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default IncidentReport;
