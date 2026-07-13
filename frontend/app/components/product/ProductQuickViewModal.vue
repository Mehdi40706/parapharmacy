<template>
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
        v-if="product"
        class="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm flex items-center justify-center p-4"
        @click.self="$emit('close')"
      >
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
        >
          <div class="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto grid sm:grid-cols-2 relative">
            <button
              @click="$emit('close')"
              class="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center hover:bg-mist transition-colors sm:bg-mist"
              aria-label="Fermer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Image -->
            <div class="aspect-square sm:aspect-auto bg-mist">
              <img
                v-if="product.imageUrl"
                :src="product.imageUrl"
                :alt="product.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-ink/20 min-h-[300px]">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5l6.74-6.76ZM16 8l-6 6" />
                </svg>
              </div>
            </div>

            <!-- Détails -->
            <div class="p-6 flex flex-col">
              <span class="badge-pill bg-mist text-sage-dark self-start mb-3">
                {{ product.category.name }}
              </span>

              <h2 class="text-xl font-display font-semibold mb-2">{{ product.name }}</h2>

              <div class="flex items-center gap-3 mb-4">
                <span class="price text-2xl">{{ Number(product.price).toFixed(2) }} TND</span>
                <span
                  v-if="product.stock > 0"
                  class="badge-pill bg-sage/10 text-sage-dark"
                >
                  En stock 
                </span>
                <span v-else class="badge-pill bg-clay/10 text-clay">Rupture de stock</span>
              </div>

              <p class="text-sm text-ink/70 leading-relaxed mb-4">{{ product.description }}</p>

              <div v-if="product.usageInstructions" class="bg-mist/60 rounded-xl p-4 mb-4">
                <p class="text-xs font-medium text-sage-dark mb-1 flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                  Conseil d'utilisation
                </p>
                <p class="text-sm text-ink/70 italic whitespace-pre-line">{{ product.usageInstructions }}</p>
              </div>

              <div v-if="product.tags?.length" class="flex flex-wrap gap-2 mb-6">
                <span v-for="tag in product.tags" :key="tag" class="badge-pill bg-mist text-ink/60 text-xs">
                  {{ tag }}
                </span>
              </div>

              <div class="mt-auto flex items-center gap-3">
                <div class="flex items-center border border-mist rounded-pill">
                  <button @click="quantity > 1 && quantity--" class="w-10 h-10 flex items-center justify-center">−</button>
                  <span class="w-8 text-center font-medium">{{ quantity }}</span>
                  <button @click="quantity < product.stock && quantity++" class="w-10 h-10 flex items-center justify-center">+</button>
                </div>

                <button
                  @click="handleAdd"
                  :disabled="product.stock === 0"
                  class="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.994-4.735 2.573-7.273a1.125 1.125 0 0 0-1.11-1.313H5.106M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                  </svg>
                  {{ added ? 'Ajouté ✓' : 'Ajouter au panier' }}
                </button>
              </div>

              <NuxtLink
                :to="`/produits/${product.slug}`"
                class="text-xs text-center text-ink/40 hover:text-sage mt-4"
              >
                Voir la page complète du produit →
              </NuxtLink>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Product } from '~/types/product';

const props = defineProps<{ product: Product | null }>();
const emit = defineEmits<{ close: [] }>();

const cartStore = useCartStore();
const quantity = ref(1);
const added = ref(false);

watch(
  () => props.product,
  () => {
    quantity.value = 1;
    added.value = false;
  },
);

const handleAdd = () => {
  if (!props.product) return;
  cartStore.addItem(props.product, quantity.value);
  added.value = true;
  setTimeout(() => (added.value = false), 1200);
};

// Fermer avec Echap
onMounted(() => {
  const handler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') emit('close');
  };
  window.addEventListener('keydown', handler);
  onUnmounted(() => window.removeEventListener('keydown', handler));
});
</script>