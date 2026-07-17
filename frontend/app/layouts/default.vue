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
              <Icon name="heroicons:shopping-cart" class="w-6 h-6" />
              <span
                v-if="cartStore.itemCount > 0"
                class="absolute -top-2 -right-3 bg-honey text-ink text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
              >
                {{ cartStore.itemCount }}
              </span>
            </NuxtLink>

            <div ref="userMenu" class="relative">
              <button
                @click.stop="userMenuOpen = !userMenuOpen"
                class="flex items-center gap-2 rounded-full border border-mist px-2 py-1.5 hover:bg-gray-50 transition"
              >
                <div class="w-9 h-9 rounded-full bg-sage text-white flex items-center justify-center font-semibold">
                  {{ authStore.user?.firstName?.charAt(0).toUpperCase() }}
                </div>
                <span class="hidden lg:block">{{ authStore.user?.firstName }}</span>
                <Icon name="heroicons:chevron-down" class="w-4 h-4" />
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
                      {{ authStore.user?.firstName }} {{ authStore.user?.lastName }}
                    </p>
                    <p class="text-sm text-gray-500">{{ authStore.user?.email }}</p>
                  </div>
                  <NuxtLink to="/compte" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50" @click="userMenuOpen = false">
                    <Icon name="heroicons:user-circle" class="w-5 h-5" />
                    Mon compte
                  </NuxtLink>
                  <NuxtLink to="/commandes" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50" @click="userMenuOpen = false">
                    <Icon name="heroicons:shopping-bag" class="w-5 h-5" />
                    Mes commandes
                  </NuxtLink>
                  <div class="border-t"></div>
                  <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50">
                    <Icon name="heroicons:arrow-right-on-rectangle" class="w-5 h-5" />
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

        <!-- Zone mobile : panier + burger -->
        <div class="md:hidden flex items-center gap-4">
          <NuxtLink
            v-if="authStore.isAuthenticated"
            to="/panier"
            class="relative"
            @click="mobileMenuOpen = false"
          >
            <Icon name="heroicons:shopping-cart" class="w-6 h-6" />
            <span
              v-if="cartStore.itemCount > 0"
              class="absolute -top-2 -right-3 bg-honey text-ink text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
            >
              {{ cartStore.itemCount }}
            </span>
          </NuxtLink>

          <button
            @click.stop="mobileMenuOpen = !mobileMenuOpen"
            class="p-2 -mr-2"
            aria-label="Ouvrir le menu"
          >
            <Icon
              :name="mobileMenuOpen ? 'heroicons:x-mark' : 'heroicons:bars-3'"
              class="w-6 h-6"
            />
          </button>
        </div>
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
        <div
          v-if="mobileMenuOpen"
          ref="mobileMenu"
          class="md:hidden border-t border-mist bg-background px-4 py-3 flex flex-col gap-3"
        >
          <template v-if="authStore.isAuthenticated">
            <div class="px-4 py-4 border-b">
              <p class="font-semibold">
                {{ authStore.user?.firstName }} {{ authStore.user?.lastName }}
              </p>
              <p class="text-sm text-gray-500">{{ authStore.user?.email }}</p>
            </div>
            <NuxtLink to="/compte" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50" @click="mobileMenuOpen = false">
              <Icon name="heroicons:user-circle" class="w-5 h-5" />
              Mon compte
            </NuxtLink>
            <NuxtLink to="/commandes" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50" @click="mobileMenuOpen = false">
              <Icon name="heroicons:shopping-bag" class="w-5 h-5" />
              Mes commandes
            </NuxtLink>
            <div class="border-t"></div>
            <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50">
              <Icon name="heroicons:arrow-right-on-rectangle" class="w-5 h-5" />
              Déconnexion
            </button>
          </template>

          <template v-else>
            <NuxtLink
              to="/auth/login"
              class="btn-primary text-sm py-2 text-center"
              @click="mobileMenuOpen = false"
            >
              Connexion
            </NuxtLink>
          </template>
        </div>
      </Transition>
    </header>

    <main class="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10">
  <slot />
</main>

  <ChatWidget />
<Footer/>
    </div>
  </template>

<script setup lang="ts">
import ChatWidget from '~/components/chat/ChatWidget.vue';
import Footer from '~/components/ui/Footer.vue';


const authStore = useAuthStore();
const cartStore = useCartStore();
const router = useRouter();

const mobileMenuOpen = ref(false);
const mobileMenu = ref<HTMLElement | null>(null);

const userMenuOpen = ref(false);
const userMenu = ref<HTMLElement | null>(null);

const handleLogout = () => {
  authStore.logout();
  mobileMenuOpen.value = false;
  userMenuOpen.value = false;
  router.push('/auth/login');
};

onMounted(() => {
  const close = (event: MouseEvent) => {
    const target = event.target as Node;

    if (userMenu.value && !userMenu.value.contains(target)) {
      userMenuOpen.value = false;
    }
    if (mobileMenu.value && !mobileMenu.value.contains(target)) {
      mobileMenuOpen.value = false;
    }
  };

  window.addEventListener("click", close);

  onUnmounted(() => {
    window.removeEventListener("click", close);
  });
});
</script>