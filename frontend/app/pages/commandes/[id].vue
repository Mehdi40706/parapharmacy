<template>
  <div class="max-w-2xl mx-auto">
    <BackButton label="Retour" class="mb-6" />
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
      <div class="bg-white rounded-2xl border border-mist p-5 sm:p-6 mb-6">
        <h2 class="font-medium mb-6">Suivi de la commande</h2>

        <div class="relative">
          <!-- Ligne de fond -->
          <div class="absolute top-4 left-4 right-4 h-0.5 bg-mist" />
          <!-- Ligne de progression -->
          <div
            class="absolute top-4 left-4 h-0.5 bg-sage transition-all duration-500"
            :style="{ width: `calc(${progressWidth}% - 2rem)` }"
          />

          <div class="relative flex justify-between">
            <div
              v-for="(step, index) in statusSteps"
              :key="step.value"
              class="flex flex-col items-center"
              :style="{ width: `${100 / statusSteps.length}%` }"
            >
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors duration-300"
                :class="isStepDone(step.value) ? 'bg-sage text-white' : 'bg-mist text-ink/40'"
              >
                <Icon
                  v-if="isStepDone(step.value)"
                  name="lucide:check"
                  class="w-4 h-4"
                />
                <span v-else>{{ index + 1 }}</span>
              </div>
              <span
                class="text-[11px] sm:text-xs text-center mt-2 leading-tight px-0.5"
                :class="isStepDone(step.value) ? 'text-ink font-medium' : 'text-ink/50'"
              >
                {{ step.label }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="order.status === 'CANCELLED'" class="mt-5 flex items-center gap-2 justify-center bg-clay/10 text-clay text-sm rounded-xl py-2.5 px-4">
          <Icon name="lucide:x-circle" class="w-4 h-4 shrink-0" />
          Cette commande a été annulée.
        </div>
      </div>

      <!-- Articles -->
      <div class="bg-white rounded-2xl border border-mist p-5 sm:p-6 mb-6">
        <h2 class="font-medium mb-4">Articles commandés</h2>
        <div class="flex flex-col gap-4">
          <div v-for="item in order.items" :key="item.id" class="flex items-center gap-3 sm:gap-4">
            <div class="w-14 h-14 sm:w-16 sm:h-16 bg-mist rounded-xl shrink-0 overflow-hidden">
              <img
                v-if="item.product.imageUrl"
                :src="item.product.imageUrl"
                :alt="item.product.name"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="flex-1 min-w-0">
              <NuxtLink :to="`/produits/${item.product.slug}`" class="font-medium hover:text-sage transition-colors block truncate">
                {{ item.product.name }}
              </NuxtLink>
              <p class="text-sm text-ink/60">Quantité : {{ item.quantity }} × {{ Number(item.price).toFixed(2) }} TND</p>
            </div>
            <p class="price shrink-0">{{ (Number(item.price) * item.quantity).toFixed(2) }} TND</p>
          </div>
        </div>

        <div class="border-t border-mist mt-4 pt-4 flex justify-between font-medium">
          <span>Total</span>
          <span class="price text-lg">{{ Number(order.totalPrice).toFixed(2) }} TND</span>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-20">
      <p class="text-ink/60">Commande introuvable.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' });

import BackButton from '~/components/common/BackButton.vue';
import type { Order } from '~/types/order';

const route = useRoute();
const { fetchOrderById } = useOrders();

const order = ref<Order | null>(null);
const loading = ref(true);

const statusSteps = [
  { value: 'CONFIRMED', label: 'Confirmée' },
  { value: 'SHIPPED', label: 'Expédiée' },
  { value: 'DELIVERED', label: 'Livrée' },
];

const stepOrder = ['CONFIRMED', 'SHIPPED', 'DELIVERED'];

const isStepDone = (stepValue: string) => {
  if (!order.value || order.value.status === 'CANCELLED') return false;
  const currentIndex = stepOrder.indexOf(order.value.status);
  const stepIndex = stepOrder.indexOf(stepValue);
  return stepIndex <= currentIndex;
};

const progressWidth = computed(() => {
  if (!order.value || order.value.status === 'CANCELLED') return 0;
  const currentIndex = stepOrder.indexOf(order.value.status);
  if (currentIndex < 0) return 0;
  // Position du centre de l'étape courante dans la barre (0%, 50%, 100% pour 3 étapes)
  return (currentIndex / (stepOrder.length - 1)) * 100;
});

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