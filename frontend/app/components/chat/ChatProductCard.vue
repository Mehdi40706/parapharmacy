<template>
  <div class="flex gap-2.5 bg-white border border-mist/70 rounded-xl p-2.5 hover:border-sage/40 transition-colors">
    <div class="w-14 h-14 rounded-lg bg-mist shrink-0 overflow-hidden">
      <img
        v-if="product.imageUrl"
        :src="product.imageUrl"
        :alt="product.name"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-ink/20">
        <Icon name="lucide:package" class="w-5 h-5" />
      </div>
    </div>

    <div class="flex-1 min-w-0 flex flex-col justify-center gap-1">
      <p class="text-sm font-medium text-ink truncate">{{ product.name }}</p>
      <p class="text-sm font-semibold text-sage-dark">{{ product.price.toFixed(2) }} TND</p>
    </div>

    <div class="flex flex-col justify-center gap-1 shrink-0">
      <button
        @click="$emit('quickview', product)"
        class="w-8 h-8 rounded-full bg-mist/70 hover:bg-sage/15 flex items-center justify-center transition-colors"
        aria-label="Aperçu rapide"
        title="Aperçu rapide"
      >
        <Icon name="lucide:eye" class="w-4 h-4 text-sage-dark" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatProduct } from '~/composables/useChat';

defineProps<{ product: ChatProduct }>();
defineEmits<{ quickview: [product: ChatProduct] }>();
</script>