<script setup lang="ts">
definePageMeta({ middleware: 'auth' });
const route = useRoute();
const orderId = route.query.order_id as string | undefined;
</script>

<template>
  <!-- ... -->
  <div class="flex gap-3 mt-2">
    <NuxtLink to="/produits" class="btn-secondary">Continuer mes achats</NuxtLink>
    <NuxtLink
      v-if="orderId"
      :to="{ path: '/checkout/retry', query: { order_id: orderId } }"
      class="btn-primary"
    >
      Réessayer le paiement
    </NuxtLink>
    <NuxtLink v-else to="/commandes" class="btn-primary">Voir mes commandes</NuxtLink>
  </div>
</template>