<template>
  <div class="group flex flex-col h-full bg-white rounded-xl sm:rounded-2xl border border-mist overflow-hidden hover:shadow-md transition-shadow duration-200">
    <NuxtLink
      :to="`/produits/${product.slug}`"
      class="flex flex-col flex-1"
      >
      <!-- Image -->
      <div class="aspect-[4/3] bg-mist relative overflow-hidden">
        <img
          v-if="product.imageUrl"
          :src="product.imageUrl"
          :alt="product.name"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div v-else class="w-full h-full flex items-center justify-center text-ink/20">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 sm:w-12 sm:h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76ZM16 8l-6 6" />
          </svg>
        </div>

        <span class="badge-pill absolute top-2 left-2 sm:top-3 sm:left-3 bg-ink/80 text-white backdrop-blur-sm text-[10px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1">
          {{ product.category.name }}
        </span>

        <span
          v-if="product.stock === 0"
          class="badge-pill absolute top-2 right-2 sm:top-3 sm:right-3 bg-clay text-white text-[10px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1"
        >
          Rupture
        </span>
        <span
          v-else
          class="badge-pill absolute top-2 right-2 sm:top-3 sm:right-3 bg-sage text-white text-[10px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1"
        >
          En stock
        </span>
      </div>
    </NuxtLink>

    <!-- Contenu -->
    <div class="p-3 sm:p-4 flex flex-col gap-1 sm:gap-1.5 flex-1">
      <span v-if="product.tags?.length" class="text-[11px] sm:text-xs text-sage font-medium">
        {{ product.tags[0] }}
      </span>

      <h3 class="font-display font-semibold leading-snug line-clamp-2 text-sm sm:text-base">
        {{ product.name }}
      </h3>

      <p class="text-xs sm:text-sm text-ink/60 line-clamp-2">
        {{ product.description }}
      </p>
      <div class="mt-auto pt-2 sm:pt-3 flex items-center justify-between gap-2 sm:gap-3 flex-wrap">
        <div class="min-w-0">
          <span class="text-[10px] sm:text-[11px] text-ink/40 block uppercase tracking-wide">Prix</span>
          <span class="price text-base sm:text-lg whitespace-nowrap">{{ Number(product.price).toFixed(2) }} TND</span>
        </div>

        <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            @click="$emit('quick-view', product)"
            class="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-mist flex items-center justify-center hover:bg-mist transition-colors shrink-0"
            aria-label="Aperçu rapide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </button>
          <button
            @click="handleQuickAdd"
            :disabled="product.stock === 0"
            class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-sage text-white flex items-center justify-center hover:bg-sage-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            aria-label="Ajouter au panier"
          >
            <svg v-if="!justAdded" xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.994-4.735 2.573-7.273a1.125 1.125 0 0 0-1.11-1.313H5.106M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product';

const props = defineProps<{ product: Product }>();
const emit = defineEmits<{ 'quick-view': [product: Product] }>();

const cartStore = useCartStore();
const justAdded = ref(false);
const authStore = useAuthStore();
const handleQuickAdd = () => {
  if (!authStore.isAuthenticated) {
    return navigateTo('auth/login');
  }
  cartStore.addItem(props.product, 1);
  justAdded.value = true;
  setTimeout(() => (justAdded.value = false), 1200);
};
</script>