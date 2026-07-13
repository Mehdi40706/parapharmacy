<template>
  <div class="min-h-screen flex flex-col bg-background">
    <header class="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-mist">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <NuxtLink to="/" class="font-display text-xl font-semibold text-sage-dark">
          Parapharmacie
        </NuxtLink>
        <!-- Nav desktop -->
        <div class="hidden md:flex items-center gap-12 text-sm font-medium">
          <template v-if="authStore.isAuthenticated">
          <NuxtLink to="/panier" class="relative hover:text-sage transition-colors">
            <Icon
              name="heroicons:shopping-cart"
              class="w-6 h-6"
            />            
            <span
              v-if="cartStore.itemCount > 0"
              class="absolute -top-2 -right-3 bg-honey text-ink text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
            >
              {{ cartStore.itemCount }}
            </span>
          </NuxtLink>
          <div
            ref="userMenu"
            class="relative"
          >
            <button
              @click.stop="userMenuOpen = !userMenuOpen"
              class="flex items-center gap-2 rounded-full border border-mist px-2 py-1.5 hover:bg-gray-50 transition"
            >
              <div
                class="w-9 h-9 rounded-full bg-sage text-white flex items-center justify-center font-semibold"
              >
                {{ authStore.user?.firstName?.charAt(0).toUpperCase() }}
              </div>
              <span class="hidden lg:block">
                {{ authStore.user?.firstName }}
              </span>
              <Icon
                name="heroicons:chevron-down"
                class="w-4 h-4"
              />
            </button>
            <Transition
              enter-active-class="transition duration-150"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition duration-100"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
            >
              <div
                v-if="userMenuOpen"
                class="absolute right-0 mt-3 w-64 rounded-xl border border-mist bg-white shadow-xl overflow-hidden z-50"
              >
                <div class="px-4 py-4 border-b">
                  <p class="font-semibold">
                    {{ authStore.user?.firstName }}
                    {{ authStore.user?.lastName }}
                  </p>
                  <p class="text-sm text-gray-500">
                    {{ authStore.user?.email }}
                  </p>
                </div>
                <NuxtLink
                  to="/compte"
                  class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
                  @click="userMenuOpen = false"
                >
                  <Icon
                    name="heroicons:user-circle"
                    class="w-5 h-5"
                  />
                  Mon compte
                </NuxtLink>
                <NuxtLink
                  to="/commandes"
                  class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
                  @click="userMenuOpen = false"
                >
                  <Icon
                    name="heroicons:shopping-bag"
                    class="w-5 h-5"
                  />
                  Mes commandes
                </NuxtLink>
                <NuxtLink
                  to="/favoris"
                  class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
                  @click="userMenuOpen = false"
                >
                  <Icon
                    name="heroicons:heart"
                    class="w-5 h-5"
                  />
                  Favoris
                </NuxtLink>
                <div class="border-t"></div>
                <button
                  @click="handleLogout"
                  class="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50"
                >
                  <Icon
                    name="heroicons:arrow-right-on-rectangle"
                    class="w-5 h-5"
                  />
                  Déconnexion
                </button>
              </div>
            </Transition>
          </div>
        </template>
          <template v-else>
            <NuxtLink to="/auth/login" class="btn-primary text-sm py-2">
              Connexion
            </NuxtLink>
          </template>
        </div>
        <!-- Bouton burger mobile -->
            <NuxtLink to="/panier" class="relative hover:text-sage transition-colors">
            <Icon
              name="heroicons:shopping-cart"
              class="w-6 h-6"
            />            
            <span
              v-if="cartStore.itemCount > 0"
              class="absolute -top-2 -right-3 bg-honey text-ink text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
            >
              {{ cartStore.itemCount }}
            </span>
          </NuxtLink>
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden p-2 -mr-2"
          aria-label="Ouvrir le menu"
        >
              <div
                class="w-9 h-9 rounded-full bg-sage text-white flex items-center justify-center font-semibold"
              >
                {{ authStore.user?.firstName?.charAt(0).toUpperCase() }}
              </div>
              <span class="hidden lg:block">
                {{ authStore.user?.firstName }}
              </span>
            
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
      <div v-if="mobileMenuOpen" class="md:hidden border-t border-mist bg-background px-4 py-8 flex flex-col gap-3">
      <div class="px-4 py-4 border-b">
                  <p class="font-semibold">
                    {{ authStore.user?.firstName }}
                    {{ authStore.user?.lastName }}
                  </p>
                  <p class="text-sm text-gray-500">
                    {{ authStore.user?.email }}
                  </p>
                </div>
                <NuxtLink
                  to="/compte"
                  class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
                  @click="userMenuOpen = false"
                >
                  <Icon
                    name="heroicons:user-circle"
                    class="w-5 h-5"
                  />
                  Mon compte
                </NuxtLink>
                <NuxtLink
                  to="/commandes"
                  class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
                  @click="userMenuOpen = false"
                >
                  <Icon
                    name="heroicons:shopping-bag"
                    class="w-5 h-5"
                  />
                  Mes commandes
                </NuxtLink>
                <NuxtLink
                  to="/favoris"
                  class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
                  @click="userMenuOpen = false"
                >
                  <Icon
                    name="heroicons:heart"
                    class="w-5 h-5"
                  />
                  Favoris
                </NuxtLink>
                <div class="border-t"></div>
                <button
                  @click="handleLogout"
                  class="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50"
                >
                  <Icon
                    name="heroicons:arrow-right-on-rectangle"
                    class="w-5 h-5"
                  />
                  Déconnexion
                </button>
        </div>
      </Transition>
    </header>

    <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10">
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
  router.push('/auth/login');
};

// Ferme le menu mobile si on redimensionne vers desktop
watch(mobileMenuOpen, () => {
  if (import.meta.client) {
    document.body.style.overflow = mobileMenuOpen.value ? 'hidden' : '';
  }
});

const userMenuOpen = ref(false);
const userMenu = ref<HTMLElement | null>(null);

onMounted(() => {
  const close = (event: MouseEvent) => {
    if (
      userMenu.value &&
      !userMenu.value.contains(event.target as Node)
    ) {
      userMenuOpen.value = false;
    }
  };

  window.addEventListener("click", close);

  onUnmounted(() => {
    window.removeEventListener("click", close);
  });
});
</script>