<template>
  <div>
    <h1 class="text-2xl font-semibold mb-1">Content de vous revoir</h1>
    <p class="text-ink/60 text-sm mb-6">Connectez-vous à votre compte</p>

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

      <p v-if="errorMessage" class="text-clay text-sm bg-clay/10 rounded-lg px-3 py-2">
        {{ errorMessage }}
      </p>

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
definePageMeta({ layout: 'auth', middleware: 'guest' });

const authStore = useAuthStore();
const router = useRouter();

const form = reactive({ email: '', password: '' });
const loading = ref(false);
const errorMessage = ref('');

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    await authStore.login(form.email, form.password);

    // Redirection selon le rôle
    if (authStore.isAdmin) {
      router.push('/admin');
    } else {
      router.push('/');
    }
  } catch (error: any) {
    errorMessage.value = error?.data?.message || 'Email ou mot de passe incorrect';
  } finally {
    loading.value = false;
  }
};
</script>