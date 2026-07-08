<template>
  <div class="min-h-screen flex">
    <aside class="w-64 bg-gray-900 text-white p-4">
      <h2 class="text-xl font-bold mb-6">Admin</h2>
      <nav class="flex flex-col gap-2">
        <NuxtLink to="/admin">Dashboard</NuxtLink>
        <NuxtLink to="/admin/produits">Produits</NuxtLink>
        <NuxtLink to="/admin/categories">Catégories</NuxtLink>
        <NuxtLink to="/admin/commandes">Commandes</NuxtLink>
        <NuxtLink to="/admin/utilisateurs">Utilisateurs</NuxtLink>
      </nav>
    </aside>
    <main class="flex-1 p-6 bg-gray-50">
      <slot />
    </main>
  </div>
</template>