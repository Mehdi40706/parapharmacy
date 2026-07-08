<template>
  <div class="min-h-screen flex flex-col bg-background">
    <header class="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-mist">
      <nav class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <NuxtLink to="/" class="font-display text-xl font-semibold text-sage-dark">
          Parapharmacie
        </NuxtLink>

        <!-- Nav desktop -->
        <div class="hidden md:flex items-center gap-6 text-sm font-medium">
          <NuxtLink to="/produits" class="hover:text-sage transition-colors">Produits</NuxtLink>

          <NuxtLink to="/panier" class="relative hover:text-sage transition-colors">
            Panier
            <span
              v-if="cartStore.itemCount > 0"
              class="absolute -top-2 -right-3 bg-honey text-ink text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
            >
              {{ cartStore.itemCount }}
            </span>
          </NuxtLink>

          <template v-if="authStore.isAuthenticated">
            <NuxtLink to="/compte" class="hover:text-sage transition-colors">
              {{ authStore.user?.firstName }}
            </NuxtLink>
            <button @click="handleLogout" class="text-clay hover:underline">
              Déconnexion
            </button>
          </template>
          <template v-else>
            <NuxtLink to="/auth/login" class="btn-primary text-sm py-2">
              Connexion
            </NuxtLink>
          </template>
        </div>

        <!-- Bouton burger mobile -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 -mr-2"
          aria-label="Ouvrir le menu"
        >
          <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </nav>

      <!-- Menu mobile (drawer) -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="mobileMenuOpen" class="md:hidden border-t border-mist bg-background px-4 py-4 flex flex-col gap-3">
          <NuxtLink to="/produits" @click="mobileMenuOpen = false" class="py-2">Produits</NuxtLink>
          <NuxtLink to="/panier" @click="mobileMenuOpen = false" class="py-2">
            Panier <span v-if="cartStore.itemCount > 0" class="text-honey-dark font-semibold">({{ cartStore.itemCount }})</span>
          </NuxtLink>

          <template v-if="authStore.isAuthenticated">
            <NuxtLink to="/compte" @click="mobileMenuOpen = false" class="py-2">
              {{ authStore.user?.firstName }}
            </NuxtLink>
            <button @click="handleLogout" class="text-clay text-left py-2">Déconnexion</button>
          </template>
          <template v-else>
            <NuxtLink to="/auth/login" @click="mobileMenuOpen = false" class="btn-primary text-center">
              Connexion
            </NuxtLink>
          </template>
        </div>
      </Transition>
    </header>

    <main class="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10">
      <slot />
    </main>

    <footer class="border-t border-mist py-8 text-center text-sm text-ink/60">
      © 2026 Parapharmacie — Votre santé, notre priorité
    </footer>
  </div>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const cartStore = useCartStore();
const router = useRouter();
const mobileMenuOpen = ref(false);

const handleLogout = () => {
  authStore.logout();
  mobileMenuOpen.value = false;
  router.push('/');
};

// Ferme le menu mobile si on redimensionne vers desktop
watch(mobileMenuOpen, () => {
  if (import.meta.client) {
    document.body.style.overflow = mobileMenuOpen.value ? 'hidden' : '';
  }
});
</script>