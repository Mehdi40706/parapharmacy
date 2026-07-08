import { defineStore } from 'pinia';
import { c as useRuntimeConfig } from './server.mjs';

const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    accessToken: null,
    refreshToken: null
  }),
  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    isAdmin: (state) => state.user?.role === "ADMIN"
  },
  actions: {
    setTokens(access, refresh) {
      this.accessToken = access;
      this.refreshToken = refresh;
    },
    setUser(user) {
      this.user = user;
    },
    async login(email, password) {
      const config = useRuntimeConfig();
      const data = await $fetch(
        "/auth/login",
        {
          baseURL: config.public.apiBase,
          method: "POST",
          body: { email, password }
        }
      );
      this.setTokens(data.access_token, data.refresh_token);
      await this.fetchProfile();
    },
    async register(payload) {
      const config = useRuntimeConfig();
      const data = await $fetch(
        "/auth/register",
        {
          baseURL: config.public.apiBase,
          method: "POST",
          body: payload
        }
      );
      this.setTokens(data.access_token, data.refresh_token);
      await this.fetchProfile();
    },
    async fetchProfile() {
      const config = useRuntimeConfig();
      const user = await $fetch("/auth/me", {
        baseURL: config.public.apiBase,
        headers: { Authorization: `Bearer ${this.accessToken}` }
      });
      this.setUser(user);
    },
    async refreshAccessToken() {
      const config = useRuntimeConfig();
      const storedRefresh = this.refreshToken || null;
      if (!storedRefresh) return false;
      try {
        const data = await $fetch(
          "/auth/refresh",
          {
            baseURL: config.public.apiBase,
            method: "POST",
            body: { refresh_token: storedRefresh }
          }
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
    }
  }
});

export { useAuthStore as u };
//# sourceMappingURL=auth.store-BJcHULJo.mjs.map
