<template>
  <div class="max-w-2xl mx-auto">
    <NuxtLink to="/commandes" class="text-sm text-sage hover:underline mb-6 inline-block">
      ← Retour à mes commandes
    </NuxtLink>

    <div v-if="loading" class="animate-pulse space-y-4">
      <div class="h-8 bg-mist rounded w-1/2" />
      <div class="h-40 bg-mist rounded-2xl" />
    </div>

    <div v-else-if="order">
      <div class="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h1 class="text-2xl font-semibold mb-1">Commande #{{ order.id.slice(0, 8) }}</h1>
          <p class="text-sm text-ink/60">
            Passée le {{ new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }}
          </p>
        </div>
        <OrderStatusBadge :status="order.status" />
      </div>

      <!-- Suivi de statut -->
      <div class="bg-white rounded-2xl border border-mist p-6 mb-6">
        <h2 class="font-medium mb-4">Suivi de la commande</h2>
        <div class="flex items-center justify-between">
          <div
            v-for="(step, index) in statusSteps"
            :key="step.value"
            class="flex flex-col items-center flex-1 relative"
          >
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold z-10"
              :class="isStepDone(step.value) ? 'bg-sage text-white' : 'bg-mist text-ink/40'"
            >
              <svg v-if="isStepDone(step.value)" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <span class="text-xs text-center mt-2 text-ink/60">{{ step.label }}</span>

            <div
              v-if="index < statusSteps.length - 1"
              class="absolute top-4 left-1/2 w-full h-0.5 -z-0"
              :class="isStepDone(statusSteps[index + 1].value) ? 'bg-sage' : 'bg-mist'"
            />
          </div>
        </div>

        <p v-if="order.status === 'CANCELLED'" class="text-clay text-sm mt-4 text-center">
          Cette commande a été annulée.
        </p>
      </div>

      <!-- Articles -->
      <div class="bg-white rounded-2xl border border-mist p-6 mb-6">
        <h2 class="font-medium mb-4">Articles commandés</h2>
        <div class="flex flex-col gap-4">
          <div v-for="item in order.items" :key="item.id" class="flex items-center gap-4">
            <div class="w-16 h-16 bg-mist rounded-xl flex-shrink-0 overflow-hidden">
              <img
                v-if="item.product.imageUrl"
                :src="item.product.imageUrl"
                :alt="item.product.name"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="flex-1">
              <NuxtLink :to="`/produits/${item.product.slug}`" class="font-medium hover:text-sage transition-colors">
                {{ item.product.name }}
              </NuxtLink>
              <p class="text-sm text-ink/60">Quantité : {{ item.quantity }} × {{ item.price.toFixed(2) }} TND</p>
            </div>
            <p class="price">{{ (item.price * item.quantity).toFixed(2) }} TND</p>
          </div>
        </div>

        <div class="border-t border-mist mt-4 pt-4 flex justify-between font-medium">
          <span>Total</span>
          <span class="price text-lg">{{ order.totalPrice.toFixed(2) }} TND</span>
        </div>
      </div>

      <button
        v-if="order.status === 'PENDING'"
        @click="handleCancel"
        :disabled="cancelling"
        class="btn-secondary w-full"
      >
        {{ cancelling ? 'Annulation...' : 'Annuler la commande' }}
      </button>
    </div>

    <div v-else class="text-center py-20">
      <p class="text-ink/60">Commande introuvable.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' });

import type { Order } from '~/types/order';

const route = useRoute();
const router = useRouter();
const { fetchOrderById, cancelOrder } = useOrders();

const order = ref<Order | null>(null);
const loading = ref(true);
const cancelling = ref(false);

const statusSteps = [
  { value: 'PENDING', label: 'Enregistrée' },
  { value: 'CONFIRMED', label: 'Confirmée' },
  { value: 'PROCESSING', label: 'Préparation' },
  { value: 'SHIPPED', label: 'Expédiée' },
  { value: 'DELIVERED', label: 'Livrée' },
];

const isStepDone = (stepValue: string) => {
  if (!order.value) return false;
  const order_ = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
  const currentIndex = order_.indexOf(order.value.status);
  const stepIndex = order_.indexOf(stepValue);
  return stepIndex <= currentIndex && order.value.status !== 'CANCELLED';
};

const handleCancel = async () => {
  if (!order.value || !confirm('Voulez-vous vraiment annuler cette commande ?')) return;

  cancelling.value = true;
  try {
    await cancelOrder(order.value.id);
    order.value = await fetchOrderById(order.value.id);
  } catch (error: any) {
    alert(error?.data?.message || "Impossible d'annuler cette commande");
  } finally {
    cancelling.value = false;
  }
};

onMounted(async () => {
  try {
    order.value = await fetchOrderById(route.params.id as string);
  } catch {
    order.value = null;
  } finally {
    loading.value = false;
  }
});
</script>