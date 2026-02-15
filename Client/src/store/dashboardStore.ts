import { create } from 'zustand';
import { DashboardData, SystemStatus } from '@/types';

interface DashboardStore {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  selectedMissionId: string | null;
  autoRefresh: boolean;
  setData: (data: DashboardData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedMissionId: (id: string | null) => void;
  setAutoRefresh: (enabled: boolean) => void;
  updateSystemStatus: (status: SystemStatus) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  data: null,
  loading: false,
  error: null,
  selectedMissionId: null,
  autoRefresh: true,
  setData: (data) => set({ data }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSelectedMissionId: (id) => set({ selectedMissionId: id }),
  setAutoRefresh: (enabled) => set({ autoRefresh: enabled }),
  updateSystemStatus: (status) =>
    set((state) => ({
      data: state.data ? { ...state.data, systemStatus: status } : null,
    })),
}));
