export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore();

  if (!authStore.accessToken || authStore.user?.role !== 'ADMIN') {
    return navigateTo('/');
  }
});