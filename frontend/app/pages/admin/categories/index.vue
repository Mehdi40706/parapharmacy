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

        <div class="flex gap-3 text-sm">
          <template v-if="editingId === cat.id">
            <button @click="saveEdit(cat.id)" class="text-sage hover:underline">Sauvegarder</button>
            <button @click="editingId = null" class="text-ink/50 hover:underline">Annuler</button>
          </template>
          <template v-else>
            <button @click="startEdit(cat)" class="text-sage hover:underline">Modifier</button>
            <button @click="askDelete(cat)" class="text-clay hover:underline">Supprimer</button>
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