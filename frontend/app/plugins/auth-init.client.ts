import { useAuthStore } from '~/stores/auth.store';

export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore();

  // Le cookie est déjà accessible ici, plus besoin de le lire depuis localStorage
  if (authStore.accessToken && !authStore.user) {
    try {
      await authStore.fetchProfile();
    } catch {
      // Token invalide/expiré — tente un refresh
      const success = await authStore.refreshAccessToken();
      if (success) {
        await authStore.fetchProfile();
      }
    }
  }
});