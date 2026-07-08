<template>
  <div class="space-y-6">
    <section class="rounded-[2rem] border border-mist bg-white p-5 shadow-sm sm:p-6 lg:p-7">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.25em] text-sage">Vue d’ensemble</p>
          <h1 class="mt-2 text-2xl font-semibold text-ink sm:text-3xl">Dashboard</h1>
          <p class="mt-2 max-w-2xl text-sm text-ink/70">
            Gérez votre boutique d’un seul regard avec une vue claire sur les produits, les commandes et les utilisateurs.
          </p>
        </div>
        <div class="rounded-full bg-sage/10 px-4 py-2 text-sm font-medium text-sage">
          Mise à jour en temps réel
        </div>
      </div>

      <div class="mt-6 grid gap-4 xl:grid-cols-3">
        <div class="rounded-[1.5rem] border border-mist bg-gradient-to-br from-sage/10 to-white p-5">
          <p class="text-sm text-ink/60">Produits</p>
          <p class="mt-3 text-3xl font-semibold text-sage-dark">{{ stats.products }}</p>
          <p class="mt-2 text-sm text-ink/60">Articles disponibles en boutique</p>
        </div>
        <div class="rounded-[1.5rem] border border-mist bg-gradient-to-br from-honey/20 to-white p-5">
          <p class="text-sm text-ink/60">Commandes</p>
          <p class="mt-3 text-3xl font-semibold text-sage-dark">{{ stats.orders }}</p>
          <p class="mt-2 text-sm text-ink/60">Total des commandes enregistrées</p>
        </div>
        <div class="rounded-[1.5rem] border border-mist bg-gradient-to-br from-clay/10 to-white p-5">
          <p class="text-sm text-ink/60">Utilisateurs</p>
          <p class="mt-3 text-3xl font-semibold text-sage-dark">{{ stats.users }}</p>
          <p class="mt-2 text-sm text-ink/60">Comptes actifs dans la plateforme</p>
        </div>
      </div>
    </section>

    <section class="rounded-[2rem] border border-mist bg-white p-5 shadow-sm sm:p-6">
      <div class="mb-4 flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold text-ink">Commandes récentes</h2>
          <p class="text-sm text-ink/60">Suivez rapidement les dernières activités</p>
        </div>
      </div>

      <div v-if="recentOrders.length === 0" class="rounded-[1.25rem] border border-dashed border-mist bg-mist/30 p-6 text-sm text-ink/60">
        Aucune commande pour l'instant.
      </div>

      <div v-else class="hidden overflow-x-auto lg:block">
        <table class="w-full min-w-[640px] text-sm">
          <thead>
            <tr class="border-b border-mist text-left text-ink/50">
              <th class="pb-3">Client</th>
              <th class="pb-3">Total</th>
              <th class="pb-3">Statut</th>
              <th class="pb-3">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in recentOrders" :key="order.id" class="border-b border-mist last:border-0">
              <td class="py-3">{{ order.user?.firstName }} {{ order.user?.lastName }}</td>
              <td class="py-3 price">{{ Number(order.totalPrice ?? 0).toFixed(2) }} TND</td>
              <td class="py-3">
                <OrderStatusBadge :status="order.status" />
              </td>
              <td class="py-3 text-ink/60">{{ new Date(order.createdAt).toLocaleDateString('fr-FR') }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="recentOrders.length" class="space-y-3 lg:hidden">
        <div v-for="order in recentOrders" :key="order.id" class="rounded-[1.25rem] border border-mist bg-mist/20 p-4">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="font-semibold text-ink">{{ order.user?.firstName }} {{ order.user?.lastName }}</p>
              <p class="mt-1 text-sm text-ink/60">{{ new Date(order.createdAt).toLocaleDateString('fr-FR') }}</p>
            </div>
            <OrderStatusBadge :status="order.status" />
          </div>
          <div class="mt-3 flex items-center justify-between text-sm">
            <span class="text-ink/60">Montant</span>
            <span class="price">{{ Number(order.totalPrice ?? 0).toFixed(2) }} TND</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' });

const { fetchProducts } = useProducts();
const { fetchAllOrders } = useAdminOrders();
const { fetchUsers } = useAdminUsers();

const stats = reactive({ products: 0, orders: 0, users: 0 });
const recentOrders = ref<any[]>([]);

onMounted(async () => {
  const [productsRes, ordersRes, usersRes] = await Promise.all([
    fetchProducts({ limit: 1 }),
    fetchAllOrders({ limit: 5 }),
    fetchUsers({ limit: 1 }),
  ]);

  stats.products = productsRes.meta.total;
  stats.orders = ordersRes.meta.total;
  stats.users = usersRes.meta.total;
  recentOrders.value = ordersRes.data;
});
</script>