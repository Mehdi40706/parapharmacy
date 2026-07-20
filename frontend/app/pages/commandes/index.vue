<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl sm:text-3xl font-semibold">Mes commandes</h1>
      <BackButton label="Retour" class="mb-6" />
    </div>

    <!-- Filtres statut -->
    <div class="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
      <button
        v-for="s in statusFilters"
        :key="s.value ?? 'all'"
        @click="setFilter(s.value)"
        class="badge-pill flex-shrink-0 px-4 py-2 text-sm font-medium transition-colors"
        :class="activeFilter === s.value ? 'bg-sage text-white' : 'bg-white border border-mist text-ink/70 hover:border-sage'"
      >
        {{ s.label }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col gap-3">
      <div v-for="n in 3" :key="n" class="h-32 bg-mist rounded-2xl animate-pulse" />
    </div>

    <!-- Vide -->
    <div v-else-if="orders.length === 0" class="text-center py-20">
      <p class="text-ink/60 mb-4">Aucune commande {{ activeFilter ? 'avec ce statut' : 'pour le moment' }}.</p>
      <NuxtLink to="/produits" class="btn-primary inline-block">
        Découvrir nos produits
      </NuxtLink>
    </div>

    <!-- Liste -->
    <div v-else class="flex flex-col gap-4">
      <div
        v-for="order in orders"
        :key="order.id"
        class="bg-white rounded-2xl border border-mist p-5"
      >
        <div class="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <p class="text-xs text-ink/50 uppercase tracking-wide mb-1">
              Commande #{{ order.id.slice(0, 8) }}
            </p>
            <p class="text-sm text-ink/60">
              {{ new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) }}
            </p>
          </div>
          <div class="flex items-center gap-2">
            <OrderStatusBadge :status="order.status" />
            <span
              v-if="order.paymentStatus === 'PAID'"
              class="badge-pill bg-sage/10 text-sage-dark text-xs"
            >
              Payée
            </span>
            <span
              v-else-if="order.paymentStatus === 'FAILED'"
              class="badge-pill bg-clay/10 text-clay text-xs"
            >
              Paiement échoué
            </span>
          </div>
        </div>

        <!-- Aperçu articles -->
        <div class="flex flex-col gap-2 mb-4">
          <div
            v-for="item in order.items.slice(0, expandedOrders.has(order.id) ? order.items.length : 2)"
            :key="item.id"
            class="flex items-center gap-3 text-sm"
          >
            <div class="w-12 h-12 bg-mist rounded-lg flex-shrink-0 overflow-hidden">
              <img
                v-if="item.product.imageUrl"
                :src="item.product.imageUrl"
                :alt="item.product.name"
                class="w-full h-full object-cover"
              />
            </div>
            <span class="flex-1 truncate">{{ item.product.name }}</span>
            <span class="text-ink/50">× {{ item.quantity }}</span>
            <span class="price">{{ (item.price * item.quantity).toFixed(2) }} TND</span>
          </div>

          <button
            v-if="order.items.length > 2"
            @click="toggleExpand(order.id)"
            class="text-xs text-sage hover:underline self-start"
          >
            {{ expandedOrders.has(order.id) ? 'Voir moins' : `Voir les ${order.items.length - 2} autres articles` }}
          </button>
        </div>

        <div class="border-t border-mist pt-4 flex flex-wrap items-center justify-between gap-3">
          <p class="price text-lg">Total : {{ order.totalPrice.toFixed(2) }} TND</p>

          <div class="flex gap-2">
            <button
              v-if="order.status === 'PENDING'"
              @click="handleCancel(order.id)"
              :disabled="cancellingId === order.id"
              class="btn-secondary text-sm py-1.5 px-4"
            >
              {{ cancellingId === order.id ? 'Annulation...' : 'Annuler' }}
            </button>

            <NuxtLink :to="`/commandes/${order.id}`" class="btn-primary text-sm py-1.5 px-4">
              Voir le détail
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="pagination && pagination.totalPages > 1" class="flex justify-center gap-2 mt-8">
      <button
        v-for="page in pagination.totalPages"
        :key="page"
        @click="goToPage(page)"
        class="w-9 h-9 rounded-pill text-sm font-medium transition-colors"
        :class="page === currentPage ? 'bg-sage text-white' : 'hover:bg-mist'"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' });

import BackButton from '~/components/common/BackButton.vue';
import { useToast } from '~/composables/useToast';
import type { Order } from '~/types/order';

const { fetchMyOrders, cancelOrder } = useOrders();

const orders = ref<Order[]>([]);
const pagination = ref<any>(null);
const loading = ref(true);
const currentPage = ref(1);
const activeFilter = ref<string | undefined>(undefined);
const cancellingId = ref<string | null>(null);
const expandedOrders = ref<Set<string>>(new Set());

const statusFilters = [
  { label: 'Toutes', value: undefined },
  { label: 'En attente', value: 'PENDING' },
  { label: 'Confirmées', value: 'CONFIRMED' },
  { label: 'Expédiées', value: 'SHIPPED' },
  { label: 'Livrées', value: 'DELIVERED' },
  { label: 'Annulées', value: 'CANCELLED' },
];

const load = async () => {
  loading.value = true;
  try {
    const result = await fetchMyOrders({
      status: activeFilter.value,
      page: currentPage.value,
      limit: 10,
    });
    orders.value = result.data;
    pagination.value = result.meta;
  } finally {
    loading.value = false;
  }
};

const setFilter = (value: string | undefined) => {
  activeFilter.value = value;
  currentPage.value = 1;
  load();
};

const goToPage = (page: number) => {
  currentPage.value = page;
  load();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const toggleExpand = (orderId: string) => {
  if (expandedOrders.value.has(orderId)) {
    expandedOrders.value.delete(orderId);
  } else {
    expandedOrders.value.add(orderId);
  }
};

const toast = useToast();

const handleCancel = async (orderId: string) => {
  if (!confirm('Voulez-vous vraiment annuler cette commande ?')) return;

  cancellingId.value = orderId;
  try {
    await cancelOrder(orderId);
    await load();
    toast.success('Commande annulée avec succès.');
  } catch (error: any) {
    toast.error(error?.data?.message || "Impossible d'annuler cette commande");
  } finally {
    cancellingId.value = null;
  }
};

onMounted(load);
</script>