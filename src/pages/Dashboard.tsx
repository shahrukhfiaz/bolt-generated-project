import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Website } from '../types';
import { getPopularWebsites } from '../services/websiteService';
import { Bell, Settings, PlusCircle, Trash2, ExternalLink, Clock, RefreshCw, AlertTriangle } from 'lucide-react';
import { clearAllData } from '../services/clearDataService';
import { requestNotificationPermission, setupNotifications } from '../services/notificationService';
import { supabase } from '../lib/supabase';
import AdminControls from '../components/AdminControls';
import UserManagement from '../components/UserManagement';

const Dashboard: React.FC = () => {
  const { user, isSuperAdmin } = useAuth();
  const [monitoredWebsites, setMonitoredWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [newWebsiteUrl, setNewWebsiteUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'monitored' | 'reports' | 'settings' | 'users'>('monitored');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | null>(null);
  const [userProfile, setUserProfile] = useState<{
    username: string;
    email: string;
    createdAt: Date;
  } | null>(null);

  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        setLoading(true);
        // In a real app, we would fetch the user's monitored websites
        // For this demo, we'll use the popular websites as a placeholder
        const websites = await getPopularWebsites();
        setMonitoredWebsites(websites.slice(0, 3)); // Just use the first 3 for demo
      } catch (err) {
        console.error('Failed to fetch monitored websites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWebsites();
    
    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
      setNotificationsEnabled(localStorage.getItem('notificationsEnabled') === 'true');
    }
    
    // Fetch user profile if user is logged in
    if (user) {
      fetchUserProfile(user.id);
    }
  }, [user]);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, email, created_at')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }
      
      if (data) {
        setUserProfile({
          username: data.username,
          email: data.email,
          createdAt: new Date(data.created_at)
        });
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
    }
  };

  const handleAddWebsite = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newWebsiteUrl.trim()) return;
    
    // In a real app, we would add this to the user's monitored websites
    // For this demo, we'll just add it to the local state
    const newWebsite: Website = {
      id: Math.random().toString(36).substring(2, 9),
      url: newWebsiteUrl.startsWith('http') ? newWebsiteUrl : `https://${newWebsiteUrl}`,
      status: 'up',
      lastChecked: new Date()
    };
    
    setMonitoredWebsites([...monitoredWebsites, newWebsite]);
    setNewWebsiteUrl('');
  };

  const handleRemoveWebsite = (id: string) => {
    setMonitoredWebsites(monitoredWebsites.filter(website => website.id !== id));
  };

  const handleToggleNotifications = async () => {
    const newState = !notificationsEnabled;
    
    if (newState) {
      // Request permission if not already granted
      const permission = await requestNotificationPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        localStorage.setItem('notificationsEnabled', 'true');
        setupNotifications();
      } else {
        // Permission denied, can't enable
        return;
      }
    } else {
      setNotificationsEnabled(false);
      localStorage.setItem('notificationsEnabled', 'false');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Welcome, {userProfile?.username || user?.username || 'User'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Manage your website monitoring and view your reports.
        </p>
        
        {/* Admin Controls - Only visible to super admin */}
        {isSuperAdmin && <AdminControls />}
        
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('monitored')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'monitored'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Monitored Websites
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reports'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              My Reports
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Notification Settings
            </button>
            {isSuperAdmin && (
              <button
                onClick={() => setActiveTab('users')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                User Management
              </button>
            )}
          </nav>
        </div>
        
        {/* Monitored Websites Tab */}
        {activeTab === 'monitored' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Your Monitored Websites
              </h2>
              <button className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                <Bell className="h-4 w-4 mr-1" />
                Manage Alerts
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <Clock className="animate-spin h-6 w-6 text-blue-500 mr-3" />
                <p>Loading your websites...</p>
              </div>
            ) : (
              <>
                {monitoredWebsites.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      You're not monitoring any websites yet.
                    </p>
                    <p className="text-gray-500 dark:text-gray-400">
                      Add a website below to start monitoring its status.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 mb-6">
                    {monitoredWebsites.map(website => (
                      <div key={website.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <div>
                          <div className="flex items-center">
                            <span className={`h-3 w-3 rounded-full mr-2 ${
                              website.status === 'up' ? 'bg-green-500' : 'bg-red-500'
                            }`}></span>
                            <h3 className="font-medium text-gray-800 dark:text-white">
                              {new URL(website.url).hostname.replace('www.', '')}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Last checked: {new Date(website.lastChecked).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => window.open(website.url, '_blank')}
                            className="p-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                          >
                            <ExternalLink className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={() => handleRemoveWebsite(website.id)}
                            className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <form onSubmit={handleAddWebsite} className="mt-6">
                  <div className="flex">
                    <input
                      type="text"
                      value={newWebsiteUrl}
                      onChange={(e) => setNewWebsiteUrl(e.target.value)}
                      placeholder="Enter website URL (e.g., google.com)"
                      className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 transition-colors flex items-center"
                    >
                      <PlusCircle className="h-5 w-5 mr-1" />
                      Add
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        )}
        
        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Your Recent Reports
            </h2>
            
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                You haven't submitted any reports yet.
              </p>
            </div>
          </div>
        )}
        
        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Notification Settings
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">Browser Notifications</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive browser notifications when monitored websites go down
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={notificationsEnabled}
                    onChange={handleToggleNotifications}
                    disabled={notificationPermission === 'denied'}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              {notificationPermission === 'denied' && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                  <p className="text-yellow-600 dark:text-yellow-400 text-sm">
                    Notifications are blocked by your browser. Please update your browser settings to allow notifications from this site.
                  </p>
                </div>
              )}
              
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">Email Notifications</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive email alerts when monitored websites go down
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-800 dark:text-white">Weekly Reports</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive weekly uptime summary reports
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
            
            <div className="mt-6">
              <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                <Settings className="h-5 w-5 mr-2" />
                Save Settings
              </button>
            </div>
          </div>
        )}
        
        {/* User Management Tab - Only visible to super admin */}
        {activeTab === 'users' && isSuperAdmin && (
          <UserManagement />
        )}
        
      </div>
    </div>
  );
};

export default Dashboard;
