<template>
  <div class="max-w-2xl mx-auto">
    <h1 class="text-3xl font-semibold mb-8">Finaliser la commande</h1>

    <div v-if="cartStore.isEmpty" class="text-center py-20">
      <p class="text-ink/60 mb-4">Votre panier est vide.</p>
      <NuxtLink to="/produits" class="btn-primary inline-block">Voir les produits</NuxtLink>
    </div>

    <div v-else class="flex flex-col gap-6">
      <!-- Récapitulatif -->
      <div class="bg-white rounded-2xl border border-mist p-6">
        <h2 class="font-medium mb-4">Récapitulatif</h2>
        <div class="flex flex-col gap-3">
          <div
            v-for="item in cartStore.items"
            :key="item.product.id"
            class="flex justify-between text-sm"
          >
            <span>{{ item.product.name }} × {{ item.quantity }}</span>
            <span class="price">{{ (item.product.price * item.quantity).toFixed(2) }} TND</span>
          </div>
        </div>
        <div class="border-t border-mist my-4" />
        <div class="flex justify-between font-medium">
          <span>Total</span>
          <span class="price text-lg">{{ cartStore.total.toFixed(2) }} TND</span>
        </div>
      </div>

      <!-- Livraison (infos utilisateur) -->
      <div class="bg-white rounded-2xl border border-mist p-6">
        <h2 class="font-medium mb-4">Informations de livraison</h2>
        <div class="text-sm text-ink/70 flex flex-col gap-1">
          <p>{{ authStore.user?.firstName }} {{ authStore.user?.lastName }}</p>
          <p>{{ authStore.user?.email }}</p>
          <p>{{ authStore.user?.phone || 'Aucun numéro renseigné' }}</p>
        </div>
      </div>

      <p v-if="errorMessage" class="text-clay text-sm bg-clay/10 rounded-lg px-4 py-3">
        {{ errorMessage }}
      </p>

      <button
        @click="handlePayment"
        :disabled="processing"
        class="btn-primary w-full py-3 text-base"
      >
        {{ processing ? 'Redirection vers le paiement...' : `Payer ${cartStore.total.toFixed(2)} TND` }}
      </button>

      <p class="text-xs text-center text-ink/50">
        Paiement sécurisé via Konnect — cartes bancaires, wallet, e-DINAR
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' });

const cartStore = useCartStore();
const authStore = useAuthStore();
const { createOrder } = useOrders();
const { initiatePayment } = usePayments();

const processing = ref(false);
const errorMessage = ref('');

const handlePayment = async () => {
  processing.value = true;
  errorMessage.value = '';

  try {
    // 1. Créer la commande côté backend
    const order = await createOrder({
      items: cartStore.items.map((i) => ({
        productId: i.product.id,
        quantity: i.quantity,
      })),
    });

    // 2. Initier le paiement Konnect
    const { payUrl } = await initiatePayment(order.id);

    // On garde une trace de la commande en cours pour la page succès/annulation
    if (import.meta.client) {
      sessionStorage.setItem('pending_order_id', order.id);
    }

    // 3. Vider le panier AVANT la redirection (la commande est déjà créée en base)
    cartStore.clear();

    // 4. Rediriger vers Konnect
    window.location.href = payUrl;
  } catch (error: any) {
    errorMessage.value =
      error?.data?.message || 'Une erreur est survenue lors de la création de la commande';
    processing.value = false;
  }
};
</script>