import { checkWebsiteStatus } from './websiteService';
import { supabase } from '../lib/supabase';
import { isSupabaseConnected } from '../lib/supabase';
import { Website } from '../types';
import { showWebsiteStatusNotification } from './notificationService';

// Keep track of the monitoring interval
let monitoringInterval: number | null = null;

// Keep track of which website is currently being checked
let currentWebsiteIndex = 0;

// Store the list of websites to monitor
let websitesToMonitor: Website[] = [];

// Flag to prevent concurrent monitoring operations
let isMonitoring = false;

// Store previous website statuses to detect changes
const previousStatuses: Record<string, 'up' | 'down' | 'unknown'> = {};

/**
 * Start the website monitoring service
 * Checks one website every 5 minutes in a round-robin fashion
 */
export const startMonitoringService = async (): Promise<void> => {
  // Don't start if already running
  if (monitoringInterval !== null) {
    console.log('Monitoring service is already running');
    return;
  }

  try {
    // Check if Supabase is connected
    const connected = await isSupabaseConnected;
    if (!connected) {
      console.warn('Supabase is not connected. Monitoring service will not start.');
      return;
    }

    // Fetch the initial list of websites to monitor
    await refreshWebsiteList();

    // Start the monitoring interval - check one website every 5 minutes
    const FIVE_MINUTES = 5 * 60 * 1000;
    monitoringInterval = window.setInterval(monitorNextWebsite, FIVE_MINUTES);

    // Also run immediately for the first website
    monitorNextWebsite();

    console.log('Website monitoring service started');
  } catch (error) {
    // Safe error logging to avoid Symbol() cloning issues
    console.error('Failed to start monitoring service:', typeof error === 'object' && error !== null ? (error as Error).message || 'Unknown error' : String(error));
  }
};

/**
 * Stop the website monitoring service
 */
export const stopMonitoringService = (): void => {
  if (monitoringInterval !== null) {
    clearInterval(monitoringInterval);
    monitoringInterval = null;
    console.log('Website monitoring service stopped');
  }
};

/**
 * Refresh the list of websites to monitor from the database
 */
export const refreshWebsiteList = async (): Promise<void> => {
  try {
    // Check if Supabase is connected
    const connected = await isSupabaseConnected;
    if (!connected) {
      console.warn('Supabase is not connected. Cannot refresh website list.');
      return;
    }

    // Fetch websites from the database
    const { data, error } = await supabase
      .from('websites')
      .select('*')
      .order('last_checked', { ascending: true }); // Start with oldest checked websites

    if (error) {
      throw error;
    }

    if (data && data.length > 0) {
      // Convert to our Website type
      websitesToMonitor = data.map(website => ({
        id: website.id,
        url: website.url,
        status: website.status as 'up' | 'down' | 'unknown',
        lastChecked: new Date(website.last_checked),
        responseTime: website.response_time || undefined
      }));

      console.log(`Refreshed monitoring list: ${websitesToMonitor.length} websites`);
    } else {
      console.warn('No websites found to monitor');
    }
  } catch (error) {
    // Safe error logging to avoid Symbol() cloning issues
    console.error('Failed to refresh website list:', typeof error === 'object' && error !== null ? (error as Error).message || 'Unknown error' : String(error));
  }
};

/**
 * Monitor the next website in the list
 */
const monitorNextWebsite = async (): Promise<void> => {
  // Skip if already monitoring or no websites to monitor
  if (isMonitoring || websitesToMonitor.length === 0) {
    return;
  }

  try {
    isMonitoring = true;

    // Get the next website to monitor
    const website = websitesToMonitor[currentWebsiteIndex];
    
    console.log(`Monitoring website: ${website.url}`);
    
    // Store previous status
    previousStatuses[website.id] = website.status;
    
    // Check the website status
    const result = await checkWebsiteStatus(website.url);
    
    console.log(`Website ${website.url} status: ${result.status}`);

    // Check if status changed
    if (previousStatuses[website.id] !== result.status) {
      console.log(`Status changed for ${website.url}: ${previousStatuses[website.id]} -> ${result.status}`);
      
      // Show notification for status change
      showWebsiteStatusNotification(result);
    }

    // Update the website in our local list
    websitesToMonitor[currentWebsiteIndex] = result;

    // Move to the next website for the next check
    currentWebsiteIndex = (currentWebsiteIndex + 1) % websitesToMonitor.length;

    // Every 10 websites, refresh the list to get any new websites
    if (currentWebsiteIndex % 10 === 0) {
      refreshWebsiteList();
    }
  } catch (error) {
    // Safe error logging to avoid Symbol() cloning issues
    console.error('Error monitoring website:', typeof error === 'object' && error !== null ? (error as Error).message || 'Unknown error' : String(error));
  } finally {
    isMonitoring = false;
  }
};

/**
 * Get the status of the monitoring service
 */
export const getMonitoringStatus = (): { 
  isRunning: boolean; 
  websiteCount: number;
  currentIndex: number;
} => {
  return {
    isRunning: monitoringInterval !== null,
    websiteCount: websitesToMonitor.length,
    currentIndex: currentWebsiteIndex
  };
};
