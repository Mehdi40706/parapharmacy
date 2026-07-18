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

    <!-- Vue tableau : desktop uniquement -->
    <div class="hidden md:block bg-white rounded-2xl border border-mist overflow-x-auto">
      <table class="w-full text-sm min-w-[640px]">
        <thead class="bg-mist/50">
          <tr class="text-left">
            <th class="p-4">Client</th>
            <th class="p-4">Articles</th>
            <th class="p-4">Total</th>
            <th class="p-4">Statut</th>
            <th class="p-4">Date</th>
            <th class="p-4">Changer statut</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id" class="border-t border-mist">
            <td class="p-4">{{ (order as any).user?.firstName }} {{ (order as any).user?.lastName }}</td>
            <td class="p-4 text-ink/60">{{ order.items.length }} article(s)</td>
            <td class="p-4 price">{{ order.totalPrice.toFixed(2) }} TND</td>
            <td class="p-4"><OrderStatusBadge :status="order.status" /></td>
            <td class="p-4 text-ink/60">{{ new Date(order.createdAt).toLocaleDateString('fr-FR') }}</td>
            <td class="p-4">
              <select
                :value="order.status"
                @change="handleStatusChange(order.id, ($event.target as HTMLSelectElement).value)"
                class="input-field text-xs py-1"
              >
                <option value="PENDING">En attente</option>
                <option value="CONFIRMED">Confirmée</option>
                <option value="PROCESSING">En préparation</option>
                <option value="SHIPPED">Expédiée</option>
                <option value="DELIVERED">Livrée</option>
                <option value="CANCELLED">Annulée</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Vue cartes : mobile uniquement -->
    <div class="md:hidden flex flex-col gap-3">
      <div
        v-for="order in orders"
        :key="order.id"
        class="bg-white rounded-2xl border border-mist p-4"
      >
        <div class="flex justify-between items-start mb-2">
          <div>
            <p class="font-medium">{{ (order as any).user?.firstName }} {{ (order as any).user?.lastName }}</p>
            <p class="text-ink/60 text-xs">{{ new Date(order.createdAt).toLocaleDateString('fr-FR') }}</p>
          </div>
          <OrderStatusBadge :status="order.status" />
        </div>

        <div class="flex justify-between text-sm mb-3">
          <span class="text-ink/60">{{ order.items.length }} article(s)</span>
          <span class="price">{{ order.totalPrice.toFixed(2) }} TND</span>
        </div>

        <div class="border-t border-mist pt-3">
          <label class="block text-xs text-ink/50 mb-1">Changer le statut</label>
          <select
            :value="order.status"
            @change="handleStatusChange(order.id, ($event.target as HTMLSelectElement).value)"
            class="input-field text-xs py-1.5 w-full"
          >
            <option value="PENDING">En attente</option>
            <option value="CONFIRMED">Confirmée</option>
            <option value="PROCESSING">En préparation</option>
            <option value="SHIPPED">Expédiée</option>
            <option value="DELIVERED">Livrée</option>
            <option value="CANCELLED">Annulée</option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' });

import type { Order } from '~/types/order';

const { fetchAllOrders, updateOrderStatus } = useAdminOrders();

const orders = ref<Order[]>([]);
const activeFilter = ref<string | undefined>(undefined);

const statusFilters = [
  { label: 'Toutes', value: undefined },
  { label: 'En attente', value: 'PENDING' },
  { label: 'Confirmées', value: 'CONFIRMED' },
  { label: 'Expédiées', value: 'SHIPPED' },
  { label: 'Livrées', value: 'DELIVERED' },
  { label: 'Annulées', value: 'CANCELLED' },
];

const load = async () => {
  const result = await fetchAllOrders({ status: activeFilter.value });
  orders.value = result.data;
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