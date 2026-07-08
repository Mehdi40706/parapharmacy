import { defineStore } from 'pinia';
import type { User } from '~/types/user';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    accessToken: null as string | null,
    refreshToken: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    isAdmin: (state) => state.user?.role === 'ADMIN',
  },

  actions: {
    setTokens(access: string, refresh: string) {
      this.accessToken = access;
      this.refreshToken = refresh;
      if (import.meta.client) {
        localStorage.setItem('refresh_token', refresh);
      }
    },

    setUser(user: User) {
      this.user = user;
    },

    async login(email: string, password: string) {
      const config = useRuntimeConfig();
      const data = await $fetch<{ access_token: string; refresh_token: string }>(
        '/auth/login',
        {
          baseURL: config.public.apiBase,
          method: 'POST',
          body: { email, password },
        },
      );
      this.setTokens(data.access_token, data.refresh_token);
      await this.fetchProfile();
    },

    async register(payload: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }) {
      const config = useRuntimeConfig();
      const data = await $fetch<{ access_token: string; refresh_token: string }>(
        '/auth/register',
        {
          baseURL: config.public.apiBase,
          method: 'POST',
          body: payload,
        },
      );
      this.setTokens(data.access_token, data.refresh_token);
      await this.fetchProfile();
    },

    async fetchProfile() {
      const config = useRuntimeConfig();
      const user = await $fetch<User>('/auth/me', {
        baseURL: config.public.apiBase,
        headers: { Authorization: `Bearer ${this.accessToken}` },
      });
      this.setUser(user);
    },

    async refreshAccessToken(): Promise<boolean> {
      const config = useRuntimeConfig();
      const storedRefresh =
        this.refreshToken ||
        (import.meta.client ? localStorage.getItem('refresh_token') : null);

      if (!storedRefresh) return false;

      try {
        const data = await $fetch<{ access_token: string; refresh_token: string }>(
          '/auth/refresh',
          {
            baseURL: config.public.apiBase,
            method: 'POST',
            body: { refresh_token: storedRefresh },
          },
        );
        this.setTokens(data.access_token, data.refresh_token);
        return true;
      } catch {
        return false;
      }
    },

    logout() {
      this.user = null;
      this.accessToken = null;
      this.refreshToken = null;
      if (import.meta.client) {
        localStorage.removeItem('refresh_token');
      }
    },
  },
});