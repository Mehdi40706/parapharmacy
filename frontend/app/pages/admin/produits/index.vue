<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Produits</h1>
      <NuxtLink to="/admin/produits/nouveau" class="btn-primary">+ Nouveau produit</NuxtLink>
    </div>

    <div class="bg-white rounded-2xl border border-mist overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-mist/50">
          <tr class="text-left">
            <th class="p-4">Nom</th>
            <th class="p-4">Catégorie</th>
            <th class="p-4">Prix</th>
            <th class="p-4">Stock</th>
            <th class="p-4">Statut</th>
            <th class="p-4"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id" class="border-t border-mist">
            <td class="p-4 font-medium">{{ product.name }}</td>
            <td class="p-4 text-ink/60">{{ product.category.name }}</td>
            <td class="p-4 price">{{ product.price.toFixed(2) }} TND</td>
            <td class="p-4">
              <span :class="product.stock === 0 ? 'text-clay' : 'text-ink/70'">
                {{ product.stock }}
              </span>
            </td>
            <td class="p-4">
              <span v-if="!product.isActive" class="badge-pill bg-clay/10 text-clay text-xs">
                Archivé
              </span>
              <span v-else class="badge-pill bg-sage/10 text-sage-dark text-xs">
                Actif
              </span>
            </td>
            <td class="p-4 text-right">
              <NuxtLink :to="`/admin/produits/${product.id}/edit`" class="text-sage hover:underline mr-3">
                Modifier
              </NuxtLink>
              <button @click="handleDelete(product.id)" class="text-clay hover:underline mr-3">
                Supprimer
              </button>
              <button
                v-if="product.isActive"
                @click="handleArchive(product.id)"
                class="text-clay hover:underline"
              >
                Archiver
              </button>
              <button v-else @click="handleRestore(product.id)" class="text-sage hover:underline">
                Réactiver
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="pagination && pagination.totalPages > 1" class="flex justify-center gap-2 mt-6">
      <button
        v-for="page in pagination.totalPages"
        :key="page"
        @click="goToPage(page)"
        class="w-9 h-9 rounded-pill text-sm font-medium"
        :class="page === currentPage ? 'bg-sage text-white' : 'hover:bg-mist'"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' });

import type { Product } from '~/types/product';

const { fetchAllProducts } = useProducts();
const { deleteProduct, archiveProduct, restoreProduct } = useAdminProducts();

const products = ref<Product[]>([]);
const pagination = ref<any>(null);
const currentPage = ref(1);

const load = async () => {
  const result = await fetchAllProducts({ page: currentPage.value, limit: 10 });
  products.value = result.data;
  pagination.value = result.meta;
};

const goToPage = (page: number) => {
  currentPage.value = page;
  load();
};

const handleDelete = async (id: string) => {
  if (!confirm('Supprimer ce produit ?')) return;
  await deleteProduct(id);
  await load();
};

const handleArchive = async (id: string) => {
  await archiveProduct(id);
  await load();
};

const handleRestore = async (id: string) => {
  await restoreProduct(id);
  await load();
};

onMounted(load);
</script>