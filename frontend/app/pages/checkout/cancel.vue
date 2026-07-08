<template>
  <div class="max-w-lg mx-auto text-center py-12 flex flex-col items-center gap-4">
    <div class="w-16 h-16 rounded-full bg-clay/10 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-clay" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </div>
    <h1 class="text-2xl font-semibold">Paiement annulé</h1>
    <p class="text-ink/60">Votre commande a été enregistrée mais le paiement n'a pas été finalisé.</p>
    <div class="flex gap-3 mt-2">
      <NuxtLink to="/produits" class="btn-secondary">Continuer mes achats</NuxtLink>
      <NuxtLink to="/compte/commandes" class="btn-primary">Voir mes commandes</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' });
</script>