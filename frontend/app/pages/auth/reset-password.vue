<template>
  <div>
    <h1 class="text-2xl font-semibold mb-1">Nouveau mot de passe</h1>
    <p class="text-ink/60 text-sm mb-6">Choisissez un nouveau mot de passe pour votre compte</p>

    <div v-if="!tokenPresent" class="text-sm text-clay bg-clay/10 rounded-lg px-4 py-3">
      Ce lien est invalide ou a expiré. Merci de refaire une demande de réinitialisation.
    </div>

    <div v-else-if="tokenRejected" class="flex flex-col gap-4">
      <p class="text-sm text-clay bg-clay/10 rounded-lg px-4 py-3">
        Ce lien de réinitialisation est invalide ou a expiré. Les liens sont valables 1 heure.
      </p>
      <NuxtLink to="/auth/forgot-password" class="btn-primary text-center">
        Refaire une demande
      </NuxtLink>
    </div>

    <div v-else-if="done" class="flex flex-col gap-4">
      <p class="text-sm text-ink/70 bg-sage/10 rounded-lg px-4 py-3">
        Votre mot de passe a été mis à jour avec succès.
      </p>
      <NuxtLink to="/auth/login" class="btn-primary text-center">
        Se connecter
      </NuxtLink>
    </div>

    <form v-else @submit.prevent="handleReset" class="flex flex-col gap-4" novalidate>
      <div>
        <label class="block text-sm font-medium mb-1.5">Nouveau mot de passe</label>
        <input
          v-model="form.newPassword"
          type="password"
          class="input-field"
          placeholder="••••••••"
          :class="{ 'border-clay': touched && errors.newPassword }"
          @blur="touched = true"
        />
        <p v-if="touched && errors.newPassword" class="text-clay text-xs mt-1">
          {{ errors.newPassword }}
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1.5">Confirmer le mot de passe</label>
        <input
          v-model="form.confirmPassword"
          type="password"
          class="input-field"
          placeholder="••••••••"
          :class="{ 'border-clay': touched && errors.confirmPassword }"
          @blur="touched = true"
        />
        <p v-if="touched && errors.confirmPassword" class="text-clay text-xs mt-1">
          {{ errors.confirmPassword }}
        </p>
      </div>

      <p v-if="submitError" class="text-clay text-sm bg-clay/10 rounded-lg px-4 py-3">
        {{ submitError }}
      </p>

      <button type="submit" :disabled="loading" class="btn-primary mt-2 disabled:opacity-50">
        {{ loading ? 'Mise à jour...' : 'Réinitialiser le mot de passe' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast';

definePageMeta({ layout: 'auth', middleware: 'guest' });
const toast = useToast();
const route = useRoute();
const { resetPassword } = useAuth();

const token = route.query.token as string | undefined;
const tokenPresent = computed(() => !!token);

const form = reactive({ newPassword: '', confirmPassword: '' });
const loading = ref(false);
const done = ref(false);
const touched = ref(false);
const tokenRejected = ref(false);
const submitError = ref('');

const errors = computed(() => {
  const e: Record<string, string> = {};

  if (!form.newPassword) {
    e.newPassword = 'Le mot de passe est requis.';
  } else if (form.newPassword.length < 6) {
    e.newPassword = 'Le mot de passe doit contenir au moins 8 caractères.';
  }

  if (!form.confirmPassword) {
    e.confirmPassword = 'Merci de confirmer votre mot de passe.';
  } else if (form.newPassword && form.confirmPassword !== form.newPassword) {
    e.confirmPassword = 'Les mots de passe ne correspondent pas.';
  }

  return e;
});

const canSubmit = computed(() => Object.keys(errors.value).length === 0);

const handleReset = async () => {
  touched.value = true;
  submitError.value = '';

  if (!canSubmit.value || !token) return;

  loading.value = true;
  try {
    await resetPassword(token, form.newPassword);
    done.value = true;
  } catch (error: any) {
    const status = error?.response?.status ?? error?.status;

    if (status === 401 || status === 400) {
      // Token invalide/expiré — bascule vers l'état dédié plutôt qu'un simple toast
      tokenRejected.value = true;
    } else if (status === 429) {
      submitError.value = 'Trop de tentatives. Merci de patienter avant de réessayer.';
    } else {
      submitError.value =
        error?.data?.message || 'Une erreur est survenue, merci de réessayer.';
    }
    toast.error(submitError.value || 'Ce lien est invalide ou a expiré.');
  } finally {
    loading.value = false;
  }
};
</script>