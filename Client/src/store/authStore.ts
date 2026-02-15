import { create } from 'zustand';
import { User } from '@/types';

interface AuthStore {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  isAuthenticated: false,
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      loading: false,
    }),
  setLoading: (loading) => set({ loading }),
  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));
