<template>
  <div>
    <h1 class="text-2xl font-semibold mb-1">Content de vous revoir</h1>
    <p class="text-ink/60 text-sm mb-6">Connectez-vous à votre compte</p>

    <button
      type="button"
      @click="handleGoogleLogin"
      class="w-full flex items-center justify-center gap-2.5 border border-mist rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50 transition mb-6"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
      </svg>
      Continuer avec Google
    </button>

    <div class="relative mb-6">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-mist" />
      </div>
      <div class="relative flex justify-center text-xs">
        <span class="bg-white px-3 text-ink/40">ou</span>
      </div>
    </div>

    <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
      <div>
        <label class="block text-sm font-medium mb-1.5">Email</label>
        <input
          v-model="form.email"
          type="email"
          required
          class="input-field"
          placeholder="vous@exemple.com"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1.5">Mot de passe</label>
        <input
          v-model="form.password"
          type="password"
          required
          class="input-field"
          placeholder="••••••••"
        />
      </div>

      <button type="submit" :disabled="loading" class="btn-primary mt-2">
        {{ loading ? 'Connexion...' : 'Se connecter' }}
      </button>

      <div class="flex justify-between text-sm pt-2">
        <NuxtLink to="/auth/forgot-password" class="text-sage hover:underline">
          Mot de passe oublié ?
        </NuxtLink>
        <NuxtLink to="/auth/register" class="text-sage hover:underline font-medium">
          Créer un compte
        </NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast';

definePageMeta({ layout: 'auth', middleware: 'guest' });
const toast = useToast();
const authStore = useAuthStore();
const router = useRouter();
const config = useRuntimeConfig();

const form = reactive({ email: '', password: '' });
const loading = ref(false);
const errorMessage = ref('');

const handleGoogleLogin = () => {
  // Navigation complète du navigateur (pas un fetch) — nécessaire pour le flow OAuth Google
  window.location.href = `${config.public.apiBase}/auth/google`;
};

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    await authStore.login(form.email, form.password);
    if (authStore.isAdmin) {
      router.push('/admin');
    } else {
      router.push('/produits');
    }
  } catch (error: any) {
    if (error.response?.status === 429) {
      toast.error('Trop de tentatives de connexion. Veuillez patienter 1 minute avant de réessayer.');
    } else {
      toast.error(error?.data?.message || 'Email ou mot de passe incorrect');
    }
  } finally {
    loading.value = false;
  }
};
</script>