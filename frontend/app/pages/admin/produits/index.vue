<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Produits</h1>
      <NuxtLink to="/admin/produits/nouveau" class="btn-primary">+ Nouveau produit</NuxtLink>
    </div>

    <!-- Vue tableau : desktop uniquement -->
    <div class="hidden md:block bg-white rounded-2xl border border-mist overflow-x-auto">
      <table class="w-full text-sm min-w-[640px]">
        <thead class="bg-mist/50">
          <tr class="text-left">
            <th class="p-4">Nom</th>
            <th class="p-4">Catégorie</th>
            <th class="p-4">Prix</th>
            <th class="p-4">Stock</th>
            <th class="p-4">Statut</th>
            <th class="p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id" class="border-t border-mist">
            <td class="p-4 font-medium">{{ product.name }}</td>
            <td class="p-4 text-ink/60">{{ product.category.name }}</td>
            <td class="p-4 price">{{ product.price.toFixed(2) }} TND</td>
            <td class="p-4">
              <span :class="product.stock === 0 ? 'text-clay' : 'text-ink/70'">
                {{ product.stock }}
              </span>
            </td>
            <td class="p-4">
              <span v-if="!product.isActive" class="badge-pill bg-clay/10 text-clay text-xs">
                Archivé
              </span>
              <span v-else class="badge-pill bg-sage/10 text-sage-dark text-xs">
                Actif
              </span>
            </td>
            <td class="p-4">
              <div class="flex justify-center">
                <ActionsMenu>
                  <template #default="{ close }">
                    <ActionsMenuItem label="Aperçu rapide" @click="openQuickView(product); close()" />
                    <NuxtLink
                      :to="`/admin/produits/${product.id}/edit`"
                      class="w-full text-left px-4 py-2 text-sm text-ink hover:bg-mist transition-colors block"
                      @click="close()"
                    >
                      Modifier
                    </NuxtLink>
                    <ActionsMenuItem
                      v-if="product.isActive"
                      label="Archiver"
                      danger
                      @click="handleArchive(product.id); close()"
                    />
                    <ActionsMenuItem
                      v-else
                      label="Réactiver"
                      @click="handleRestore(product.id); close()"
                    />
                    <ActionsMenuItem label="Supprimer" danger @click="askDelete(product); close()" />
                  </template>
                </ActionsMenu>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Vue cartes : mobile uniquement -->
    <div class="md:hidden flex flex-col gap-3">
      <div
        v-for="product in products"
        :key="product.id"
        class="bg-white rounded-2xl border border-mist p-4"
      >
        <div class="flex justify-between items-start mb-2">
          <div>
            <p class="font-medium">{{ product.name }}</p>
            <p class="text-ink/60 text-xs">{{ product.category.name }}</p>
          </div>
          <div class="flex items-center gap-2">
            <span v-if="!product.isActive" class="badge-pill bg-clay/10 text-clay text-xs">
              Archivé
            </span>
            <span v-else class="badge-pill bg-sage/10 text-sage-dark text-xs">
              Actif
            </span>
            <ActionsMenu>
              <template #default="{ close }">
                <ActionsMenuItem label="Aperçu rapide" @click="openQuickView(product); close()" />
                <NuxtLink
                  :to="`/admin/produits/${product.id}/edit`"
                  class="w-full text-left px-4 py-2 text-sm text-ink hover:bg-mist transition-colors block"
                  @click="close()"
                >
                  Modifier
                </NuxtLink>
                <ActionsMenuItem
                  v-if="product.isActive"
                  label="Archiver"
                  danger
                  @click="handleArchive(product.id); close()"
                />
                <ActionsMenuItem
                  v-else
                  label="Réactiver"
                  @click="handleRestore(product.id); close()"
                />
                <ActionsMenuItem label="Supprimer" danger @click="askDelete(product); close()" />
              </template>
            </ActionsMenu>
          </div>
        </div>

        <div class="flex justify-between text-sm">
          <span class="price">{{ product.price.toFixed(2) }} TND</span>
          <span :class="product.stock === 0 ? 'text-clay' : 'text-ink/70'">
            Stock: {{ product.stock }}
          </span>
        </div>
      </div>
    </div>

    <div v-if="pagination && pagination.totalPages > 1" class="flex justify-center gap-2 mt-6">
      <button
        v-for="page in pagination.totalPages"
        :key="page"
        @click="goToPage(page)"
        class="w-9 h-9 rounded-pill text-sm font-medium"
        :class="page === currentPage ? 'bg-sage text-white' : 'hover:bg-mist'"
      >
        {{ page }}
      </button>
    </div>

    <ConfirmModal
      :open="!!productToDelete"
      title="Supprimer le produit ?"
      :loading="deleting"
      @cancel="productToDelete = null"
      @confirm="confirmDelete"
    >
      Cette action est irréversible. Voulez-vous vraiment supprimer
      <span class="font-medium text-ink">{{ productToDelete?.name }}</span> ?
    </ConfirmModal>

    <ProductQuickViewModal :product="quickViewProduct" :is-admin="true" @close="quickViewProduct = null" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' });

import ConfirmModal from '~/components/common/ConfirmModal.vue';
import ActionsMenu from '~/components/common/ActionsMenu.vue';
import ActionsMenuItem from '~/components/common/ActionsMenuItem.vue';
import { useToast } from '~/composables/useToast';
import { getApiErrorMessage } from '~/composables/useApi';
import type { Product } from '~/types/product';

const { fetchAllProducts } = useProducts();
const { deleteProduct, archiveProduct, restoreProduct } = useAdminProducts();

const products = ref<Product[]>([]);
const pagination = ref<any>(null);
const currentPage = ref(1);
const productToDelete = ref<Product | null>(null);
const quickViewProduct = ref<Product | null>(null);
const deleting = ref(false);
const toast = useToast();

const load = async () => {
  const result = await fetchAllProducts({ page: currentPage.value, limit: 10 });
  products.value = result.data;
  pagination.value = result.meta;
};

const goToPage = (page: number) => {
  currentPage.value = page;
  load();
};

const openQuickView = (product: Product) => {
  quickViewProduct.value = product;
};

const askDelete = (product: Product) => {
  productToDelete.value = product;
};

const confirmDelete = async () => {
  if (!productToDelete.value) return;

  deleting.value = true;
  try {
    await deleteProduct(productToDelete.value.id);
    toast.success('Produit supprimé avec succès.');
    productToDelete.value = null;
    await load();
  } catch (error: any) {
    toast.error(getApiErrorMessage(error));
    productToDelete.value = null;
  } finally {
    deleting.value = false;
  }
};

const handleArchive = async (id: string) => {
  try {
    await archiveProduct(id);
    await load();
    toast.success('Produit archivé avec succès.');
  } catch (error: any) {
    toast.error(getApiErrorMessage(error));
  }
};

const handleRestore = async (id: string) => {
  try {
    await restoreProduct(id);
    await load();
    toast.success('Produit réactivé avec succès.');
  } catch (error: any) {
    toast.error(getApiErrorMessage(error));
  }
};

onMounted(load);
</script>