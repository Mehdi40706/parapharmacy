<template>
  <div>
    <h1 class="text-3xl font-semibold mb-8">Mon panier</h1>

    <div v-if="cartStore.isEmpty" class="text-center py-20">
      <p class="text-ink/60 mb-4">Votre panier est vide.</p>
      <NuxtLink to="/produits" class="btn-primary inline-block">
        Découvrir nos produits
      </NuxtLink>
    </div>

    <div v-else class="grid lg:grid-cols-3 gap-8">
      <!-- Liste -->
      <div class="lg:col-span-2 flex flex-col gap-3">
        <div
          v-for="item in cartStore.items"
          :key="item.product.id"
          class="flex gap-4 bg-white rounded-2xl border border-mist p-4"
        >
          <div class="w-20 h-20 bg-mist rounded-xl flex-shrink-0 overflow-hidden">
            <img
              v-if="item.product.imageUrl"
              :src="item.product.imageUrl"
              :alt="item.product.name"
              class="w-full h-full object-cover"
            />
          </div>

          <div class="flex-1 min-w-0">
            <h3 class="font-medium truncate">{{ item.product.name }}</h3>
            <p class="price text-sm mb-2">{{ item.product.price.toFixed(2) }} TND</p>

            <div class="flex items-center gap-3">
              <div class="flex items-center border border-mist rounded-pill">
                <button
                  @click="cartStore.updateQuantity(item.product.id, item.quantity - 1)"
                  class="w-8 h-8 flex items-center justify-center"
                >−</button>
                <span class="w-8 text-center text-sm font-medium">{{ item.quantity }}</span>
                <button
                  @click="cartStore.updateQuantity(item.product.id, item.quantity + 1)"
                  class="w-8 h-8 flex items-center justify-center"
                >+</button>
              </div>

              <button
                @click="cartStore.removeItem(item.product.id)"
                class="text-clay text-sm hover:underline"
              >
                Retirer
              </button>
            </div>
          </div>

          <p class="price flex-shrink-0">
            {{ (item.product.price * item.quantity).toFixed(2) }} TND
          </p>
        </div>
      </div>

      <!-- Résumé -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-2xl border border-mist p-6 lg:sticky lg:top-24">
          <h2 class="font-medium mb-4">Résumé</h2>
          <div class="flex justify-between text-sm mb-2">
            <span class="text-ink/60">Sous-total</span>
            <span class="price">{{ cartStore.total.toFixed(2) }} TND</span>
          </div>
          <div class="border-t border-mist my-4" />
          <div class="flex justify-between font-medium mb-6">
            <span>Total</span>
            <span class="price text-lg">{{ cartStore.total.toFixed(2) }} TND</span>
          </div>

          <button @click="handleCheckout" class="btn-primary w-full">
            Passer la commande
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();

const handleCheckout = () => {
  if (!authStore.isAuthenticated) {
    router.push('/auth/login');
    return;
  }
  router.push('/checkout');
};
</script>