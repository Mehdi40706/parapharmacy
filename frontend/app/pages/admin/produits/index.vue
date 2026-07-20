<template>
  <div>
  <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
  <div class="flex items-center justify-between md:justify-start gap-4">
    <h1 class="text-2xl font-semibold">Produits</h1>
    <NuxtLink to="/admin/produits/nouveau" class="btn-primary md:hidden">+ Nouveau</NuxtLink>
  </div>

  <div class="relative w-full md:max-w-md">
    <Icon
      name="lucide:search"
      class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
    />
    <input
      v-model="search"
      @input="debouncedSearch"
      type="text"
      placeholder="Rechercher un produit..."
      class="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm shadow-sm transition focus:border-sage focus:ring-4 focus:ring-sage/20"
    />
  </div>

  <NuxtLink to="/admin/produits/nouveau" class="btn-primary hidden md:inline-block">+ Nouveau produit</NuxtLink>
</div>
    <!-- Vue tableau : desktop uniquement -->
    <div class="hidden md:block rounded-2xl border border-mist bg-white overflow-visible">     
      <table class="w-full text-sm min-w-[640px]">
        <thead class="bg-mist/50">
          <tr class="text-center">
            <th class="p-4">Nom</th>
            <th class="p-4">Catégorie</th>
            <th class="p-4">Prix</th>
            <th class="p-4">Stock</th>
            <th class="p-4">Statut</th>
            <th class="p-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id" class="border-t border-mist text-center">
            <td class="p-4">
              <button
                @click="openQuickView(product)"
                class="font-medium text-slate-900 hover:text-sage transition-colors cursor-pointer text-left"
              >
                {{ product.name }}
              </button>
            </td>            <td class="p-4 text-ink/60">{{ product.category.name }}</td>
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
                <NuxtLink
                  :to="`/admin/produits/${product.id}/edit`"
                  class="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  @click="close()"
                >
                  <Icon
                    name="lucide:pencil"
                    class="h-4 w-4 group-hover:scale-110 transition-transform"
                  />
                  Modifier
                </NuxtLink>

                <ActionsMenuItem
                  v-if="product.isActive"
                  label="Archiver"
                  icon="lucide:archive"
                  @click="handleArchive(product.id); close()"
                />

                <ActionsMenuItem
                  v-else
                  label="Réactiver"
                  icon="lucide:rotate-ccw"
                  @click="handleRestore(product.id); close()"
                />

                <div class="my-2 border-t border-slate-200"></div>

                <ActionsMenuItem
                  label="Supprimer"
                  icon="lucide:trash-2"
                  danger
                  @click="askDelete(product); close()"
                />

              </template>
            </ActionsMenu>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="!loading && products.length === 0" class="text-center py-12 text-ink/60 text-sm">
        Aucun produit ne correspond à votre recherche.
      </div>
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
              <NuxtLink
                :to="`/admin/produits/${product.id}/edit`"
                class="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                @click="close()"
              >
                <Icon
                  name="lucide:pencil"
                  class="h-4 w-4 group-hover:scale-110 transition-transform"
                />
                Modifier
              </NuxtLink>
              <ActionsMenuItem
                v-if="product.isActive"
                label="Archiver"
                icon="lucide:archive"
                @click="handleArchive(product.id); close()"
              />
              <ActionsMenuItem
                v-else
                label="Réactiver"
                icon="lucide:rotate-ccw"
                @click="handleRestore(product.id); close()"
              />
              <div class="my-2 border-t border-slate-200"></div>
              <ActionsMenuItem
                label="Supprimer"
                icon="lucide:trash-2"
                danger
                @click="askDelete(product); close()"
              />
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

      <div v-if="!loading && products.length === 0" class="text-center py-12 text-ink/60 text-sm">
        Aucun produit ne correspond à votre recherche.
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

import { useDebounceFn } from '@vueuse/core';
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
const loading = ref(true);
const toast = useToast();
const search = ref('');

const load = async () => {
  loading.value = true;
  try {
    const result = await fetchAllProducts({
      page: currentPage.value,
      limit: 10,
      search: search.value || undefined,
    });
    products.value = result.data;
    pagination.value = result.meta;
  } catch (error: any) {
    toast.error(getApiErrorMessage(error));
  } finally {
    loading.value = false;
  }
};

const debouncedSearch = useDebounceFn(() => {
  currentPage.value = 1;
  load();
}, 400);

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