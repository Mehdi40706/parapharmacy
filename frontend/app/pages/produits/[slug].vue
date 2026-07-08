<template>
  <div v-if="product">
    <div class="grid md:grid-cols-2 gap-8 lg:gap-12">
      <!-- Image -->
      <div class="aspect-square bg-mist rounded-2xl overflow-hidden">
        <img
          v-if="product.imageUrl"
          :src="product.imageUrl"
          :alt="product.name"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full flex items-center justify-center text-ink/20">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76ZM16 8l-6 6" />
          </svg>
        </div>
      </div>

      <!-- Infos -->
      <div>
        <span class="badge-pill bg-mist text-sage-dark mb-3">{{ product.category.name }}</span>
        <h1 class="text-2xl sm:text-3xl font-semibold mb-3">{{ product.name }}</h1>
<p class="price text-2xl mb-5">{{ Number(product.price).toFixed(2) }} TND</p>
        <p class="text-ink/70 leading-relaxed mb-6">{{ product.description }}</p>

        <div class="mb-6">
          <span
            v-if="product.stock > 5"
            class="badge-pill bg-sage/10 text-sage-dark"
          >
            ● En stock
          </span>
          <span
            v-else-if="product.stock > 0"
            class="badge-pill bg-honey/10 text-honey-dark"
          >
            ● Plus que {{ product.stock }} en stock
          </span>
          <span v-else class="badge-pill bg-clay/10 text-clay">
            ● Rupture de stock
          </span>
        </div>

        <div v-if="product.stock > 0" class="flex items-center gap-4 mb-6">
          <div class="flex items-center border border-mist rounded-pill">
            <button @click="quantity > 1 && quantity--" class="w-10 h-10 flex items-center justify-center text-lg">−</button>
            <span class="w-10 text-center font-medium">{{ quantity }}</span>
            <button @click="quantity < product.stock && quantity++" class="w-10 h-10 flex items-center justify-center text-lg">+</button>
          </div>

          <button @click="handleAddToCart" class="btn-primary flex-1">
            {{ added ? 'Ajouté ✓' : 'Ajouter au panier' }}
          </button>
        </div>
        <button v-else disabled class="btn-primary w-full opacity-50 cursor-not-allowed">
          Indisponible
        </button>
      </div>
    </div>
  </div>

  <div v-else-if="loading" class="animate-pulse grid md:grid-cols-2 gap-8">
    <div class="aspect-square bg-mist rounded-2xl"></div>
    <div class="space-y-4">
      <div class="h-6 bg-mist rounded w-1/3"></div>
      <div class="h-8 bg-mist rounded w-2/3"></div>
      <div class="h-24 bg-mist rounded"></div>
    </div>
  </div>

  <div v-else class="text-center py-20">
    <p class="text-ink/60">Produit introuvable.</p>
    <NuxtLink to="/produits" class="text-sage hover:underline">Retour au catalogue</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { useProducts } from '~/composables/useProducts';
import type { Product } from '~/types/product';

const route = useRoute();
const { fetchProductBySlug } = useProducts();
const cartStore = useCartStore();

const product = ref<Product | null>(null);
const loading = ref(true);
const quantity = ref(1);
const added = ref(false);

const handleAddToCart = () => {
  if (!product.value) return;
  cartStore.addItem(product.value, quantity.value);
  added.value = true;
  setTimeout(() => (added.value = false), 1500);
};

onMounted(async () => {
  try {
    product.value = await fetchProductBySlug(route.params.slug as string);
  } catch {
    product.value = null;
  } finally {
    loading.value = false;
  }
});
</script>