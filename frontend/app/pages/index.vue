<template>
  <div class="space-y-8">
    <section class="relative overflow-hidden rounded-[2rem] border border-mist bg-gradient-to-br from-sage-dark via-sage to-sage-light p-8 shadow-[0_24px_60px_-24px_rgba(45,74,62,0.45)] md:p-10 lg:p-12">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.25),_transparent_35%)]" />
      <div class="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div class="space-y-6 text-white">
          <span class="badge-pill bg-white/15 text-white/90 backdrop-blur-sm">Nouveautés • soins naturels • bien-être</span>
          <div class="space-y-3">
            <h1 class="text-4xl font-display leading-tight sm:text-5xl lg:text-6xl">
              Votre pharmacie de confort, beauté et équilibre.
            </h1>
            <p class="max-w-2xl text-lg text-white/85">
              Découvrez une sélection soignée de produits de parapharmacie, de soins visage et de routines quotidiennes pensées pour votre bien-être.
            </p>
          </div>

          <div class="flex flex-wrap gap-3">
            <NuxtLink to="/produits" class="btn-primary bg-white text-sage hover:bg-mist">
              Explorer nos produits
            </NuxtLink>
            <NuxtLink to="/panier" class="rounded-pill border border-white/35 px-6 py-2.5 font-medium text-white transition-colors hover:bg-white/10">
              Voir mon panier
            </NuxtLink>
          </div>

          <div class="flex flex-wrap gap-6 text-sm text-white/85">
            <div class="flex items-center gap-2">
              <span class="text-base">✦</span>
              <span>Livraison rapide</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-base">✦</span>
              <span>Produits sélectionnés</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-base">✦</span>
              <span>Conseils personnalisés</span>
            </div>
          </div>
        </div>

        <div class="relative">
          <div class="rounded-[1.75rem] border border-white/20 bg-white/10 p-4 backdrop-blur-sm">
            <div class="rounded-[1.25rem] bg-background p-5 shadow-xl">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-xs uppercase tracking-[0.25em] text-sage">Sélection du mois</p>
                  <h2 class="font-display text-2xl text-ink">Routine douceur</h2>
                </div>
                <span class="rounded-pill bg-honey px-3 py-1 text-sm font-medium text-ink">-20%</span>
              </div>

              <div class="mt-5 space-y-3">
                <div class="rounded-2xl border border-mist bg-white p-4">
                  <div class="flex items-center justify-between gap-4">
                    <div>
                      <p class="font-semibold text-ink">Soin visage calmant</p>
                      <p class="text-sm text-ink/70">Hydratation naturelle</p>
                    </div>
                    <div class="price text-lg">34,90 TND</div>
                  </div>
                </div>
                <div class="rounded-2xl border border-mist bg-white p-4">
                  <div class="flex items-center justify-between gap-4">
                    <div>
                      <p class="font-semibold text-ink">Gel nettoyant doux</p>
                      <p class="text-sm text-ink/70">Peau sensible</p>
                    </div>
                    <div class="price text-lg">22,50 TND</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="grid gap-4 md:grid-cols-3">
      <div class="rounded-[1.5rem] border border-mist bg-white p-5 shadow-sm">
        <p class="text-sm font-semibold text-sage">Qualité certifiée</p>
        <h3 class="mt-2 font-display text-xl text-ink">Des produits choisis avec soin</h3>
        <p class="mt-2 text-sm text-ink/70">Une sélection pensée pour allier efficacité, naturel et confort d’usage.</p>
      </div>
      <div class="rounded-[1.5rem] border border-mist bg-white p-5 shadow-sm">
        <p class="text-sm font-semibold text-sage">Conseils experts</p>
        <h3 class="mt-2 font-display text-xl text-ink">Des recommandations adaptées</h3>
        <p class="mt-2 text-sm text-ink/70">Trouvez rapidement les soins qui correspondent à votre routine et vos besoins.</p>
      </div>
      <div class="rounded-[1.5rem] border border-mist bg-white p-5 shadow-sm">
        <p class="text-sm font-semibold text-sage">Expérience simplifiée</p>
        <h3 class="mt-2 font-display text-xl text-ink">Commande en quelques clics</h3>
        <p class="mt-2 text-sm text-ink/70">Ajoutez vos produits au panier, passez votre commande et profitez du suivi.</p>
      </div>
    </section>

    <section v-if="categories.length" class="rounded-[2rem] border border-mist bg-white p-6 md:p-8">
      <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-sage">Catégories</p>
          <h2 class="mt-1 font-display text-3xl text-ink">Parcourez nos univers</h2>
        </div>
        <NuxtLink to="/produits" class="text-sm font-medium text-sage transition-colors hover:text-sage-dark">
          Voir tous les produits
        </NuxtLink>
      </div>

      <div class="mt-6 grid gap-4 md:grid-cols-3">
        <NuxtLink
          v-for="category in categories.slice(0, 6)"
          :key="category.id"
          :to="{ path: '/produits', query: { category: category.slug } }"
          class="group rounded-[1.25rem] border border-mist bg-mist/40 p-5 transition-all hover:-translate-y-1 hover:shadow-md"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="font-semibold text-ink">{{ category.name }}</p>
              <p class="mt-1 text-sm text-ink/70">Découvrez la sélection dédiée</p>
            </div>
            <span class="text-2xl text-sage transition-transform group-hover:translate-x-1">→</span>
          </div>
        </NuxtLink>
      </div>
    </section>

    <section class="rounded-[2rem] border border-mist bg-white p-6 md:p-8">
      <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-sage">Produits phares</p>
          <h2 class="mt-1 font-display text-3xl text-ink">Les best-sellers de la semaine</h2>
        </div>
        <NuxtLink to="/produits" class="text-sm font-medium text-sage transition-colors hover:text-sage-dark">
          Explorer la boutique
        </NuxtLink>
      </div>

      <div v-if="isLoading" class="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <div v-for="item in 3" :key="item" class="animate-pulse rounded-[1.5rem] border border-mist bg-mist/40 p-4">
          <div class="h-40 rounded-[1rem] bg-white/70" />
          <div class="mt-4 h-4 w-24 rounded bg-white/70" />
          <div class="mt-3 h-6 w-3/4 rounded bg-white/70" />
          <div class="mt-3 h-4 w-1/2 rounded bg-white/70" />
        </div>
      </div>

      <div v-else-if="featuredProducts.length" class="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <ProductCard v-for="product in featuredProducts" :key="product.id" :product="product" />
      </div>

      <div v-else class="mt-6 rounded-[1.25rem] border border-dashed border-mist bg-mist/30 p-6 text-center text-ink/70">
        Aucun produit disponible pour le moment.
      </div>
    </section>

    <section class="rounded-[2rem] border border-mist bg-sage/5 p-6 md:p-8">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-sage">Une expérience simple</p>
          <h2 class="mt-1 font-display text-3xl text-ink">Faites de votre quotidien un moment de douceur</h2>
        </div>
        <NuxtLink to="/produits" class="btn-primary">
          Découvrir la collection
        </NuxtLink>
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
const { fetchProducts } = useProducts();

const categories = ref<Category[]>([]);
const featuredProducts = ref<Product[]>([]);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const [categoriesResponse, productsResponse] = await Promise.all([
      fetchCategories(),
      fetchProducts({ limit: 6, page: 1 }),
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