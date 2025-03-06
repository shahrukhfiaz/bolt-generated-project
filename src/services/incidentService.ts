import { Incident, IncidentType } from '../types';
import { supabase } from '../lib/supabase';

/**
 * Get recent incidents for a website
 * @param websiteId The website ID
 * @returns Promise with array of incidents
 */
export const getRecentIncidents = async (websiteId: string): Promise<Incident[]> => {
  try {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .eq('website_id', websiteId)
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(incident => ({
      id: incident.id,
      websiteId: incident.website_id,
      websiteUrl: incident.website_url,
      type: incident.type as IncidentType,
      timestamp: new Date(incident.timestamp),
      ipAddress: incident.ip_address,
      location: incident.location_city && incident.location_country ? {
        city: incident.location_city,
        country: incident.location_country
      } : undefined,
      meTooCount: incident.me_too_count || 0,
      relatedIncidentId: incident.related_incident_id
    }));
  } catch (error) {
    console.error('Failed to fetch incidents:', typeof error === 'object' && error !== null ? (error as Error).message || 'Unknown error' : String(error));
    return [];
  }
};

/**
 * Get all recent incidents across all websites
 * @param limit Optional limit on number of incidents to return
 * @returns Promise with array of incidents
 */
export const getAllRecentIncidents = async (limit: number = 20): Promise<Incident[]> => {
  try {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return (data || []).map(incident => ({
      id: incident.id,
      websiteId: incident.website_id,
      websiteUrl: incident.website_url,
      type: incident.type as IncidentType,
      timestamp: new Date(incident.timestamp),
      ipAddress: incident.ip_address,
      location: incident.location_city && incident.location_country ? {
        city: incident.location_city,
        country: incident.location_country
      } : undefined,
      meTooCount: incident.me_too_count || 0,
      relatedIncidentId: incident.related_incident_id
    }));
  } catch (error) {
    console.error('Failed to fetch all incidents:', typeof error === 'object' && error !== null ? (error as Error).message || 'Unknown error' : String(error));
    return [];
  }
};

/**
 * Submit a new incident report
 * @param incident The incident to submit
 * @returns Promise with the submitted incident
 */
export const submitIncidentReport = async (
  incident: Omit<Incident, 'id' | 'location' | 'meTooCount'>
): Promise<Incident> => {
  try {
    // Special handling for twitter.com to x.com conversion
    let websiteId = incident.websiteId;
    let websiteUrl = incident.websiteUrl;
    
    if (websiteUrl.includes('twitter.com')) {
      websiteUrl = websiteUrl.replace('twitter.com', 'x.com');
      websiteId = 'x';
    }
    
    // For "me too" reports, find the related incident and increment its count
    if (incident.type === 'metoo' && incident.relatedIncidentId) {
      const { data: relatedIncidents, error: fetchError } = await supabase
        .from('incidents')
        .select('*')
        .eq('id', incident.relatedIncidentId);
      
      if (fetchError) throw fetchError;
      
      if (!relatedIncidents || relatedIncidents.length === 0) {
        throw new Error('Related incident not found');
      }
      
      const relatedIncident = relatedIncidents[0];
      
      // Increment the me_too_count
      const { error: updateError } = await supabase
        .from('incidents')
        .update({ me_too_count: (relatedIncident.me_too_count || 0) + 1 })
        .eq('id', incident.relatedIncidentId);
      
      if (updateError) throw updateError;
      
      // Create the updated incident object
      const updatedIncident: Incident = {
        id: relatedIncident.id,
        websiteId: relatedIncident.website_id,
        websiteUrl: relatedIncident.website_url,
        type: relatedIncident.type as IncidentType,
        timestamp: new Date(relatedIncident.timestamp),
        ipAddress: relatedIncident.ip_address,
        location: relatedIncident.location_city && relatedIncident.location_country ? {
          city: relatedIncident.location_city,
          country: relatedIncident.location_country
        } : undefined,
        meTooCount: (relatedIncident.me_too_count || 0) + 1,
        relatedIncidentId: relatedIncident.related_incident_id
      };
      
      return updatedIncident;
    }
    
    // Get approximate location based on IP (in a real app)
    // For demo, we'll use a random location from major cities
    const locations = [
      { city: "San Francisco", country: "United States" },
      { city: "New York", country: "United States" },
      { city: "London", country: "United Kingdom" },
      { city: "Berlin", country: "Germany" },
      { city: "Tokyo", country: "Japan" },
      { city: "Sydney", country: "Australia" },
      { city: "Toronto", country: "Canada" },
      { city: "Paris", country: "France" }
    ];
    
    const randomIndex = Math.floor(Math.random() * locations.length);
    const location = locations[randomIndex];
    
    // Insert the new incident
    const { data, error } = await supabase
      .from('incidents')
      .insert({
        website_id: websiteId,
        website_url: websiteUrl,
        type: incident.type,
        timestamp: incident.timestamp.toISOString(),
        ip_address: incident.ipAddress,
        location_city: location.city,
        location_country: location.country,
        me_too_count: 0,
        related_incident_id: incident.relatedIncidentId
      })
      .select();
    
    if (error) {
      console.error('Supabase insert error:', typeof error === 'object' && error !== null ? (error as Error).message || 'Unknown error' : String(error));
      throw error;
    }
    
    if (!data || data.length === 0) {
      throw new Error('Failed to insert incident');
    }
    
    const newIncident = data[0];
    
    // Create the new incident object
    const createdIncident: Incident = {
      id: newIncident.id,
      websiteId: newIncident.website_id,
      websiteUrl: newIncident.website_url,
      type: newIncident.type as IncidentType,
      timestamp: new Date(newIncident.timestamp),
      ipAddress: newIncident.ip_address,
      location: newIncident.location_city && newIncident.location_country ? {
        city: newIncident.location_city,
        country: newIncident.location_country
      } : undefined,
      meTooCount: newIncident.me_too_count || 0,
      relatedIncidentId: newIncident.related_incident_id
    };
    
    return createdIncident;
  } catch (error) {
    console.error('Failed to submit incident report:', typeof error === 'object' && error !== null ? (error as Error).message || 'Unknown error' : String(error));
    throw error;
  }
};

/**
 * Update website status based on user reports
 * @param websiteId The website ID
 * @param status The new status ('up' or 'down')
 * @returns Promise<boolean> indicating success
 */
export const updateWebsiteStatus = async (websiteId: string, status: 'up' | 'down'): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('websites')
      .update({ 
        status,
        last_checked: new Date().toISOString()
      })
      .eq('id', websiteId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Failed to update website status:', typeof error === 'object' && error !== null ? (error as Error).message || 'Unknown error' : String(error));
    return false;
  }
};

/**
 * Get incidents by type for a specific time period
 * @param type The incident type to filter by
 * @param hours Number of hours to look back
 * @returns Promise with array of incidents
 */
export const getIncidentsByType = async (type: IncidentType, hours: number = 24): Promise<Incident[]> => {
  try {
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - hours);
    
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .eq('type', type)
      .gte('timestamp', cutoffTime.toISOString())
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(incident => ({
      id: incident.id,
      websiteId: incident.website_id,
      websiteUrl: incident.website_url,
      type: incident.type as IncidentType,
      timestamp: new Date(incident.timestamp),
      ipAddress: incident.ip_address,
      location: incident.location_city && incident.location_country ? {
        city: incident.location_city,
        country: incident.location_country
      } : undefined,
      meTooCount: incident.me_too_count || 0,
      relatedIncidentId: incident.related_incident_id
    }));
  } catch (error) {
    console.error(`Failed to fetch ${type} incidents:`, typeof error === 'object' && error !== null ? (error as Error).message || 'Unknown error' : String(error));
    return [];
  }
};

/**
 * Get outage incidents (down or partial) for the last 24 hours
 * @returns Promise with array of incidents
 */
export const getRecentOutageIncidents = async (): Promise<Incident[]> => {
  try {
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - 24);
    
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .in('type', ['down', 'partial'])
      .gte('timestamp', cutoffTime.toISOString())
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(incident => ({
      id: incident.id,
      websiteId: incident.website_id,
      websiteUrl: incident.website_url,
      type: incident.type as IncidentType,
      timestamp: new Date(incident.timestamp),
      ipAddress: incident.ip_address,
      location: incident.location_city && incident.location_country ? {
        city: incident.location_city,
        country: incident.location_country
      } : undefined,
      meTooCount: incident.me_too_count || 0,
      relatedIncidentId: incident.related_incident_id
    }));
  } catch (error) {
    console.error('Failed to fetch recent outage incidents:', typeof error === 'object' && error !== null ? (error as Error).message || 'Unknown error' : String(error));
    return [];
  }
};

/**
 * Clear all incidents from the database
 * @returns Promise<boolean> indicating success
 */
export const clearAllIncidents = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('incidents')
      .delete()
      .neq('id', ''); // This is a valid filter that matches all records
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Failed to clear incidents:', typeof error === 'object' && error !== null ? (error as Error).message || 'Unknown error' : String(error));
    return false;
  }
};
