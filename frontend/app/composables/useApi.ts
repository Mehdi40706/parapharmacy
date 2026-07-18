// composables/useApi.ts
import type { FetchOptions } from 'ofetch';
import { useAuthStore } from '~/stores/auth.store';

export const useApi = () => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  const rawFetch: typeof $fetch = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      if (authStore.accessToken) {
        const headers = new Headers(options.headers as HeadersInit);
        headers.set('Authorization', `Bearer ${authStore.accessToken}`);
        options.headers = headers;
      }
    },
  });

  async function apiFetch<T = any>(request: string, options: FetchOptions<'json'> = {}): Promise<T> {
    const isRefreshCall = request.includes('/auth/refresh');

    try {
      return await rawFetch<T>(request, options);
    } catch (error: any) {
      const status = error?.response?.status ?? error?.status;

      if (status === 401 && !isRefreshCall && authStore.refreshTokenValue) {
        const refreshed = await authStore.refreshAccessToken();
        if (refreshed && !(options as any)._retried) {
          return apiFetch<T>(request, { ...options, _retried: true } as FetchOptions<'json'>);
        }
      }

      if (status === 401) {
        authStore.logout();
        await navigateTo('/auth/login');
      }

      // On garde l'erreur ofetch intacte (avec .data ET .response) plutôt que
      // de la remplacer par son seul contenu .data — getApiErrorMessage sait
      // lire les deux formes.
      throw error;
    }
  }

  return apiFetch;
};

export const getApiErrorMessage = (error: any, fallback = 'Une erreur est survenue'): string => {
  const message = error?.data?.message ?? error?.response?.data?.message ?? error?.message;
  if (Array.isArray(message)) return message[0] ?? fallback;
  if (typeof message === 'string') return message;
  return fallback;
};