<template>
  <div class="mx-auto max-w-4xl space-y-5">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.25em] text-sage">Administration</p>
        <h1 class="mt-1 text-2xl font-semibold text-ink">Modifier le produit</h1>
      </div>
      <NuxtLink to="/admin/produits" class="text-sm font-medium text-sage transition hover:text-sage-dark">
        ← Retour à la liste
      </NuxtLink>
    </div>

    <div v-if="isLoading" class="rounded-[2rem] border border-mist bg-white p-6 shadow-sm">
      <div class="animate-pulse space-y-3">
        <div class="h-4 w-28 rounded bg-mist" />
        <div class="h-10 rounded-xl bg-mist" />
        <div class="h-24 rounded-xl bg-mist" />
        <div class="h-10 rounded-xl bg-mist" />
      </div>
    </div>

    <ProductForm
      v-else-if="product"
      :initial="product"
      @submit="handleSubmit"
      :loading="loading"
      :error="errorMessage"
    />

    <div v-else class="rounded-[2rem] border border-dashed border-mist bg-white p-6 text-sm text-ink/70">
      Impossible de charger ce produit pour le moment.
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' });

const route = useRoute();
const router = useRouter();
const api = useApi();
const { updateProduct } = useAdminProducts();

const product = ref<any>(null);
const loading = ref(false);
const isLoading = ref(true);
const errorMessage = ref('');

const handleSubmit = async (payload: any) => {
  loading.value = true;
  errorMessage.value = '';
  try {
    await updateProduct(route.params.id as string, payload);
    router.push('/admin/produits');
  } catch (error: any) {
    errorMessage.value = error?.data?.message || 'Erreur lors de la modification';
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  try {
    product.value = await api(`/products/${route.params.id}`);
  } catch (error: any) {
    errorMessage.value = error?.data?.message || 'Produit introuvable';
  } finally {
    isLoading.value = false;
  }
});
</script>