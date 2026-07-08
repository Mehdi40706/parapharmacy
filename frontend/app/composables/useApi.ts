import { useAuthStore } from "~/stores/auth.store";

export const useApi = () => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  const apiFetch = $fetch.create({
    baseURL: config.public.apiBase,

    onRequest({ options }) {
      if (authStore.accessToken) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${authStore.accessToken}`,
        } as any;
      }
    },

    async onResponseError({ response, request, options }) {
      if (response.status === 401 && authStore.refreshToken) {
        const refreshed = await authStore.refreshAccessToken();
        if (refreshed) {
          return apiFetch(request as any, options as any);
        }
        authStore.logout();
        await navigateTo('/auth/login');
      }
    },
  });

  return apiFetch;
};