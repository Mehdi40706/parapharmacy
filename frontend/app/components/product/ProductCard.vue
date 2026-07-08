<template>
  <NuxtLink
    :to="`/produits/${product.slug}`"
    class="group flex flex-col bg-white rounded-2xl border border-mist overflow-hidden hover:shadow-md transition-shadow duration-200"
  >
    <div class="aspect-square bg-mist relative overflow-hidden">
      <img
        v-if="product.imageUrl"
        :src="product.imageUrl"
        :alt="product.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-ink/20">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76ZM16 8l-6 6" />
        </svg>
      </div>

      <span
        v-if="product.stock === 0"
        class="badge-pill absolute top-3 left-3 bg-clay/90 text-white"
      >
        Rupture de stock
      </span>
      <span
        v-else-if="product.stock <= 5"
        class="badge-pill absolute top-3 left-3 bg-honey/90 text-ink"
      >
        Stock limité
      </span>
    </div>

    <div class="p-4 flex flex-col gap-1 flex-1">
      <span class="text-xs text-sage font-medium">{{ product.category.name }}</span>
      <h3 class="font-medium leading-snug line-clamp-2">{{ product.name }}</h3>
      <div class="mt-auto pt-2 flex items-center justify-between">
<span class="price text-lg">{{ Number(product.price).toFixed(2) }} TND</span>      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product';

defineProps<{ product: Product }>();
</script>