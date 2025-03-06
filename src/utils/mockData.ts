import { Website, Report, Comment, UptimeData, OutageReport } from '../types';
import { subDays, subHours, subMinutes, addHours, subWeeks } from 'date-fns';

// Popular websites and services for quick checks with realistic status
export const popularWebsites: Website[] = [
  { 
    id: 'google', 
    url: 'https://google.com', 
    status: 'up', 
    lastChecked: new Date(),
    responseTime: 125
  },
  { 
    id: 'facebook', 
    url: 'https://facebook.com', 
    status: 'down', // Currently down based on incident data
    lastChecked: new Date(),
    responseTime: undefined
  },
  { 
    id: 'youtube', 
    url: 'https://youtube.com', 
    status: 'up', 
    lastChecked: new Date(),
    responseTime: 180
  },
  { 
    id: 'x', 
    url: 'https://x.com', 
    status: 'down', // Currently down based on incident data
    lastChecked: new Date(),
    responseTime: undefined
  },
  { 
    id: 'instagram', 
    url: 'https://instagram.com', 
    status: 'up', 
    lastChecked: new Date(),
    responseTime: 245
  },
  { 
    id: 'amazon', 
    url: 'https://amazon.com', 
    status: 'up', 
    lastChecked: new Date(),
    responseTime: 290
  },
  { 
    id: 'netflix', 
    url: 'https://netflix.com', 
    status: 'up', // Intermittent issues but currently up
    lastChecked: new Date(),
    responseTime: 310
  },
  { 
    id: 'reddit', 
    url: 'https://reddit.com', 
    status: 'down', // Currently down based on incident data
    lastChecked: new Date(),
    responseTime: undefined
  },
  { 
    id: 'tmobile', 
    url: 'https://t-mobile.com', 
    status: 'up', 
    lastChecked: new Date(),
    responseTime: 215
  },
  { 
    id: 'verizon', 
    url: 'https://verizon.com', 
    status: 'up', 
    lastChecked: new Date(),
    responseTime: 230
  },
  { 
    id: 'att', 
    url: 'https://att.com', 
    status: 'down', // Currently experiencing issues
    lastChecked: new Date(),
    responseTime: undefined
  },
  { 
    id: 'sprint', 
    url: 'https://sprint.com', 
    status: 'up', 
    lastChecked: new Date(),
    responseTime: 255
  },
  { 
    id: 'github', 
    url: 'https://github.com', 
    status: 'up', 
    lastChecked: new Date(),
    responseTime: 195
  },
  { 
    id: 'microsoft', 
    url: 'https://microsoft.com', 
    status: 'up', 
    lastChecked: new Date(),
    responseTime: 185
  },
  { 
    id: 'apple', 
    url: 'https://apple.com', 
    status: 'up', 
    lastChecked: new Date(),
    responseTime: 165
  },
  { 
    id: 'zoom', 
    url: 'https://zoom.us', 
    status: 'up', 
    lastChecked: new Date(),
    responseTime: 205
  }
];

// Mock reports for websites
export const mockReports: Report[] = [
  { 
    id: '1', 
    websiteId: 'youtube', 
    userId: 'user1', 
    timestamp: subHours(new Date(), 3), 
    description: 'Videos not loading properly, getting buffering issues',
    meTooCount: 31
  },
  { 
    id: '2', 
    websiteId: 'x', 
    userId: 'user2', 
    timestamp: subMinutes(new Date(), 45), 
    description: 'Complete outage, cannot access the site at all',
    meTooCount: 89
  },
  { 
    id: '3', 
    websiteId: 'facebook', 
    userId: 'user3', 
    timestamp: subHours(new Date(), 2), 
    description: 'Site is completely down, getting error 500',
    meTooCount: 47
  },
  { 
    id: '4', 
    websiteId: 'att', 
    userId: 'user4', 
    timestamp: subHours(new Date(), 1), 
    description: 'Service outage in multiple regions, cannot make calls',
    meTooCount: 63
  }
];

// Mock comments for websites
export const mockComments: Comment[] = [
  {
    id: '1',
    websiteId: 'youtube',
    userId: 'user1',
    content: 'Still having issues with YouTube videos buffering, especially on 4K content',
    timestamp: subMinutes(new Date(), 15)
  },
  {
    id: '2',
    websiteId: 'youtube',
    userId: 'user2',
    content: 'Working fine for me now, but was down earlier today',
    timestamp: subMinutes(new Date(), 5)
  },
  {
    id: '3',
    websiteId: 'x',
    userId: 'user3',
    content: 'X.com is completely inaccessible in my region, getting connection timeout',
    timestamp: subMinutes(new Date(), 10)
  },
  {
    id: '4',
    websiteId: 'att',
    userId: 'user4',
    content: 'AT&T cellular service is down in the entire Northeast region',
    timestamp: subMinutes(new Date(), 25)
  }
];

// Generate realistic uptime data that matches incident patterns
export const generateUptimeData = (websiteId: string, days: number = 30): UptimeData[] => {
  const data: UptimeData[] = [];
  const now = new Date();
  
  // Define outage patterns based on our incident data
  const outagePatterns: Record<string, {timestamp: Date, duration: number}[]> = {
    'google': [
      { timestamp: subHours(now, 6), duration: 1 }, // 6 hours ago, lasted 1 hour
      { timestamp: subDays(now, 3), duration: 2 }   // 3 days ago, lasted 2 hours
    ],
    'facebook': [
      { timestamp: subHours(now, 2), duration: 3 },  // 2 hours ago, lasted 3 hours (still ongoing)
      { timestamp: subHours(now, 5), duration: 1 },  // 5 hours ago, lasted 1 hour
      { timestamp: subDays(now, 1), duration: 2 },   // 1 day ago, lasted 2 hours
      { timestamp: subDays(now, 7), duration: 4 }    // 7 days ago, lasted 4 hours
    ],
    'x': [
      { timestamp: subMinutes(now, 45), duration: 1 }, // 45 minutes ago, still ongoing
      { timestamp: subHours(now, 12), duration: 3 },   // 12 hours ago, lasted 3 hours
      { timestamp: subDays(now, 2), duration: 2 },     // 2 days ago, lasted 2 hours
      { timestamp: subDays(now, 4), duration: 1 }      // 4 days ago, lasted 1 hour
    ],
    'youtube': [
      { timestamp: subHours(now, 3), duration: 2 },   // 3 hours ago, lasted 2 hours
      { timestamp: subDays(now, 1), duration: 1 }     // 1 day ago, lasted 1 hour
    ],
    'amazon': [
      { timestamp: subDays(now, 5), duration: 1 }     // 5 days ago, lasted 1 hour
    ],
    'netflix': [
      { timestamp: subHours(now, 8), duration: 2 },   // 8 hours ago, lasted 2 hours
      { timestamp: subDays(now, 2), duration: 1 }     // 2 days ago, lasted 1 hour
    ],
    'reddit': [
      { timestamp: subHours(now, 1), duration: 2 },   // 1 hour ago, lasted 2 hours (still ongoing)
      { timestamp: subDays(now, 3), duration: 3 }     // 3 days ago, lasted 3 hours
    ],
    'att': [
      { timestamp: subHours(now, 1), duration: 3 },   // 1 hour ago, lasted 3 hours (still ongoing)
      { timestamp: subDays(now, 5), duration: 2 }     // 5 days ago, lasted 2 hours
    ],
    'tmobile': [
      { timestamp: subDays(now, 2), duration: 4 },    // 2 days ago, lasted 4 hours
      { timestamp: subDays(now, 10), duration: 1 }    // 10 days ago, lasted 1 hour
    ],
    'verizon': [
      { timestamp: subDays(now, 7), duration: 2 }     // 7 days ago, lasted 2 hours
    ],
    'zoom': [
      { timestamp: subDays(now, 3), duration: 1 },    // 3 days ago, lasted 1 hour
      { timestamp: subDays(now, 15), duration: 3 }    // 15 days ago, lasted 3 hours
    ]
  };
  
  // Default pattern for sites without specific outage data
  const defaultOutages = [
    { timestamp: subDays(now, 10), duration: 1 },
    { timestamp: subDays(now, 20), duration: 1 }
  ];
  
  // Get the outage pattern for this website, or use default
  const outages = outagePatterns[websiteId] || defaultOutages;
  
  // Generate data points for each day
  for (let i = days; i >= 0; i--) {
    // Create multiple data points per day (every 2 hours)
    for (let h = 0; h < 24; h += 2) {
      const date = subDays(now, i);
      date.setHours(h);
      
      // Check if this timestamp falls within any outage period
      const isDown = outages.some(outage => {
        const outageStart = new Date(outage.timestamp);
        const outageEnd = addHours(new Date(outage.timestamp), outage.duration);
        return date >= outageStart && date <= outageEnd;
      });
      
      // Set status and response time based on outage check
      const status = isDown ? 'down' : 'up';
      
      // Response time varies by site and has higher variance during problematic periods
      let responseTime: number | undefined;
      
      if (status === 'up') {
        // Base response time varies by site
        let baseTime = 200;
        if (websiteId === 'google') baseTime = 120;
        if (websiteId === 'facebook') baseTime = 250;
        if (websiteId === 'youtube') baseTime = 180;
        if (websiteId === 'x') baseTime = 220;
        if (websiteId === 'tmobile') baseTime = 215;
        if (websiteId === 'verizon') baseTime = 230;
        if (websiteId === 'att') baseTime = 240;
        if (websiteId === 'sprint') baseTime = 255;
        if (websiteId === 'zoom') baseTime = 205;
        
        // Add some random variance
        const variance = Math.floor(Math.random() * 100);
        
        // Check if this is close to an outage (within 4 hours)
        const isNearOutage = outages.some(outage => {
          const outageStart = new Date(outage.timestamp);
          const fourHoursBefore = subHours(outageStart, 4);
          const fourHoursAfter = addHours(addHours(outageStart, outage.duration), 4);
          return date >= fourHoursBefore && date <= fourHoursAfter;
        });
        
        // Higher response times near outages
        responseTime = isNearOutage 
          ? baseTime + variance + Math.floor(Math.random() * 200) 
          : baseTime + variance;
      }
      
      data.push({
        timestamp: new Date(date),
        status,
        responseTime
      });
    }
  }
  
  return data;
};

// Mock outage reports with geographic coordinates matching our incident data
export const mockOutageReports: OutageReport[] = [
  // X.com outages
  {
    id: '1',
    websiteId: 'x',
    latitude: 37.7749,
    longitude: -122.4194, // San Francisco
    timestamp: subMinutes(new Date(), 45),
    status: 'down'
  },
  {
    id: '2',
    websiteId: 'x',
    latitude: 19.0760,
    longitude: 72.8777, // Mumbai
    timestamp: subHours(new Date(), 12),
    status: 'down'
  },
  {
    id: '3',
    websiteId: 'x',
    latitude: 35.6762,
    longitude: 139.6503, // Tokyo
    timestamp: subDays(new Date(), 2),
    status: 'down'
  },
  
  // Facebook outages
  {
    id: '4',
    websiteId: 'facebook',
    latitude: 52.5200,
    longitude: 13.4050, // Berlin
    timestamp: subHours(new Date(), 2),
    status: 'down'
  },
  {
    id: '5',
    websiteId: 'facebook',
    latitude: 48.8566,
    longitude: 2.3522, // Paris
    timestamp: subHours(new Date(), 5),
    status: 'down'
  },
  {
    id: '6',
    websiteId: 'facebook',
    latitude: 43.6532,
    longitude: -79.3832, // Toronto
    timestamp: subDays(new Date(), 1),
    status: 'down'
  },
  
  // YouTube outages
  {
    id: '7',
    websiteId: 'youtube',
    latitude: 19.4326,
    longitude: -99.1332, // Mexico City
    timestamp: subHours(new Date(), 3),
    status: 'down'
  },
  {
    id: '8',
    websiteId: 'youtube',
    latitude: -23.5505,
    longitude: -46.6333, // São Paulo
    timestamp: subDays(new Date(), 1),
    status: 'down'
  },
  
  // Reddit outages
  {
    id: '9',
    websiteId: 'reddit',
    latitude: 41.8781,
    longitude: -87.6298, // Chicago
    timestamp: subHours(new Date(), 1),
    status: 'down'
  },
  {
    id: '10',
    websiteId: 'reddit',
    latitude: 53.3498,
    longitude: -6.2603, // Dublin
    timestamp: subDays(new Date(), 3),
    status: 'down'
  },
  
  // AT&T outages
  {
    id: '11',
    websiteId: 'att',
    latitude: 40.7128,
    longitude: -74.0060, // New York
    timestamp: subHours(new Date(), 1),
    status: 'down'
  },
  {
    id: '12',
    websiteId: 'att',
    latitude: 42.3601,
    longitude: -71.0589, // Boston
    timestamp: subHours(new Date(), 2),
    status: 'down'
  },
  
  // T-Mobile outages
  {
    id: '13',
    websiteId: 'tmobile',
    latitude: 34.0522,
    longitude: -118.2437, // Los Angeles
    timestamp: subDays(new Date(), 2),
    status: 'down'
  },
  
  // Additional outages for more coverage
  {
    id: '14',
    websiteId: 'netflix',
    latitude: 51.5074,
    longitude: -0.1278, // London
    timestamp: subHours(new Date(), 8),
    status: 'down'
  },
  {
    id: '15',
    websiteId: 'amazon',
    latitude: 47.6062,
    longitude: -122.3321, // Seattle
    timestamp: subDays(new Date(), 5),
    status: 'down'
  },
  {
    id: '16',
    websiteId: 'instagram',
    latitude: 34.0522,
    longitude: -118.2437, // Los Angeles
    timestamp: subHours(new Date(), 4),
    status: 'down'
  },
  {
    id: '17',
    websiteId: 'discord',
    latitude: 37.7749,
    longitude: -122.4194, // San Francisco
    timestamp: subHours(new Date(), 6),
    status: 'down'
  },
  {
    id: '18',
    websiteId: 'spotify',
    latitude: 59.3293,
    longitude: 18.0686, // Stockholm
    timestamp: subDays(new Date(), 1),
    status: 'down'
  },
  {
    id: '19',
    websiteId: 'github',
    latitude: 37.7749,
    longitude: -122.4194, // San Francisco
    timestamp: subDays(new Date(), 1),
    status: 'down'
  },
  {
    id: '20',
    websiteId: 'cloudflare',
    latitude: 37.7749,
    longitude: -122.4194, // San Francisco
    timestamp: subDays(new Date(), 3),
    status: 'down'
  },
  {
    id: '21',
    websiteId: 'slack',
    latitude: 37.7749,
    longitude: -122.4194, // San Francisco
    timestamp: subDays(new Date(), 2),
    status: 'down'
  },
  {
    id: '22',
    websiteId: 'zoom',
    latitude: 37.7749,
    longitude: -122.4194, // San Francisco
    timestamp: subDays(new Date(), 3),
    status: 'down'
  },
  {
    id: '23',
    websiteId: 'microsoft',
    latitude: 47.6062,
    longitude: -122.3321, // Seattle
    timestamp: subWeeks(new Date(), 1),
    status: 'down'
  },
  {
    id: '24',
    websiteId: 'apple',
    latitude: 37.3382,
    longitude: -122.0486, // Cupertino
    timestamp: subWeeks(new Date(), 2),
    status: 'down'
  },
  {
    id: '25',
    websiteId: 'twitter',
    latitude: -33.8688,
    longitude: 151.2093, // Sydney
    timestamp: subHours(new Date(), 1),
    status: 'down'
  },
  {
    id: '26',
    websiteId: 'twitter',
    latitude: 55.7558,
    longitude: 37.6173, // Moscow
    timestamp: subHours(new Date(), 2),
    status: 'down'
  },
  {
    id: '27',
    websiteId: 'twitter',
    latitude: 28.6139,
    longitude: 77.2090, // Delhi
    timestamp: subHours(new Date(), 3),
    status: 'down'
  },
  {
    id: '28',
    websiteId: 'facebook',
    latitude: -33.8688,
    longitude: 151.2093, // Sydney
    timestamp: subHours(new Date(), 3),
    status: 'down'
  },
  {
    id: '29',
    websiteId: 'facebook',
    latitude: 55.7558,
    longitude: 37.6173, // Moscow
    timestamp: subHours(new Date(), 4),
    status: 'down'
  },
  {
    id: '30',
    websiteId: 'reddit',
    latitude: -33.8688,
    longitude: 151.2093, // Sydney
    timestamp: subHours(new Date(), 2),
    status: 'down'
  }
];

// Mock incidents data for when Supabase is unavailable
export const mockIncidents = [
  // Google incidents - mostly reliable with occasional issues
  {
    id: '1',
    websiteId: 'google',
    websiteUrl: 'https://google.com',
    type: 'slow',
    timestamp: subHours(new Date(), 6), // 6 hours ago
    ipAddress: '192.168.1.1',
    location: {
      city: "New York",
      country: "United States"
    },
    meTooCount: 12
  },
  {
    id: '2',
    websiteId: 'google',
    websiteUrl: 'https://google.com',
    type: 'intermittent',
    timestamp: subDays(new Date(), 3), // 3 days ago
    ipAddress: '192.168.1.2',
    location: {
      city: "London",
      country: "United Kingdom"
    },
    meTooCount: 8
  },
  
  // Facebook incidents - more frequent issues
  {
    id: '3',
    websiteId: 'facebook',
    websiteUrl: 'https://facebook.com',
    type: 'down',
    timestamp: subHours(new Date(), 2), // 2 hours ago
    ipAddress: '192.168.1.3',
    location: {
      city: "Berlin",
      country: "Germany"
    },
    meTooCount: 47
  },
  {
    id: '4',
    websiteId: 'facebook',
    websiteUrl: 'https://facebook.com',
    type: 'slow',
    timestamp: subHours(new Date(), 5), // 5 hours ago
    ipAddress: '192.168.1.4',
    location: {
      city: "Paris",
      country: "France"
    },
    meTooCount: 23
  },
  
  // X.com incidents (formerly Twitter) - frequent issues recently
  {
    id: '7',
    websiteId: 'x',
    websiteUrl: 'https://x.com',
    type: 'down',
    timestamp: subMinutes(new Date(), 45), // 45 minutes ago
    ipAddress: '192.168.1.7',
    location: {
      city: "San Francisco",
      country: "United States"
    },
    meTooCount: 89
  },
  {
    id: '8',
    websiteId: 'x',
    websiteUrl: 'https://x.com',
    type: 'down',
    timestamp: subHours(new Date(), 12), // 12 hours ago
    ipAddress: '192.168.1.8',
    location: {
      city: "Mumbai",
      country: "India"
    },
    meTooCount: 56
  },
  
  // Twitter incidents (mapped to x.com)
  {
    id: '9',
    websiteId: 'twitter',
    websiteUrl: 'https://twitter.com',
    type: 'down',
    timestamp: subMinutes(new Date(), 30), // 30 minutes ago
    ipAddress: '192.168.1.9',
    location: {
      city: "Chicago",
      country: "United States"
    },
    meTooCount: 72
  },
  {
    id: '10',
    websiteId: 'twitter',
    websiteUrl: 'https://twitter.com',
    type: 'slow',
    timestamp: subHours(new Date(), 2), // 2 hours ago
    ipAddress: '192.168.1.10',
    location: {
      city: "Toronto",
      country: "Canada"
    },
    meTooCount: 34
  }
];
