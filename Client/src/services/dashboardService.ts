import { apiClient } from '@/lib/axios';
import {
  Mission,
  NearEarthObject,
  SpaceWeatherEvent,
  KpIndex,
  SatellitePosition,
  ImpactAlert,
  MarsWeather,
  SystemStatus,
  DashboardData,
} from '@/types';

export const dashboardService = {
  getSystemStatus: async (): Promise<SystemStatus> => {
    const { data } = await apiClient.get('/status');
    return data;
  },

  getMissions: async (): Promise<Mission[]> => {
    const { data } = await apiClient.get('/missions');
    return data;
  },

  getMissionById: async (id: string): Promise<Mission> => {
    const { data } = await apiClient.get(`/missions/${id}`);
    return data;
  },

  getNearEarthObjects: async (): Promise<NearEarthObject[]> => {
    const { data } = await apiClient.get('/neo');
    return data;
  },

  getSpaceWeatherEvents: async (): Promise<SpaceWeatherEvent[]> => {
    const { data } = await apiClient.get('/space-weather');
    return data;
  },

  getKpIndex: async (days: number = 7): Promise<KpIndex[]> => {
    const { data } = await apiClient.get(`/kp-index?days=${days}`);
    return data;
  },

  getSatellitePositions: async (): Promise<SatellitePosition[]> => {
    const { data } = await apiClient.get('/satellites');
    return data;
  },

  getSatellitePosition: async (name: string): Promise<SatellitePosition> => {
    const { data } = await apiClient.get(`/satellites/${name}`);
    return data;
  },

  getImpactAlerts: async (): Promise<ImpactAlert[]> => {
    const { data } = await apiClient.get('/alerts');
    return data;
  },

  getMarsWeather: async (): Promise<MarsWeather> => {
    const { data } = await apiClient.get('/mars-weather');
    return data;
  },

  getEarthImagery: async (layer: string, date: string): Promise<string> => {
    const { data } = await apiClient.get(`/earth-imagery?layer=${layer}&date=${date}`);
    return data.url;
  },

  getDashboardData: async (): Promise<DashboardData> => {
    const { data } = await apiClient.get('/dashboard');
    return data;
  },
};
