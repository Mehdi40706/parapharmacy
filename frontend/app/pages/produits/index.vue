<template>
  <div>
   <!-- Barre de recherche + bouton filtres + toggle vue -->
    <div class="flex flex-col sm:flex-row gap-3 mb-4">
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
      <!-- Toggle vue + Filtres regroupés sur une ligne (mobile et desktop) -->
      <div class="flex gap-3">
        <div class="flex flex-1 sm:flex-initial items-center gap-1 rounded-full border border-mist bg-white p-1 shadow-sm">
          <button
            @click="viewMode = 'grid'"
            class="flex flex-1 sm:flex-initial sm:w-9 h-9 items-center justify-center rounded-full transition-all duration-200"
            :class="
              viewMode === 'grid'
                ? 'bg-sage text-white shadow-md'
                : 'text-ink/50 hover:bg-sage/10 hover:text-sage'
            "
            aria-label="Vue grille"
          >
            <Icon name="lucide:grid-2x2" class="h-4 w-4" />
          </button>
          <button
            @click="viewMode = 'carousel'"
            class="flex flex-1 sm:flex-initial sm:w-9 h-9 items-center justify-center rounded-full transition-all duration-200"
            :class="
              viewMode === 'carousel'
                ? 'bg-sage text-white shadow-md'
                : 'text-ink/50 hover:bg-sage/10 hover:text-sage'
            "
            aria-label="Vue carrousel"
          >
            <Icon name="lucide:gallery-horizontal" class="h-4 w-4" />
          </button>
        </div>
        <button
          @click="filtersOpen = true"
          class="btn-secondary flex flex-1 sm:flex-initial items-center justify-center gap-2 whitespace-nowrap relative"
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
    </div>
    <!-- Barre de catégories horizontale -->
    <div class="flex gap-2 overflow-x-auto pb-2 mb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <button
        @click="selectCategory('')"
        class="shrink-0 px-4 py-2 rounded-pill text-sm font-medium whitespace-nowrap transition-colors border"
        :class="!activeCategoryId ? 'bg-sage text-white border-sage' : 'bg-white border-mist text-ink/70 hover:border-sage'"
      >
        Tout
      </button>
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="selectCategory(cat.id)"
        class="shrink-0 px-4 py-2 rounded-pill text-sm font-medium whitespace-nowrap transition-colors border"
        :class="activeCategoryId === cat.id ? 'bg-sage text-white border-sage' : 'bg-white border-mist text-ink/70 hover:border-sage'"
      >
        {{ cat.name }}
      </button>
    </div>
    <!-- Loading (grille) -->
    <div v-if="viewMode === 'grid' && loading" class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4">
      <div v-for="n in 8" :key="n" class="aspect-[3/4] bg-mist rounded-2xl animate-pulse" />
    </div>
    <div v-else-if="viewMode === 'grid' && products.length === 0" class="text-center py-20">
      <p class="text-ink/60 mb-4">Aucun produit ne correspond à votre recherche.</p>
      <button v-if="activeFilterCount > 0" @click="resetFilters" class="text-sage hover:underline text-sm">
        Réinitialiser les filtres
      </button>
    </div>

    <!-- Vue grille -->
    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        @quick-view="selectedProduct = $event"
      />
    </div>
    <!-- Vue carrousel : un carrousel par catégorie -->
    <div v-else class="flex flex-col gap-10">
      <section
        v-for="cat in categories"
        :key="cat.id"
        :ref="(el) => (categorySectionRefs[cat.id] = el as HTMLElement)"
        v-show="!activeCategoryId || activeCategoryId === cat.id"
      >
        <h2 class="font-display font-semibold text-lg mb-3">{{ cat.name }}</h2>
        <div v-if="categoryLoading[cat.id]" class="flex gap-4 overflow-hidden">
          <div v-for="n in 4" :key="n" class="aspect-[3/4] w-[45%] sm:w-[32%] lg:w-[23%] shrink-0 bg-mist rounded-2xl animate-pulse" />
        </div>
        <div v-else-if="(categoryProducts[cat.id]?.length ?? 0) === 0" class="text-ink/50 text-sm py-6">
          Aucun produit dans cette catégorie.
        </div>
        <div v-else class="relative group">
          <button
            v-if="scrollState[cat.id]?.left"
            @click="scrollCategoryCarousel(cat.id, -1)"
            class="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md items-center justify-center hover:scale-105 transition-transform"
            aria-label="Précédent"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        <div
              :ref="(el) => (carouselRefs[cat.id] = el as HTMLElement)"
              class="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 -mx-1 px-1 cursor-grab [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              @scroll="updateCategoryScrollButtons(cat.id)"
              @wheel.passive="handleWheelScroll(cat.id, $event)"
              @mousedown="handleMouseDown(cat.id, $event)"
              @mouseleave="handleMouseUpOrLeave"
            >
            <div
              v-for="product in categoryProducts[cat.id]"
              :key="product.id"
              class="snap-start shrink-0 w-[45%] sm:w-[32%] lg:w-[23%]"
            >
              <ProductCard :product="product" @quick-view="selectedProduct = $event" />
            </div>
          </div>
          <button
            v-if="scrollState[cat.id]?.right"
            @click="scrollCategoryCarousel(cat.id, 1)"
            class="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md items-center justify-center hover:scale-105 transition-transform"
            aria-label="Suivant"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>
    </div>
    <!-- Pagination (grille uniquement) -->
    <div v-if="viewMode === 'grid' && pagination && pagination.totalPages > 1" class="flex justify-center gap-2 mt-8">
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

// Vue grille / carrousel
const viewMode = ref<'grid' | 'carousel'>('grid');

// Barre de catégories (active dans les deux modes)
const activeCategoryId = ref('');

// --- Mode carrousel : un carrousel indépendant par catégorie ---
const categoryProducts = reactive<Record<string, Product[]>>({});
const categoryLoading = reactive<Record<string, boolean>>({});
const carouselRefs = reactive<Record<string, HTMLElement | null>>({});
const categorySectionRefs = reactive<Record<string, HTMLElement | null>>({});
const scrollState = reactive<Record<string, { left: boolean; right: boolean }>>({});

const fetchCategoryProducts = async (categoryId: string) => {
  categoryLoading[categoryId] = true;
  try {
    const result = await fetchActiveProducts({
      categoryId,
      sortBy: filters.sortBy,
      page: 1,
      limit: 12,
    });
    categoryProducts[categoryId] = result.data;
  } finally {
    categoryLoading[categoryId] = false;
    await nextTick();
    updateCategoryScrollButtons(categoryId);
  }
};

const loadAllCategoryCarousels = () => {
  categories.value.forEach((cat) => {
    if (!categoryProducts[cat.id]) fetchCategoryProducts(cat.id);
  });
};

const updateCategoryScrollButtons = (categoryId: string) => {
  const el = carouselRefs[categoryId];
  if (!el) return;
  scrollState[categoryId] = {
    left: el.scrollLeft > 4,
    right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
  };
};

const scrollCategoryCarousel = (categoryId: string, direction: 1 | -1) => {
  const el = carouselRefs[categoryId];
  if (!el) return;
  const cardWidth = el.firstElementChild?.clientWidth ?? 300;
  el.scrollBy({ left: direction * (cardWidth + 16) * 2, behavior: 'smooth' });
};

watch(viewMode, (mode) => {
  if (mode === 'carousel') loadAllCategoryCarousels();
});

// Sélection de catégorie depuis la barre horizontale
const selectCategory = (categoryId: string) => {
  activeCategoryId.value = categoryId;

  if (viewMode.value === 'grid') {
    filters.categoryId = categoryId;
    filters.page = 1;
    fetchData();
  } else if (categoryId) {
    nextTick(() => {
      categorySectionRefs[categoryId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }
};

const handleWheelScroll = (categoryId: string, event: WheelEvent) => {
  const el = carouselRefs[categoryId];
  if (!el) return;

  // Si l'utilisateur fait défiler principalement horizontalement (trackpad), on laisse faire le navigateur
  if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

  // On applique le mouvement vertical de la molette au défilement horizontal du carrousel
  el.scrollLeft += event.deltaY;
};

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
  // garde la barre de catégories synchronisée avec le filtre du drawer
  activeCategoryId.value = filters.categoryId;
  fetchData();
};

const resetFilters = () => {
  filters.categoryId = '';
  filters.minPrice = undefined;
  filters.maxPrice = undefined;
  filters.sortBy = 'createdAt';
  filters.page = 1;
  filtersOpen.value = false;
  activeCategoryId.value = '';
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

// --- Drag-to-scroll State ---
let isDown = false;
let startX = 0;
let scrollLeft = 0;
let activeDragCatId = '';

const handleMouseDown = (categoryId: string, e: MouseEvent) => {
  const el = carouselRefs[categoryId];
  if (!el) return;
  
  isDown = true;
  activeDragCatId = categoryId;
  
  // Change cursor to grabbing and disable text selection while dragging
  el.style.cursor = 'grabbing';
  el.style.userSelect = 'none';
  el.style.scrollBehavior = 'auto'; // Disable smooth scroll during manual drag for instantaneous response
  
  startX = e.pageX - el.offsetLeft;
  scrollLeft = el.scrollLeft;
};

const handleMouseMove = (e: MouseEvent) => {
  if (!isDown || !activeDragCatId) return;
  
  const el = carouselRefs[activeDragCatId];
  if (!el) return;
  
  e.preventDefault();
  const x = e.pageX - el.offsetLeft;
  const walk = (x - startX) * 1.5; // The multiplier alters scroll speed (1.5 is standard)
  el.scrollLeft = scrollLeft - walk;
};

const handleMouseUpOrLeave = () => {
  if (!isDown || !activeDragCatId) return;
  
  const el = carouselRefs[activeDragCatId];
  if (el) {
    el.style.cursor = 'grab';
    el.style.userSelect = '';
    el.style.scrollBehavior = 'smooth'; // Restore smooth scroll for button clicks
  }
  
  isDown = false;
  activeDragCatId = '';
};

// Global event listeners to handle mouse release even if it happens outside the carousel
onMounted(async () => {
  categories.value = await fetchCategories();
  await fetchData();
  
  if (import.meta.client) {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUpOrLeave);
  }
});

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUpOrLeave);
  }
});
</script>