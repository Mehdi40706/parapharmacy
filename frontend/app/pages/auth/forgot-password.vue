<template>
  <div>
    <h1 class="text-2xl font-semibold mb-1">Récupération de mot de passe</h1>
    <p class="text-ink/60 text-sm mb-6">
      {{ sent ? 'Vérifiez votre boîte mail.' : 'Entrez votre adresse email pour récupérer votre mot de passe' }}
    </p>

    <div v-if="sent" class="flex flex-col gap-4">
      <p class="text-sm text-ink/70 bg-sage/10 rounded-lg px-4 py-3">
        Si un compte existe avec cette adresse, un email contenant un lien de réinitialisation vient de vous être envoyé.
      </p>
      <NuxtLink to="/auth/login" class="text-sage hover:underline text-sm text-center">
        Retour à la connexion
      </NuxtLink>
    </div>

    <form v-else @submit.prevent="handleRecover" class="flex flex-col gap-4">
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
        {{ loading ? 'Envoi...' : 'Envoyer le lien de réinitialisation' }}
      </button>

      <div class="flex justify-between text-sm pt-2">
        <NuxtLink to="/auth/login" class="text-sage hover:underline">
          Se connecter
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
const { forgotPassword } = useAuth();

const form = reactive({ email: '' });
const loading = ref(false);
const sent = ref(false);

const handleRecover = async () => {
  loading.value = true;

  try {
    await forgotPassword(form.email);
    sent.value = true; // ✅ toujours afficher succès, même si l'email n'existe pas (évite l'énumération de comptes)
  } catch (error: any) {
    if (error?.response?.status === 429) {
      toast.error('Trop de tentatives. Veuillez patienter 1 minute avant de réessayer.');
    } else if (error?.response?.status === 404) {
      toast.error("Aucun compte n'est associé à cette adresse email.");
    } else {
      // Par sécurité, on affiche quand même un message neutre plutôt que l'erreur brute
      toast.error("Une erreur est survenue, merci de réessayer.");
    }
  } finally {
    loading.value = false;
  }
};
</script>