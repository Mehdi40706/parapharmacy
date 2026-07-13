<template>
  <div class="space-y-12 md:space-y-16">
    <!-- Hero Section -->
    <header class="relative overflow-hidden rounded-[2rem] border border-mist bg-gradient-to-br from-sage-dark via-sage to-sage-light p-8 shadow-[0_24px_60px_-24px_rgba(45,74,62,0.45)] md:p-10 lg:p-12">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.25),_transparent_35%)]" pointer-events-none />
      
      <div class="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div class="space-y-6 text-white">
          <span class="inline-block badge-pill bg-white/15 text-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium">
            Nouveautés • soins naturels • bien-être
          </span>
          
          <div class="space-y-4">
            <h1 class="text-4xl font-display leading-tight sm:text-5xl lg:text-6xl font-bold">
              Votre pharmacie de confort, beauté et équilibre.
            </h1>
            <p class="max-w-2xl text-lg text-white/85 leading-relaxed">
              Découvrez une sélection soignée de produits de parapharmacie, de soins visage et de routines quotidiennes pensées pour votre bien-être.
            </p>
          </div>

          <div class="flex flex-wrap gap-4 pt-2">
            <NuxtLink to="/produits" class="btn-primary inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-medium text-sage shadow-sm transition-all duration-300 hover:bg-mist hover:scale-[1.02]">
              Explorer nos produits
            </NuxtLink>
            <NuxtLink to="/panier" class="inline-flex items-center justify-center rounded-full border border-white/35 px-6 py-3 font-medium text-white transition-all duration-300 hover:bg-white/10">
              Voir mon panier
            </NuxtLink>
          </div>

          <div class="flex flex-wrap gap-x-6 gap-y-3 pt-4 text-sm text-white/90 border-t border-white/10">
            <div class="flex items-center gap-2">
              <span class="text-base text-honey">✦</span>
              <span>Livraison rapide</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-base text-honey">✦</span>
              <span>Produits sélectionnés</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-base text-honey">✦</span>
              <span>Conseils personnalisés</span>
            </div>
          </div>
        </div>

        <!-- Featured Sidebar Promotion -->
        <aside class="relative w-full max-w-md mx-auto lg:max-w-none">
          <div class="rounded-[1.75rem] border border-white/20 bg-white/10 p-4 backdrop-blur-sm transition-transform duration-500 hover:scale-[1.01]">
            <div class="rounded-[1.25rem] bg-background p-6 shadow-xl">
              <div class="flex items-center justify-between gap-4">
                <div>
                  <p class="text-xs uppercase tracking-[0.25em] font-semibold text-sage">Sélection du mois</p>
                  <h2 class="font-display text-2xl font-bold text-ink mt-0.5">Routine douceur</h2>
                </div>
                <span class="rounded-full bg-honey px-3 py-1 text-sm font-semibold text-ink animate-pulse">
                  -20%
                </span>
              </div>

              <div class="mt-5 space-y-3">
                <div class="rounded-2xl border border-mist bg-white p-4 transition-colors hover:border-sage/30">
                  <div class="flex items-center justify-between gap-4">
                    <div>
                      <p class="font-semibold text-ink">Soin visage calmant</p>
                      <p class="text-sm text-ink/70">Hydratation naturelle</p>
                    </div>
                    <div class="font-display font-bold text-lg text-sage-dark whitespace-nowrap">34,90 TND</div>
                  </div>
                </div>
                <div class="rounded-2xl border border-mist bg-white p-4 transition-colors hover:border-sage/30">
                  <div class="flex items-center justify-between gap-4">
                    <div>
                      <p class="font-semibold text-ink">Gel nettoyant doux</p>
                      <p class="text-sm text-ink/70">Peau sensible</p>
                    </div>
                    <div class="font-display font-bold text-lg text-sage-dark whitespace-nowrap">22,50 TND</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </header>

    

    <!-- Featured Products Section -->
    <section class="rounded-[2rem] border border-mist bg-white p-6 md:p-8 shadow-sm">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-mist/60 pb-5">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-sage">Produits phares</p>
          <h2 class="mt-1 font-display text-3xl font-bold text-ink">Les best-sellers de la semaine</h2>
        </div>
        <NuxtLink to="/produits" class="text-sm font-semibold text-sage inline-flex items-center gap-1 transition-colors hover:text-sage-dark group">
          Explorer la boutique
          <span class="transition-transform group-hover:translate-x-1">→</span>
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
        <ProductCard v-for="product in featuredProducts" :key="product.id" :product="product" />
      </div>

      <div v-else class="mt-8 rounded-[1.25rem] border border-dashed border-mist bg-mist/20 p-8 text-center text-ink/60">
        Aucun produit disponible pour le moment.
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Category, Product } from '~/types/product';
import { useCategories } from '~/composables/useCategories';
import { useProducts } from '~/composables/useProducts';

const { fetchCategories } = useCategories();
const { fetchActiveProducts } = useProducts();

const categories = ref<Category[]>([]);
const featuredProducts = ref<Product[]>([]);
const isLoading = ref(true);

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