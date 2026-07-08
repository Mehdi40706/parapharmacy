<template>
  <div>
    <h1 class="text-2xl font-semibold mb-6">Commandes</h1>

    <div class="flex gap-2 mb-6">
      <button
        v-for="s in statusFilters"
        :key="s.value"
        @click="setFilter(s.value)"
        class="badge-pill"
        :class="activeFilter === s.value ? 'bg-sage text-white' : 'bg-mist text-ink/70'"
      >
        {{ s.label }}
      </button>
    </div>

    <div class="bg-white rounded-2xl border border-mist overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-mist/50">
          <tr class="text-left">
            <th class="p-4">Client</th>
            <th class="p-4">Articles</th>
            <th class="p-4">Total</th>
            <th class="p-4">Statut</th>
            <th class="p-4">Date</th>
            <th class="p-4"></th>
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