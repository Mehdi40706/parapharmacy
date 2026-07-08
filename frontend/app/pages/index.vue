<template>
  <div>
    <h1 class="text-2xl font-bold">Bienvenue sur la Parapharmacie</h1>
    <p v-if="authStore.isAuthenticated">Connecté en tant que {{ authStore.user?.email }}</p>
    <p v-else>Non connecté</p>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth.store';

const authStore = useAuthStore();
</script>