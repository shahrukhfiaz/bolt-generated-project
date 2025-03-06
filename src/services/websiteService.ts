import { supabaseAdmin } from '../lib/supabase-admin';

export const checkWebsiteStatus = async (url: string) => {
  try {
    // Basic validation
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid URL provided');
    }

    // Normalize URL
    const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;

    // Make a test request to check website status
    const startTime = Date.now();
    const response = await fetch(normalizedUrl, {
      method: 'HEAD',
      redirect: 'follow',
      cache: 'no-cache'
    });
    const responseTime = Date.now() - startTime;

    // Determine status based on response
    const status = response.ok ? 'up' : 'down';

    return {
      id: normalizedUrl,
      url: normalizedUrl,
      status,
      responseTime,
      lastChecked: new Date().toISOString()
    };
  } catch (error) {
    return {
      id: url,
      url,
      status: 'down',
      responseTime: null,
      lastChecked: new Date().toISOString()
    };
  }
};

export const addPopularWebsite = async (websiteData: {
  url: string;
  name: string;
  description?: string;
  category?: string;
}) => {
  const { data, error } = await supabaseAdmin
    .from('popular_websites')
    .insert([websiteData])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getPopularWebsites = async () => {
  const { data, error } = await supabaseAdmin
    .from('popular_websites')
    .select('*')
    .eq('is_active', true);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getUptimeData = async (websiteId: string, period: '24h' | '7d' | '30d' = '24h') => {
  const { data, error } = await supabaseAdmin
    .from('uptime_metrics')
    .select('timestamp, status')
    .eq('website_id', websiteId)
    .order('timestamp', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  // For demo purposes, return mock data
  return [
    { timestamp: new Date(Date.now() - 86400000).toISOString(), status: 'up' },
    { timestamp: new Date(Date.now() - 43200000).toISOString(), status: 'up' },
    { timestamp: new Date(Date.now() - 21600000).toISOString(), status: 'down' },
    { timestamp: new Date(Date.now() - 10800000).toISOString(), status: 'up' },
    { timestamp: new Date().toISOString(), status: 'up' }
  ];
};
