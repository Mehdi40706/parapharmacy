<template>
  <div class="max-w-lg mx-auto text-center py-12">
    <div v-if="loading" class="flex flex-col items-center gap-4">
      <div class="w-10 h-10 border-4 border-mist border-t-sage rounded-full animate-spin" />
      <p class="text-ink/60">Vérification de la commande...</p>
    </div>

    <div v-else-if="isCod" class="flex flex-col items-center gap-4">
      <div class="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 class="text-2xl font-semibold">Commande confirmée !</h1>
      <p class="text-ink/60">
        Votre commande a bien été enregistrée. Vous réglerez en espèces à la livraison.
        Un email de confirmation vous a été envoyé.
      </p>
      <NuxtLink to="/compte/commandes" class="btn-primary mt-2">Voir mes commandes</NuxtLink>
    </div>

    <div v-else-if="status === 'PAID'" class="flex flex-col items-center gap-4">
      <div class="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 class="text-2xl font-semibold">Paiement confirmé !</h1>
      <p class="text-ink/60">Votre commande a bien été enregistrée. Un email de confirmation vous a été envoyé.</p>
      <NuxtLink to="/compte/commandes" class="btn-primary mt-2">Voir mes commandes</NuxtLink>
    </div>

    <div v-else class="flex flex-col items-center gap-4">
      <div class="w-16 h-16 rounded-full bg-honey/10 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-honey-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 class="text-2xl font-semibold">Paiement en cours de traitement</h1>
      <p class="text-ink/60">
        Nous n'avons pas encore reçu la confirmation finale. Vérifiez le statut de votre commande dans quelques instants.
      </p>
      <NuxtLink to="/compte/commandes" class="btn-secondary mt-2">Voir mes commandes</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' });

const route = useRoute();
const { getPaymentStatus } = usePayments();
const loading = ref(true);
const status = ref<string>('PENDING');

// COD : on fait confiance au redirect direct depuis le checkout, pas besoin de vérifier un paiement Konnect
const isCod = computed(() => route.query.method === 'COD');

onMounted(async () => {
  const orderId = (route.query.order_id as string) || sessionStorage.getItem('pending_order_id');

  if (isCod.value) {
    // Rien à vérifier côté Konnect — la commande a déjà été créée avec succès pour arriver ici
    loading.value = false;
    if (import.meta.client) sessionStorage.removeItem('pending_order_id');
    return;
  }

  if (!orderId) {
    loading.value = false;
    return;
  }

  const maxAttempts = 5;
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const result = await getPaymentStatus(orderId);
      if (result.paymentStatus === 'PAID') {
        status.value = 'PAID';
        sessionStorage.removeItem('pending_order_id');
        break;
      }
    } catch {
      // continue les tentatives
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  loading.value = false;
});
</script>