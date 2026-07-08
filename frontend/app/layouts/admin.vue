<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(61,102,87,0.12),_transparent_30%)] text-ink">
    <div class="flex min-h-screen flex-col lg:flex-row">
      <div
        v-if="menuOpen"
        class="fixed inset-0 z-20 bg-slate-950/40 lg:hidden"
        @click="menuOpen = false"
      />

      <aside
        :class="[
          'fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-white/10 bg-slate-950 p-5 text-white shadow-2xl transition-transform duration-300 lg:static lg:translate-x-0 lg:border-r-mist/20 lg:bg-slate-950',
          menuOpen ? 'translate-x-0' : '-translate-x-full'
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
            <span class="text-base">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </NuxtLink>
        </nav>

        <div class="mt-6 rounded-2xl border border-white/10 bg-white/10 p-4 text-sm text-slate-300">
          <p class="font-medium text-white">Mode gestion</p>
          <p class="mt-1">Gérez produits, commandes et utilisateurs depuis un tableau de bord moderne.</p>
        </div>
      </aside>

      <div class="flex-1">
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

            <div class="hidden items-center gap-3 rounded-full border border-mist bg-white px-4 py-2 text-sm text-slate-600 shadow-sm sm:flex">
              <span class="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span>En ligne</span>
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
import { ref, watch } from 'vue';

const route = useRoute();
const menuOpen = ref(false);

const navItems = [
  { label: 'Dashboard', to: '/admin', icon: '⌂' },
  { label: 'Produits', to: '/admin/produits', icon: '🧴' },
  { label: 'Catégories', to: '/admin/categories', icon: '🗂️' },
  { label: 'Commandes', to: '/admin/commandes', icon: '🛒' },
  { label: 'Utilisateurs', to: '/admin/utilisateurs', icon: '👤' },
];

const isActive = (path: string) => route.path === path || (path !== '/admin' && route.path.startsWith(path));

watch(() => route.path, () => {
  menuOpen.value = false;
});
</script>