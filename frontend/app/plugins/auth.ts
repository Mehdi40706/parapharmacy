import { useAuthStore } from '~/stores/auth.store';

export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();

  if (authStore.accessToken && !authStore.user) {
    try {
      await authStore.fetchProfile();
    } catch {
      const success = await authStore.refreshAccessToken();
      if (success) {
        await authStore.fetchProfile();
      }
    }
  }
});