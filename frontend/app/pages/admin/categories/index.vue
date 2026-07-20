<template>
  <div>
    <h1 class="text-2xl font-semibold mb-6">Catégories</h1>

    <div class="bg-white rounded-2xl border border-mist p-6 mb-6">
      <form @submit.prevent="handleCreate" class="flex gap-3">
        <input v-model="newName" type="text" placeholder="Nom de la catégorie" required class="input-field" />
        <button type="submit" class="btn-primary whitespace-nowrap">Ajouter</button>
      </form>
    </div>

    <div class="bg-white rounded-2xl border border-mist divide-y divide-mist">
      <div v-for="cat in categories" :key="cat.id" class="p-4 flex items-center justify-between">
        <div v-if="editingId !== cat.id">
          <span class="font-medium">{{ cat.name }}</span>
        </div>
        <input v-else v-model="editName" class="input-field text-sm max-w-xs" />

        <div class="flex items-center gap-2">
  <template v-if="editingId === cat.id">
    <button
      @click="saveEdit(cat.id)"
      class="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-600 transition-all duration-200 hover:bg-emerald-100 hover:shadow-sm"
    >
      <Icon name="lucide:check" class="w-4 h-4" />
      <span>Sauvegarder</span>
    </button>

    <button
      @click="editingId = null"
      class="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-200 hover:shadow-sm"
    >
      <Icon name="lucide:x" class="w-4 h-4" />
      <span>Annuler</span>
    </button>
  </template>

  <template v-else>
    <button
      @click="startEdit(cat)"
      class="inline-flex items-center gap-2 rounded-lg bg-sky-50 px-3 py-2 text-sm font-medium text-sky-600 transition-all duration-200 hover:bg-sky-100 hover:shadow-sm"
    >
      <Icon name="lucide:pencil" class="w-4 h-4" />
      <span>Modifier</span>
    </button>

    <button
      @click="askDelete(cat)"
      class="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-100 hover:shadow-sm"
    >
      <Icon name="lucide:trash-2" class="w-4 h-4" />
      <span>Supprimer</span>
    </button>
  </template>
</div>
      </div>
    </div>

    <ConfirmModal
      :open="!!categoryToDelete"
      title="Supprimer la catégorie ?"
      :loading="deleting"
      @cancel="categoryToDelete = null"
      @confirm="confirmDelete"
    >
      Cette action est irréversible. Voulez-vous vraiment supprimer
      <span class="font-medium text-ink">{{ categoryToDelete?.name }}</span> ?
    </ConfirmModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' });

import ConfirmModal from '~/components/common/ConfirmModal.vue';
import { useToast } from '~/composables/useToast';
import type { Category } from '~/types/product';

const { fetchCategories } = useCategories();
const { createCategory, updateCategory, deleteCategory } = useAdminCategories();

const categories = ref<Category[]>([]);
const newName = ref('');
const editingId = ref<string | null>(null);
const editName = ref('');
const categoryToDelete = ref<Category | null>(null);
const deleting = ref(false);
const toast = useToast();

const load = async () => {
  categories.value = await fetchCategories();
};

const handleCreate = async () => {
  try {
    await createCategory(newName.value);
    toast.success(`Catégorie "${newName.value}" créée avec succès.`);
    newName.value = '';
    await load();
  } catch (error: any) {
    toast.error(
      error?.data?.message ??
      error?.response?.data?.message ??
      'Une erreur est survenue.'
    );
  }
};

const startEdit = (cat: Category) => {
  editingId.value = cat.id;
  editName.value = cat.name;
};

const saveEdit = async (id: string) => {
  try {
    await updateCategory(id, editName.value);
    toast.success('Catégorie mise à jour avec succès.');
    editingId.value = null;
    await load();
  } catch (error: any) {
    toast.error(
      error?.data?.message ??
      error?.response?.data?.message ??
      'Une erreur est survenue.'
    );
  }
};

const askDelete = (cat: Category) => {
  categoryToDelete.value = cat;
};

const confirmDelete = async () => {
  if (!categoryToDelete.value) return;

  deleting.value = true;
  try {
    await deleteCategory(categoryToDelete.value.id);
    toast.success('Catégorie supprimée avec succès.');
    categoryToDelete.value = null;
    await load();
  } catch (error: any) {
    toast.error(
      error?.data?.message ??
      error?.response?.data?.message ??
      'Une erreur est survenue.'
    );
    categoryToDelete.value = null;
  } finally {
    deleting.value = false;
  }
};

onMounted(load);
</script>