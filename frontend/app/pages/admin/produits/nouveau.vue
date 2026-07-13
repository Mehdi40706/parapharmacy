<template>
  <div class="mx-auto max-w-4xl space-y-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.25em] text-sage">Administration</p>
        <h1 class="mt-1 text-2xl font-semibold text-ink">Nouveau produit</h1>
      </div>
      <NuxtLink to="/admin/produits" class="text-sm font-medium text-sage transition hover:text-sage-dark">
        ← Retour à la liste
      </NuxtLink>
    </div>

    <ProductForm @submit="handleSubmit" :loading="loading" :error="errorMessage" />
  </div>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast.js';
import ProductForm from '../ProductForm.vue';

definePageMeta({ layout: 'admin', middleware: 'admin' });

const { createProduct } = useAdminProducts();
const router = useRouter();
const loading = ref(false);
const errorMessage = ref('');
const toast = useToast();

const handleSubmit = async (payload: any) => {
  loading.value = true;
  errorMessage.value = '';
  try {
    await createProduct(payload);
    router.push('/admin/produits');
  } catch (error: any) {
    toast.error(
      error?.data?.message ||
      error?.response?.data?.message ||
      "Une erreur est survenue lors de la création du produit."
    );

  } finally {
    loading.value = false;
  }
};
</script>