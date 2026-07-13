<template>
  <div>
    <!-- Barre de recherche + bouton filtres -->
    <div class="flex flex-col sm:flex-row gap-3 mb-6">
      <div class="relative flex-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          v-model="filters.search"
          type="text"
          placeholder="Rechercher un produit, une marque..."
          class="input-field pl-11"
          @input="debouncedFetch"
        />
        <button
          v-if="filters.search"
          @click="filters.search = ''; debouncedFetch()"
          class="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <button
        @click="filtersOpen = true"
        class="btn-secondary flex items-center justify-center gap-2 whitespace-nowrap relative"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
        </svg>
        Filtres
        <span
          v-if="activeFilterCount > 0"
          class="bg-sage text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
        >
          {{ activeFilterCount }}
        </span>
      </button>
    </div>
    <!-- Grille produits (pleine largeur maintenant) -->
    <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      <div v-for="n in 8" :key="n" class="aspect-[3/4] bg-mist rounded-2xl animate-pulse" />
    </div>

    <div v-else-if="products.length === 0" class="text-center py-20">
      <p class="text-ink/60 mb-4">Aucun produit ne correspond à votre recherche.</p>
      <button v-if="activeFilterCount > 0" @click="resetFilters" class="text-sage hover:underline text-sm">
        Réinitialiser les filtres
      </button>
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

    <!-- Drawer Filtres -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="filtersOpen"
          class="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
          @click.self="filtersOpen = false"
        >
          <Transition
            enter-active-class="transition duration-250 ease-out"
            enter-from-class="translate-x-full"
            enter-to-class="translate-x-0"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="translate-x-0"
            leave-to-class="translate-x-full"
          >
            <aside
              v-if="filtersOpen"
              class="absolute right-0 top-0 h-full w-full max-w-sm bg-background shadow-xl flex flex-col"
            >
              <div class="flex items-center justify-between p-5 border-b border-mist">
                <h2 class="font-display font-semibold text-lg">Filtrer les produits</h2>
                <button @click="filtersOpen = false" class="w-9 h-9 rounded-full flex items-center justify-center hover:bg-mist transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div class="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
                <div>
                  <label class="block text-sm font-medium mb-2">Catégorie</label>
                  <select v-model="filters.categoryId" class="input-field text-sm">
                    <option value="">Toutes les catégories</option>
                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                      {{ cat.name }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium mb-2">Fourchette de prix (TND)</label>
                  <div class="flex items-center gap-3">
                    <input
                      v-model.number="filters.minPrice"
                      type="number"
                      min="0"
                      placeholder="Min"
                      class="input-field text-sm"
                    />
                    <span class="text-ink/40">—</span>
                    <input
                      v-model.number="filters.maxPrice"
                      type="number"
                      min="0"
                      placeholder="Max"
                      class="input-field text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium mb-2">Trier par</label>
                  <div class="flex flex-col gap-2">
                    <button
                      v-for="opt in sortOptions"
                      :key="opt.value"
                      @click="filters.sortBy = opt.value"
                      class="text-left px-4 py-2.5 rounded-xl text-sm transition-colors"
                      :class="filters.sortBy === opt.value ? 'bg-sage text-white' : 'bg-white border border-mist hover:border-sage'"
                    >
                      {{ opt.label }}
                    </button>
                  </div>
                </div>
              </div>

              <div class="p-5 border-t border-mist flex gap-3">
                <button @click="resetFilters" class="btn-secondary flex-1">
                  Réinitialiser
                </button>
                <button @click="applyFilters" class="btn-primary flex-1">
                  Voir les résultats
                </button>
              </div>
            </aside>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <ProductQuickViewModal :product="selectedProduct" @close="selectedProduct = null" />
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core';
import type { Product, Category, PaginatedResponse } from '~/types/product';

const { fetchActiveProducts } = useProducts();
const { fetchCategories } = useCategories();

const products = ref<Product[]>([]);
const categories = ref<Category[]>([]);
const pagination = ref<PaginatedResponse<Product>['meta'] | null>(null);
const loading = ref(true);
const filtersOpen = ref(false);
const selectedProduct = ref<Product | null>(null);

const sortOptions = [
  { label: 'Plus récents', value: 'createdAt' },
  { label: 'Prix croissant', value: 'price' },
  { label: 'Nom (A-Z)', value: 'name' },
] as const;

const filters = reactive({
  search: '',
  categoryId: '',
  minPrice: undefined as number | undefined,
  maxPrice: undefined as number | undefined,
  sortBy: 'createdAt' as 'createdAt' | 'price' | 'name',
  page: 1,
  limit: 12,
});

const activeFilterCount = computed(() => {
  let count = 0;
  if (filters.categoryId) count++;
  if (filters.minPrice !== undefined) count++;
  if (filters.maxPrice !== undefined) count++;
  if (filters.sortBy !== 'createdAt') count++;
  return count;
});

const fetchData = async () => {
  loading.value = true;
  try {
    const result = await fetchActiveProducts({
      search: filters.search || undefined,
      categoryId: filters.categoryId || undefined,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
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

const applyFilters = () => {
  filters.page = 1;
  filtersOpen.value = false;
  fetchData();
};

const resetFilters = () => {
  filters.categoryId = '';
  filters.minPrice = undefined;
  filters.maxPrice = undefined;
  filters.sortBy = 'createdAt';
  filters.page = 1;
  filtersOpen.value = false;
  fetchData();
};

// Empêche le scroll du body quand le drawer est ouvert
watch(filtersOpen, (open) => {
  if (import.meta.client) {
    document.body.style.overflow = open ? 'hidden' : '';
  }
});

onMounted(async () => {
  categories.value = await fetchCategories();
  await fetchData();
});
</script>