import { defineStore } from 'pinia';
import type { User } from '~/types/user';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
  }),

  getters: {
    accessToken: () => useCookie<string | null>('access_token').value,
    refreshTokenValue: () => useCookie<string | null>('refresh_token').value,
    isAuthenticated: (state) => !!useCookie('access_token').value,
    isAdmin: (state) => state.user?.role === 'ADMIN',
  },

  actions: {
    setTokens(access: string, refresh: string) {
      useCookie('access_token', { maxAge: 60 * 15 }).value = access;
      useCookie('refresh_token', { maxAge: 60 * 60 * 24 * 7 }).value = refresh;
    },

    setUser(user: User) {
      this.user = user;
    },

    async register(payload: { email: string; password: string; firstName: string; lastName: string }) {
      const config = useRuntimeConfig();
      const data = await $fetch<{ access_token: string; refresh_token: string }>(
        '/auth/register',
        { baseURL: config.public.apiBase, method: 'POST', body: payload },
      );
      this.setTokens(data.access_token, data.refresh_token);
      await this.fetchProfile();
    },
    async fetchProfile(tokenOverride?: string) {
  const config = useRuntimeConfig();
  const token = tokenOverride || this.accessToken;
  const user = await $fetch<User>('/auth/me', {
    baseURL: config.public.apiBase,
    headers: { Authorization: `Bearer ${token}` },
  });
  this.setUser(user);
},

async login(email: string, password: string) {
  const config = useRuntimeConfig();
  const data = await $fetch<{ access_token: string; refresh_token: string }>(
    '/auth/login',
    { baseURL: config.public.apiBase, method: 'POST', body: { email, password } },
  );
  this.setTokens(data.access_token, data.refresh_token);
  await this.fetchProfile(data.access_token); // ← passe le token directement, élimine tout doute de timing
},


    async refreshAccessToken(): Promise<boolean> {
      const config = useRuntimeConfig();
      const refreshCookie = useCookie<string | null>('refresh_token');

      if (!refreshCookie.value) return false;

      try {
        const data = await $fetch<{ access_token: string; refresh_token: string }>(
          '/auth/refresh',
          { baseURL: config.public.apiBase, method: 'POST', body: { refresh_token: refreshCookie.value } },
        );
        this.setTokens(data.access_token, data.refresh_token);
        return true;
      } catch {
        return false;
      }
    },

    logout() {
      this.user = null;
      useCookie('access_token').value = null;
      useCookie('refresh_token').value = null;
    },
  },
});