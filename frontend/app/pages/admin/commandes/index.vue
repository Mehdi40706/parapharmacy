<template>
  <div>
    <h1 class="text-2xl font-semibold mb-6">Commandes</h1>

    <div class="flex gap-2 mb-6 overflow-x-auto">
      <button
        v-for="s in statusFilters"
        :key="s.value ?? 'all'"
        @click="setFilter(s.value)"
        class="badge-pill whitespace-nowrap"
        :class="activeFilter === s.value ? 'bg-sage text-white' : 'bg-mist text-ink/70'"
      >
        {{ s.label }}
      </button>
    </div>

    <!-- État vide -->
    <div
      v-if="!loading && orders.length === 0"
      class="rounded-2xl border border-dashed border-mist bg-mist/20 p-12 text-center"
    >
      <div class="mx-auto w-12 h-12 rounded-full bg-mist flex items-center justify-center mb-4">
        <Icon name="lucide:package-search" class="w-6 h-6 text-ink/40" />
      </div>
      <p class="text-ink/60 mb-1">Aucune commande ne correspond à ce filtre.</p>
      <button
        v-if="activeFilter"
        @click="setFilter(undefined)"
        class="text-sage hover:underline text-sm"
      >
        Voir toutes les commandes
      </button>
    </div>

    <template v-else-if="!loading">
      <!-- Vue tableau : desktop uniquement -->
      <div class="hidden md:block bg-white rounded-2xl border border-mist overflow-visible">
        <table class="w-full text-sm min-w-[640px]">
          <thead class="bg-mist/50">
            <tr class="text-center">
              <th class="p-4">Client</th>
              <th class="p-4">Articles</th>
              <th class="p-4">Total</th>
              <th class="p-4">Statut</th>
              <th class="p-4">Date</th>
              <th class="p-4">Changer statut</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id" class="border-t border-mist text-center">
              <td class="p-4">
                <button
                  @click="quickViewOrder = order"
                  class="font-medium text-ink hover:text-sage transition-colors"
                >
                  {{ order.user?.firstName }} {{ order.user?.lastName }}
                </button>
              </td>
              <td class="p-4 text-ink/60">{{ order.items.length }} article(s)</td>
              <td class="p-4 price">{{ Number(order.totalPrice).toFixed(2) }} TND</td>
              <td class="p-4"><OrderStatusBadge :status="order.status" /></td>
              <td class="p-4 text-ink/60">{{ new Date(order.createdAt).toLocaleDateString('fr-FR') }}</td>
              <td class="p-4">
                <div class="flex justify-center">
                  <div class="relative w-44">
                    <div
                      class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex items-center"
                      :class="getStatusStyle(order.status).text"
                    >
                      <Icon :name="getStatusStyle(order.status).icon" class="w-4 h-4" />
                    </div>
                    <select
                      :value="order.status"
                      @change="handleStatusChange(order.id, ($event.target as HTMLSelectElement).value)"
                      class="w-full appearance-none rounded-xl border bg-white py-2 pl-9 pr-8 text-xs font-medium shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sage/30"
                      :class="[getStatusStyle(order.status).border, getStatusStyle(order.status).text]"
                    >
                      <option value="CONFIRMED">Confirmée</option>
                      <option value="SHIPPED">Expédiée</option>
                      <option value="DELIVERED">Livrée</option>
                      <option value="CANCELLED">Annulée</option>
                    </select>
                    <div class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Icon name="lucide:chevrons-up-down" class="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Vue cartes : mobile uniquement -->
      <div class="md:hidden flex flex-col gap-3 pb-28">
        <div
          v-for="order in orders"
          :key="order.id"
          class="bg-white rounded-2xl border border-mist p-4"
        >
          <div class="flex justify-between items-start mb-2">
            <button @click="quickViewOrder = order" class="text-left">
              <p class="font-medium hover:text-sage transition-colors">
                {{ order.user?.firstName }} {{ order.user?.lastName }}
              </p>
              <p class="text-ink/60 text-xs">{{ new Date(order.createdAt).toLocaleDateString('fr-FR') }}</p>
            </button>
            <OrderStatusBadge :status="order.status" />
          </div>
          <div class="flex justify-between text-sm mb-3">
            <span class="text-ink/60">{{ order.items.length }} article(s)</span>
            <span class="price">{{ Number(order.totalPrice).toFixed(2) }} TND</span>
          </div>
          <div class="border-t border-mist pt-3">
            <label class="block text-xs text-ink/50 mb-1.5">Changer le statut</label>
            <div class="relative">
              <div
                class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex items-center"
                :class="getStatusStyle(order.status).text"
              >
                <Icon :name="getStatusStyle(order.status).icon" class="w-4 h-4" />
              </div>
              <select
                :value="order.status"
                @change="handleStatusChange(order.id, ($event.target as HTMLSelectElement).value)"
                class="w-full appearance-none rounded-xl border bg-white py-2 pl-9 pr-8 text-xs font-medium shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sage/30"
                :class="[getStatusStyle(order.status).border, getStatusStyle(order.status).text]"
              >
                <option value="CONFIRMED">Confirmée</option>
                <option value="SHIPPED">Expédiée</option>
                <option value="DELIVERED">Livrée</option>
                <option value="CANCELLED">Annulée</option>
              </select>
              <div class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Icon name="lucide:chevrons-up-down" class="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <OrderQuickViewModal
      :order="quickViewOrder"
      @close="quickViewOrder = null"
      @view-product="quickViewProduct = $event"
    />
    <ProductQuickViewModal
      :product="quickViewProduct"
      :is-admin="true"
      @close="quickViewProduct = null"
    />
    <PageLoader :show="loading && orders.length === 0" label="Chargement des commandes..." />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' });

import PageLoader from '~/components/common/PageLoader.vue';
import OrderQuickViewModal from '~/components/order/OrderQuickViewModal.vue';
import ProductQuickViewModal from '~/components/order/ProductQuickView.vue';
import type { Order } from '~/types/order';
import type { Product } from '~/types/product';

const { fetchAllOrders, updateOrderStatus } = useAdminOrders();
const orders = ref<Order[]>([]);
const activeFilter = ref<string | undefined>(undefined);
const quickViewOrder = ref<Order | null>(null);
const quickViewProduct = ref<Product | null>(null);
const statusFilters = [
  { label: 'Toutes', value: undefined },
  { label: 'Confirmées', value: 'CONFIRMED' },
  { label: 'Expédiées', value: 'SHIPPED' },
  { label: 'Livrées', value: 'DELIVERED' },
  { label: 'Annulées', value: 'CANCELLED' },
];
const loading = ref(true);

const statusStyles: Record<string, { icon: string; text: string; border: string }> = {
  PENDING: { icon: 'lucide:clock', text: 'text-amber-700', border: 'border-amber-200' },
  CONFIRMED: { icon: 'lucide:check-circle-2', text: 'text-sky-700', border: 'border-sky-200' },
  SHIPPED: { icon: 'lucide:truck', text: 'text-indigo-700', border: 'border-indigo-200' },
  DELIVERED: { icon: 'lucide:package-check', text: 'text-emerald-700', border: 'border-emerald-200' },
  CANCELLED: { icon: 'lucide:x-circle', text: 'text-clay', border: 'border-clay/30' },
};

const getStatusStyle = (status: string) =>
  statusStyles[status] ?? { icon: 'lucide:circle', text: 'text-ink/50', border: 'border-mist' };

const load = async () => {
  loading.value = true;
  const result = await fetchAllOrders({ status: activeFilter.value });
  orders.value = result.data;
  loading.value = false;
};

const setFilter = (value: string | undefined) => {
  activeFilter.value = value;
  load();
};

const handleStatusChange = async (orderId: string, status: string) => {
  await updateOrderStatus(orderId, status);
  await load();
};

onMounted(load);
</script>