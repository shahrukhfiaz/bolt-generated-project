import { supabase } from '../lib/supabase';
import { isSupabaseConnected, checkSupabaseConnection } from '../lib/supabase';
import { clearAllIncidents } from './incidentService';

// Function to safely call RPC functions
const safeRpcCall = async (functionName: string, params?: any): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc(functionName, params);
    if (error) {
      console.error(`Error calling ${functionName}:`, 
        error instanceof Error ? error.message : 'Unknown error'
      );
      return false;
    }
    
    // Log the number of affected rows
    if (typeof data === 'number') {
      console.log(`${functionName} affected ${data} rows`);
    }
    
    return true;
  } catch (error) {
    console.error(`Failed to call ${functionName}:`,
      error instanceof Error ? error.message : 'Unknown error'
    );
    return false;
  }
};

/**
 * Clear local storage data related to reported websites
 */
export const clearLocalStorageReportData = (): void => {
  try {
    // Clear reported sites from localStorage
    localStorage.removeItem('reportedSites');
    
    // Set a flag to notify other components that data has been cleared
    localStorage.setItem('dataCleared', 'true');
    
    // Dispatch a storage event to notify other tabs/windows
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'dataCleared',
      newValue: 'true'
    }));
    
    console.log('Successfully cleared local storage report data');
  } catch (error) {
    console.error('Failed to clear local storage data:', error);
  }
};

/**
 * Reset all website statuses to "up" in the database
 * @returns Promise<boolean> indicating success or failure
 */
export const resetAllWebsiteStatuses = async (): Promise<boolean> => {
  try {
    // Check if Supabase is connected
    const connected = await checkSupabaseConnection();
    if (!connected) {
      console.warn('Supabase is not connected. Cannot reset website statuses.');
      return false;
    }

    // Update all websites to status "up"
    const success = await safeRpcCall('reset_all_website_statuses');
    if (!success) return false;

    console.log('Successfully reset all website statuses to "up"');
    return true;
  } catch (error) {
    console.error('Failed to reset website statuses:', 
      error instanceof Error ? error.message : 'Unknown error'
    );
    return false;
  }
};

/**
 * Clear all outage reports from the database
 * @returns Promise<boolean> indicating success or failure
 */
export const clearAllOutageReports = async (): Promise<boolean> => {
  try {
    // Check if Supabase is connected
    const connected = await checkSupabaseConnection();
    if (!connected) {
      console.warn('Supabase is not connected. Cannot clear outage reports.');
      return false;
    }

    // Delete all records from the outage_reports table
    const success = await safeRpcCall('clear_all_records', { 
      table_name: 'outage_reports' 
    });
    if (!success) return false;

    console.log('Successfully cleared all outage reports');
    return true;
  } catch (error) {
    console.error('Failed to clear outage reports:', 
      error instanceof Error ? error.message : 'Unknown error'
    );
    return false;
  }
};

/**
 * Clear all outage data (outage reports and incidents)
 * @returns Promise<boolean> indicating success or failure
 */
export const clearAllOutageData = async (): Promise<boolean> => {
  try {
    // Check if Supabase is connected
    const connected = await checkSupabaseConnection();
    if (!connected) {
      console.warn('Supabase is not connected. Cannot clear outage data.');
      return false;
    }

    // Clear all incidents using the dedicated function
    const incidentsCleared = await clearAllIncidents();
    if (!incidentsCleared) {
      console.error('Failed to clear incidents');
      return false;
    }

    // Clear all outage reports
    const reportsCleared = await clearAllOutageReports();
    if (!reportsCleared) {
      console.error('Failed to clear outage reports');
      return false;
    }

    console.log('Successfully cleared all outage data');
    return true;
  } catch (error) {
    console.error('Failed to clear outage data:', 
      error instanceof Error ? error.message : 'Unknown error'
    );
    return false;
  }
};

/**
 * Clear all data (local storage, reset statuses, and clear outage data)
 * @returns Promise<boolean> indicating success or failure
 */
export const clearAllData = async (): Promise<boolean> => {
  try {
    // Check if Supabase is connected
    const connected = await isSupabaseConnected;
    if (!connected) {
      console.warn('Database connection not available. Please try again later.');
      return false;
    }

    // Clear all incidents first
    const incidentsCleared = await clearAllIncidents();
    if (!incidentsCleared) {
      console.error('Failed to clear incidents. Please try again.');
      return false;
    }

    // Clear all outage reports
    const reportsCleared = await clearAllOutageReports();
    if (!reportsCleared) {
      console.error('Failed to clear outage reports. Please try again.');
      return false;
    }

    // Reset all website statuses to "up"
    const resetStatuses = await resetAllWebsiteStatuses();
    if (!resetStatuses) {
      console.error('Failed to reset website statuses. Please try again.');
      return false;
    }

    // Clear local storage data
    clearLocalStorageReportData();
    
    // Clear any other caches
    localStorage.removeItem('monitoredWebsites');
    localStorage.removeItem('reportedSites');
    
    // Dispatch a custom event to notify all components that data is being cleared
    window.dispatchEvent(new CustomEvent('data-cleared'));
    
    // Wait a moment to ensure all components have time to react
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Success!
    console.log('Successfully cleared all data');
    
    return true;
  } catch (error) {
    console.error('An error occurred while clearing data:', 
      error instanceof Error ? error.message : 'Unknown error'
    );
    return false;
  }
};
