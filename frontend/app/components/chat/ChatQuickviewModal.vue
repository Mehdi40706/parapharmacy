<template>
  <Transition name="modal">
    <div
      v-if="product"
      class="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-ink/40 backdrop-blur-sm"
      @click.self="$emit('close')"
    >
      <div class="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-sm p-5 shadow-2xl">
        <div class="aspect-square bg-mist rounded-2xl overflow-hidden mb-4">
          <img
            v-if="product.imageUrl"
            :src="product.imageUrl"
            :alt="product.name"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-ink/20">
            <Icon name="lucide:package" class="w-10 h-10" />
          </div>
        </div>

        <h3 class="font-semibold text-lg mb-1">{{ product.name }}</h3>
        <p class="text-sage-dark font-semibold text-xl mb-3">{{ product.price.toFixed(2) }} TND</p>
        <p v-if="product.description" class="text-sm text-ink/60 leading-relaxed mb-5">
          {{ product.description }}
        </p>

        <div class="flex gap-2">
          <button
            @click="$emit('close')"
            class="flex-1 py-2.5 rounded-xl border border-mist text-sm font-medium text-ink/70 hover:bg-mist/40 transition"
          >
            Fermer
          </button>
          <NuxtLink
            :to="product.url"
            @click="$emit('close')"
            class="flex-1 py-2.5 rounded-xl bg-sage text-white text-sm font-medium text-center hover:bg-sage-dark transition"
          >
            Voir le produit
          </NuxtLink>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { ChatProduct } from '~/composables/useChat';

defineProps<{ product: ChatProduct | null }>();
defineEmits<{ close: [] }>();
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>