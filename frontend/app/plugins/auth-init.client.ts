import { useAuthStore } from "~/stores/auth.store";

export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();

  if (import.meta.client) {
    const storedRefresh = localStorage.getItem('refresh_token');
    if (storedRefresh && !authStore.accessToken) {
      authStore.refreshToken = storedRefresh;
      const success = await authStore.refreshAccessToken();
      if (success) {
        await authStore.fetchProfile();
      }
    }
  }
});