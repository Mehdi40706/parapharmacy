import type { FetchOptions } from 'ofetch';
import { useAuthStore } from '~/stores/auth.store';

export const useApi = () => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  const apiFetch: typeof $fetch = $fetch.create({
    baseURL: config.public.apiBase,

    onRequest({ options }) {
      if (authStore.accessToken) {
        const headers = new Headers(options.headers as HeadersInit);
        headers.set('Authorization', `Bearer ${authStore.accessToken}`);
        options.headers = headers;
      }
    },

    async onResponseError({ response, request, options }) {
      if (response.status === 401 && authStore.refreshTokenValue) {
        const refreshed = await authStore.refreshAccessToken();
        if (refreshed) {
          return apiFetch(request as string, options as FetchOptions<'json'>);
        }
      }

      if (response.status === 401) {
        authStore.logout();
        await navigateTo('/auth/login');
      }

      // Toujours relancer, sinon les appelants reçoivent `undefined` au lieu d'une erreur
      throw response._data ?? response;
    },
  });

  return apiFetch;
};
export const getApiErrorMessage = (error: any, fallback = 'Une erreur est survenue'): string => {
  const message = error?.message ?? error?.data?.message;
  if (Array.isArray(message)) return message[0] ?? fallback;
  if (typeof message === 'string') return message;
  return fallback;
};