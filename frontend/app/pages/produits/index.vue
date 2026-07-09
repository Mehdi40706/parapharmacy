<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-semibold mb-2">Nos produits</h1>
      <p class="text-ink/60">{{ pagination?.total || 0 }} produits disponibles</p>
    </div>
    
    <div class="flex flex-col lg:flex-row gap-6">
        <!-- Filtres -->
      <aside class="lg:w-64 flex-shrink-0">
        <div class="bg-white rounded-2xl border border-mist p-5 lg:sticky lg:top-24">
          <h2 class="font-medium mb-4">Filtrer</h2>

          <div class="mb-5">
            <label class="block text-sm font-medium mb-2">Recherche</label>
            <input
              v-model="filters.search"
              type="text"
              placeholder="Rechercher un produit..."
              class="input-field text-sm"
              @input="debouncedFetch"
            />
          </div>

          <div class="mb-5">
            <label class="block text-sm font-medium mb-2">Catégorie</label>
            <select v-model="filters.categoryId" @change="fetchData" class="input-field text-sm">
              <option value="">Toutes</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <div class="mb-5">
            <label class="block text-sm font-medium mb-2">Trier par</label>
            <select v-model="filters.sortBy" @change="fetchData" class="input-field text-sm">
              <option value="createdAt">Plus récents</option>
              <option value="price">Prix</option>
              <option value="name">Nom</option>
            </select>
          </div>

          <button @click="resetFilters" class="text-sm text-sage hover:underline">
            Réinitialiser les filtres
          </button>
        </div>
      </aside>

      <!-- Grille produits -->
      <div class="flex-1">
        <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          <div v-for="n in 8" :key="n" class="aspect-[3/4] bg-mist rounded-2xl animate-pulse"></div>
        </div>

        <div v-else-if="products.length === 0" class="text-center py-20">
          <p class="text-ink/60">Aucun produit ne correspond à votre recherche.</p>
        </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          @quick-view="selectedProduct = $event"
        />
      </div>

        <!-- Pagination -->
        <div v-if="pagination && pagination.totalPages > 1" class="flex justify-center gap-2 mt-8">
          <button
            v-for="page in pagination.totalPages"
            :key="page"
            @click="goToPage(page)"
            class="w-9 h-9 rounded-pill text-sm font-medium transition-colors"
            :class="page === filters.page ? 'bg-sage text-white' : 'hover:bg-mist'"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </div>
      <ProductQuickViewModal :product="selectedProduct" @close="selectedProduct = null" />
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core';
import type { Product, Category, PaginatedResponse } from '~/types/product';
import ProductCard from '~/components/product/ProductCard.vue';
import { useProducts } from '~/composables/useProducts';
import { useCategories } from '~/composables/useCategories';

const { fetchProducts } = useProducts();
const { fetchCategories } = useCategories();

const products = ref<Product[]>([]);
const categories = ref<Category[]>([]);
const pagination = ref<PaginatedResponse<Product>['meta'] | null>(null);
const loading = ref(true);

const filters = reactive({
  search: '',
  categoryId: '',
  sortBy: 'createdAt' as 'createdAt' | 'price' | 'name',
  page: 1,
  limit: 12,
});

const fetchData = async () => {
  loading.value = true;
  try {
    const result = await fetchProducts({
      search: filters.search || undefined,
      categoryId: filters.categoryId || undefined,
      sortBy: filters.sortBy,
      page: filters.page,
      limit: filters.limit,
    });
    products.value = result.data;
    pagination.value = result.meta;
  } finally {
    loading.value = false;
  }
};

const debouncedFetch = useDebounceFn(() => {
  filters.page = 1;
  fetchData();
}, 400);

const goToPage = (page: number) => {
  filters.page = page;
  fetchData();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const resetFilters = () => {
  filters.search = '';
  filters.categoryId = '';
  filters.sortBy = 'createdAt';
  filters.page = 1;
  fetchData();
};

onMounted(async () => {
  categories.value = await fetchCategories();
  await fetchData();
});
const selectedProduct = ref<Product | null>(null);

</script>