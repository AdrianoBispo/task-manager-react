import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AuthUser = {
  id: string;
  nome: string;
  email: string;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setSession: (token: string, user: AuthUser) => void;
  clearSession: () => void;
  logout: () => void;
};

const AUTH_STORAGE_KEY = 'task-manager-auth';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setSession: (token, user) => {
        set({ token, user, isAuthenticated: true });
      },
      clearSession: () => {
        set({ token: null, user: null, isAuthenticated: false });
      },
      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
    },
  ),
);
