<template>
  <div>
    <h1 class="text-2xl font-semibold mb-1">Créer un compte</h1>
    <p class="text-ink/60 text-sm mb-6">Rejoignez-nous en quelques secondes</p>

    <form @submit.prevent="handleRegister" class="flex flex-col gap-4">
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm font-medium mb-1.5">Prénom</label>
          <input v-model="form.firstName" type="text" required class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5">Nom</label>
          <input v-model="form.lastName" type="text" required class="input-field" />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1.5">Email</label>
        <input v-model="form.email" type="email" required class="input-field" placeholder="vous@exemple.com" />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1.5">Mot de passe</label>
        <input
          v-model="form.password"
          type="password"
          required
          minlength="6"
          class="input-field"
          placeholder="6 caractères minimum"
        />
      </div>

      <p v-if="errorMessage" class="text-clay text-sm bg-clay/10 rounded-lg px-3 py-2">
        {{ errorMessage }}
      </p>

      <button type="submit" :disabled="loading" class="btn-primary mt-2">
        {{ loading ? 'Création...' : 'Créer mon compte' }}
      </button>

      <p class="text-sm text-center pt-2">
        Déjà un compte ?
        <NuxtLink to="/auth/login" class="text-sage hover:underline font-medium">
          Se connecter
        </NuxtLink>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast';

definePageMeta({ layout: 'auth', middleware: 'guest' });

const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();
const form = reactive({ firstName: '', lastName: '', email: '', password: '' });
const loading = ref(false);
const errorMessage = ref('');

const handleRegister = async () => {
  loading.value = true;
  errorMessage.value = '';
  try {
    await authStore.register(form);
    toast.success('Inscription réussie !');
    router.push('/produits');
  } catch (error: any) {
      toast.error(
        error?.data?.message ||
        error?.response?.data?.message ||
        "Une erreur est survenue lors de l'inscription."
      );
    } finally {
    loading.value = false;
  }
};
</script>