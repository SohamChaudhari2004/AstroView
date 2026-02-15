import { create } from 'zustand';

interface AlertsStore {
  alerts: Array<{
    id: string;
    type: 'info' | 'warning' | 'error' | 'success';
    message: string;
    timestamp: number;
  }>;
  highThreatActive: boolean;
  addAlert: (type: 'info' | 'warning' | 'error' | 'success', message: string) => void;
  removeAlert: (id: string) => void;
  setHighThreatActive: (active: boolean) => void;
}

export const useAlertsStore = create<AlertsStore>((set) => ({
  alerts: [],
  highThreatActive: false,
  addAlert: (type, message) =>
    set((state) => ({
      alerts: [
        ...state.alerts,
        {
          id: Math.random().toString(36).substr(2, 9),
          type,
          message,
          timestamp: Date.now(),
        },
      ],
    })),
  removeAlert: (id) =>
    set((state) => ({
      alerts: state.alerts.filter((alert) => alert.id !== id),
    })),
  setHighThreatActive: (active) => set({ highThreatActive: active }),
}));
