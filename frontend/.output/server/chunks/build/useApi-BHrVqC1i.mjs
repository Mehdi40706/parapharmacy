import { u as useAuthStore } from './auth.store-BJcHULJo.mjs';
import { n as navigateTo, c as useRuntimeConfig } from './server.mjs';

const useApi = () => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();
  const apiFetch = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      if (authStore.accessToken) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${authStore.accessToken}`
        };
      }
    },
    async onResponseError({ response, request, options }) {
      if (response.status === 401 && authStore.refreshToken) {
        const refreshed = await authStore.refreshAccessToken();
        if (refreshed) {
          return apiFetch(request, options);
        }
        authStore.logout();
        await navigateTo("/auth/login");
      }
    }
  });
  return apiFetch;
};

export { useApi as u };
//# sourceMappingURL=useApi-BHrVqC1i.mjs.map
