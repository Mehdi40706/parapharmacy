<template>
  <div class="space-y-12 md:space-y-16">
   <!-- Hero Section -->
    <header class="relative overflow-hidden rounded-[2rem] border border-mist bg-gradient-to-br from-sage-dark via-sage to-sage-light p-6 md:p-8 shadow-[0_24px_60px_-24px_rgba(45,74,62,0.45)]">
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.25),_transparent_35%)] pointer-events-none"
      />

      <div class="relative">
        <div class="space-y-8 text-white">
          <span class="inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm">
            Nouveautés • soins naturels • bien-être
          </span>

          <div class="space-y-3">
            <h1 class="font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Votre pharmacie de confort, beauté et équilibre.
            </h1>

            <p class="max-w-xl text-base leading-relaxed text-white/85">
              Découvrez une sélection soignée de produits de parapharmacie, de soins visage et de routines quotidiennes pensées pour votre bien-être.
            </p>
          </div>

          <NuxtLink
            to="/produits"
            class="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 font-medium text-sage transition-all duration-300 hover:bg-mist hover:scale-[1.02]"
          >
            Explorer nos produits
          </NuxtLink>

          <div class="flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-4 text-sm text-white/90">
            <div class="flex items-center gap-2">
              <span class="text-honey">✦</span>
              <span>Livraison rapide</span>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-honey">✦</span>
              <span>Produits sélectionnés</span>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-honey">✦</span>
              <span>Conseils personnalisés</span>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-honey">✦</span>
              <span>Assistant IA 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </header>
    <!-- Featured Products Section -->
    <section class="rounded-[2rem] border border-mist bg-white p-6 md:p-8 shadow-sm">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-mist/60 pb-5">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-sage">Produits phares</p>
          <h2 class="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">Les best-sellers de la semaine</h2>
        </div>
        <NuxtLink
          to="/produits"
          class="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-sage/20 bg-sage px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sage/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-sage-dark hover:shadow-xl hover:shadow-sage/30 active:scale-95 sm:w-auto"
        >
          <span>Explorer la boutique</span>

          <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-1">
            <Icon
              name="lucide:arrow-right"
              class="h-4 w-4"
            />
          </div>
        </NuxtLink>
      </div>

      <!-- Skeletons matches the script limit (6) -->
      <div v-if="isLoading" class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="item in 6" :key="item" class="animate-pulse rounded-[1.5rem] border border-mist bg-mist/20 p-4 space-y-4">
          <div class="h-48 rounded-[1rem] bg-mist/60" />
          <div class="space-y-2">
            <div class="h-4 w-24 rounded bg-mist/60" />
            <div class="h-6 w-5/6 rounded bg-mist/60" />
            <div class="h-4 w-1/2 rounded bg-mist/60" />
          </div>
        </div>
      </div>

      <div v-else-if="featuredProducts.length" class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ProductCard
          v-for="product in featuredProducts"
          :key="product.id"
          :product="product"
          @quick-view="openQuickView"
        />      
      </div>

      <div v-else class="mt-8 rounded-[1.25rem] border border-dashed border-mist bg-mist/20 p-8 text-center text-ink/60">
        Aucun produit disponible pour le moment.
      </div>
    </section>

    <!-- Pourquoi nous choisir -->
    <section class="grid gap-6 md:grid-cols-3">
      <div class="group rounded-[1.75rem] border border-mist bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-sage/20 hover:shadow-xl">
        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-sage/10 text-sage transition-colors group-hover:bg-sage group-hover:text-white">
          <Icon name="lucide:truck" class="h-7 w-7" />
        </div>
        <h3 class="mt-5 font-display text-xl font-semibold text-ink">
          Livraison rapide
        </h3>
        <p class="mt-2 text-sm leading-6 text-ink/60"> Recevez vos produits rapidement partout en Tunisie avec un suivi fiable.</p>
      </div>
      <div class="group rounded-[1.75rem] border border-mist bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-honey/30 hover:shadow-xl" >
        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-honey/15 text-honey transition-colors group-hover:bg-honey group-hover:text-white" >
          <Icon name="lucide:shield-check" class="h-7 w-7" />
        </div>
        <h3 class="mt-5 font-display text-xl font-semibold text-ink">Produits sélectionnés</h3>
        <p class="mt-2 text-sm leading-6 text-ink/60">Une sélection rigoureuse de marques reconnues pour garantir qualité, sécurité et efficacité.</p>
      </div>
      <div class="group rounded-[1.75rem] border border-mist bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-clay/20 hover:shadow-xl">
        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-clay/10 text-clay transition-colors group-hover:bg-clay group-hover:text-white">
          <Icon name="lucide:bot-message-square" class="h-7 w-7" />
        </div>
        <h3 class="mt-5 font-display text-xl font-semibold text-ink">  Assistant IA 24/7 </h3>
        <p class="mt-2 text-sm leading-6 text-ink/60"> Notre chatbot intelligent répond à vos questions, recommande des produits et vous accompagne à tout moment. </p>
      </div>
    </section>
  </div>
  <ProductQuickView
  v-if="selectedProduct"
  :product="selectedProduct"
  @close="closeQuickView"
/>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Category, Product } from '~/types/product';
import { useCategories } from '~/composables/useCategories';
import { useProducts } from '~/composables/useProducts';
import ProductQuickView from '~/components/product/ProductQuickViewModal.vue';
const { fetchCategories } = useCategories();
const { fetchActiveProducts } = useProducts();

const categories = ref<Category[]>([]);
const featuredProducts = ref<Product[]>([]);
const isLoading = ref(true);
const selectedProduct = ref<Product | null>(null);

const openQuickView = (product: Product) => {
  selectedProduct.value = product;
};

const closeQuickView = () => {
  selectedProduct.value = null;
};

const categoryStyles = [
  { bg: 'bg-sage-dark', blob: 'bg-white/10', text: 'text-white' },
  { bg: 'bg-honey', blob: 'bg-white/25', text: 'text-ink' },
  { bg: 'bg-clay/90', blob: 'bg-white/15', text: 'text-white' },
  { bg: 'bg-sage/90', blob: 'bg-white/15', text: 'text-white' },
];
onMounted(async () => {
  try {
    const [categoriesResponse, productsResponse] = await Promise.all([
      fetchCategories(),
      fetchActiveProducts({ limit: 6, page: 1 }),
    ]);

    categories.value = categoriesResponse;
    featuredProducts.value = productsResponse.data;
  } catch (error) {
    console.error('Impossible de charger la page d’accueil', error);
  } finally {
    isLoading.value = false;
  }
});
</script>