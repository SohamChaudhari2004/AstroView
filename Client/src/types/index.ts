// TypeScript types for the application

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface Mission {
  id: string;
  name: string;
  organization: 'NASA' | 'ISRO' | 'SpaceX' | 'ESA';
  launchDate: string;
  rocket: string;
  status: 'scheduled' | 'upcoming' | 'launched' | 'completed';
  objective: string;
  payloadDetails: string;
  orbitType: string;
  launchSite: string;
  rocketImage?: string;
  organizationLogo?: string;
}

export interface NearEarthObject {
  id: string;
  name: string;
  hazardous: boolean;
  missDistance: number;
  velocity: number;
  approachDate: string;
  size: {
    min: number;
    max: number;
  };
}

export interface SpaceWeatherEvent {
  id: string;
  eventType: 'solarFlare' | 'cme' | 'geomagneticStorm';
  severity: 'minor' | 'moderate' | 'severe';
  timestamp: string;
  description: string;
}

export interface KpIndex {
  timestamp: string;
  value: number;
}

export interface Satellite {
  name: string;
  tle1: string;
  tle2: string;
}

export interface SatellitePosition {
  name: string;
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
}

export interface EarthLayer {
  name: string;
  layer: string;
  palette?: string;
}

export interface ImpactAlert {
  id: string;
  type: 'tsunami' | 'severeWeather' | 'asteroidImpact';
  severity: 'low' | 'moderate' | 'high';
  location?: {
    latitude: number;
    longitude: number;
  };
  timestamp: string;
  description: string;
}

export interface MarsWeather {
  sol: number;
  season: string;
  temperature: {
    min: number;
    max: number;
  };
  pressure: number;
  windSpeed: number;
  timestamp: string;
}

export interface SystemStatus {
  status: 'stable' | 'warning' | 'alert';
  threatLevel: 'low' | 'moderate' | 'high';
  lastUpdate: string;
}

export interface DashboardData {
  systemStatus: SystemStatus;
  missions: Mission[];
  nearEarthObjects: NearEarthObject[];
  spaceWeatherEvents: SpaceWeatherEvent[];
  kpIndex: KpIndex[];
  satellitePositions: SatellitePosition[];
  impactAlerts: ImpactAlert[];
  marsWeather: MarsWeather;
}
