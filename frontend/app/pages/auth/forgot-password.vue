<template>
  <div>
    <h1 class="text-2xl font-semibold mb-1">Récupération de mot de passe</h1>
    <p class="text-ink/60 text-sm mb-6">Entrez votre adresse email pour récupérer votre mot de passe</p>

    <form @submit.prevent="handleRecover" class="flex flex-col gap-4">
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
      <button type="submit" :disabled="loading" class="btn-primary mt-2">
        {{ loading ? '...' : 'Submit' }}
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

const form = reactive({ email: '', password: '' });
const loading = ref(false);
const errorMessage = ref('');

const handleRecover = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    await authStore.login(form.email, form.password);
    // Redirection selon le rôle
    if (authStore.isAdmin) {
      router.push('/admin');
    } else {
      router.push('/produits');
    }
  } catch (error: any) {
     if(error.response?.status === 429) {
    toast.error("Trop de tentatives de connexion. Veuillez patienter 1 minute avant de réessayer.");
  } else {
    toast.error(error?.data?.message || 'Email ou mot de passe incorrect');
  }
  } finally {
    loading.value = false;
  }
};
</script>   
