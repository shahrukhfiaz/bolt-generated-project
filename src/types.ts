export interface Website {
  id: string;
  url: string;
  status: 'up' | 'down' | 'unknown';
  lastChecked: Date;
  responseTime?: number;
  userReported?: boolean;
  incidentType?: 'down' | 'slow' | 'intermittent' | 'partial';
  reportCount?: number;
  reportTimestamp?: Date;
}

export interface Report {
  id: string;
  websiteId: string;
  userId: string;
  timestamp: Date;
  description: string;
  meTooCount: number;
}

export interface Comment {
  id: string;
  websiteId: string;
  userId: string;
  content: string;
  timestamp: Date;
}

export interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  createdAt: Date;
}

export interface UptimeData {
  timestamp: Date;
  status: 'up' | 'down';
  responseTime?: number;
}

export interface OutageReport {
  id: string;
  websiteId: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
  status: 'up' | 'down';
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export type IncidentType = 'down' | 'slow' | 'intermittent' | 'partial' | 'metoo';

export interface Incident {
  id: string;
  websiteId: string;
  websiteUrl: string;
  type: IncidentType;
  timestamp: Date;
  ipAddress: string;
  location?: {
    city: string;
    country: string;
  };
  meTooCount: number;
  relatedIncidentId?: string;
}
