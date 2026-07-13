<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(61,102,87,0.12),_transparent_30%)] text-ink">
    <div class="flex min-h-screen flex-col lg:flex-row">
      <div
        v-if="menuOpen"
        class="fixed inset-0 z-20 bg-slate-950/40 lg:hidden"
        @click="menuOpen = false"
      />
      <aside
        @click.stop
        :class="[
          'fixed inset-y-0 left-0 z-30 flex w-72 flex-col overflow-y-auto border-r border-white/10 bg-slate-950 p-5 text-white shadow-2xl transition-transform duration-300',
          menuOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0'
        ]"
      >
        <div class="mb-8 flex items-center justify-between">
          <div>
            <p class="text-xs uppercase tracking-[0.3em] text-slate-400">Administration</p>
            <h2 class="text-xl font-semibold">Para Admin</h2>
          </div>
          <button class="rounded-full p-2 text-slate-300 transition hover:bg-white/10 lg:hidden" @click="menuOpen = false">
            ✕
          </button>
        </div>

        <nav class="flex flex-1 flex-col gap-2">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition"
            :class="isActive(item.to) ? 'bg-white/15 text-white shadow-sm' : 'text-slate-300 hover:bg-white/10 hover:text-white'"
          >
          <Icon
            :name="item.icon"
            class="w-5 h-5"
          />            
          <span>{{ item.label }}</span>
          </NuxtLink>
        </nav>
        <div class="border-t border-white/10 pt-4">
          <button
            @click="handleLogout"
            class="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <Icon name="lucide:log-out" class="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <div class="flex-1 min-w-0 lg:pl-72">
        <header class="sticky top-0 z-20 border-b border-mist/70 bg-background/90 backdrop-blur-xl">
          <div class="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div class="flex items-center gap-3">
              <button class="rounded-full border border-mist bg-white p-2 text-slate-700 shadow-sm lg:hidden" @click="menuOpen = true">
                ☰
              </button>
              <div>
                <p class="text-xs uppercase tracking-[0.3em] text-sage">Tableau de bord</p>
                <h1 class="text-lg font-semibold text-ink">Gestion de la boutique</h1>
              </div>
            </div>

          </div>
        </header>

        <main class="p-4 sm:p-6 lg:p-8">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';


const route = useRoute();
const menuOpen = ref(false);

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: 'lucide:layout-dashboard' },
  { label: 'Produits', to: '/admin/produits', icon: 'lucide:package' },
  { label: 'Catégories', to: '/admin/categories', icon: 'lucide:folder-tree' },
  { label: 'Commandes', to: '/admin/commandes', icon: 'lucide:shopping-cart' },
  { label: 'Clients', to: '/admin/utilisateurs', icon: 'lucide:user' },
]
;

const isActive = (path: string) => route.path === path || (path !== '/admin' && route.path.startsWith(path));
const authStore = useAuthStore();
const router = useRouter();
const mobileMenuOpen = ref(false);

const closeMenuOnEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    menuOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('keydown', closeMenuOnEscape);
});

onUnmounted(() => {
  window.removeEventListener('keydown', closeMenuOnEscape);
});
const handleLogout = () => {
  authStore.logout();
  mobileMenuOpen.value = false;
  router.push('/auth/login');
};

watch(() => route.path, () => {
  menuOpen.value = false;
});
</script>