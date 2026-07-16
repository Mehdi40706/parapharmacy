<template>
  <div class="max-w-lg mx-auto text-center py-12 flex flex-col items-center gap-4">
    <div v-if="loading" class="flex flex-col items-center gap-4">
      <div class="w-10 h-10 border-4 border-mist border-t-sage rounded-full animate-spin" />
      <p class="text-ink/60">Chargement de la commande...</p>
    </div>

    <template v-else-if="orderId">
      <div class="w-16 h-16 rounded-full bg-honey/10 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-honey-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 class="text-2xl font-semibold">Paiement non finalisé</h1>
      <p class="text-ink/60">
        Votre commande a bien été enregistrée, mais le paiement n'a pas encore abouti.
        Vous pouvez réessayer — votre commande reste réservée pendant 15 minutes.
      </p>

      <p v-if="errorMessage" class="text-clay text-sm">{{ errorMessage }}</p>

      <button
        @click="retry"
        :disabled="retrying"
        class="btn-primary mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ retrying ? 'Redirection en cours...' : 'Réessayer le paiement' }}
      </button>

      <div class="flex gap-3 mt-2">
        <NuxtLink to="/produits" class="btn-secondary">Continuer mes achats</NuxtLink>
        <NuxtLink to="/compte/commandes" class="btn-secondary">Voir mes commandes</NuxtLink>
      </div>
    </template>

    <template v-else>
      <div class="w-16 h-16 rounded-full bg-clay/10 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-clay" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h1 class="text-2xl font-semibold">Commande introuvable</h1>
      <p class="text-ink/60">Impossible de retrouver la commande à payer.</p>
      <NuxtLink to="/compte/commandes" class="btn-primary mt-2">Voir mes commandes</NuxtLink>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast';

definePageMeta({ middleware: 'auth' });

const route = useRoute();
const toast = useToast();
const { initiatePayment } = usePayments();

const orderId = computed(() => route.query.order_id as string | undefined);

const loading = ref(false); // pas de fetch initial nécessaire, order_id vient de la query
const retrying = ref(false);
const errorMessage = ref('');

const retry = async () => {
  if (!orderId.value) return;

  errorMessage.value = '';
  retrying.value = true;

  try {
    const { payUrl } = await initiatePayment(orderId.value);
    if (import.meta.client) sessionStorage.setItem('pending_order_id', orderId.value);
    window.location.href = payUrl;
    // pas de reset de retrying : on quitte la page via la redirection
  } catch (error: any) {
    retrying.value = false;
    errorMessage.value =
      error?.data?.message ||
      "Impossible de relancer le paiement. La commande a peut-être expiré — vérifiez son statut dans vos commandes.";
    toast.error(errorMessage.value);
  }
};
</script>