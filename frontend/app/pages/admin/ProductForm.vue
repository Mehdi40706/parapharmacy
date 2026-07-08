<template>
  <form @submit.prevent="submit" class="space-y-5 rounded-[2rem] border border-mist bg-white p-5 shadow-sm sm:p-6">
    <div class="space-y-2">
      <h2 class="text-xl font-semibold text-ink">Informations du produit</h2>
      <p class="text-sm text-ink/70">Remplissez les informations essentielles pour publier ou mettre à jour un produit.</p>
    </div>

    <div class="grid gap-4 lg:grid-cols-2">
      <div class="lg:col-span-2">
        <label class="mb-1.5 block text-sm font-medium text-ink">Nom du produit</label>
        <input v-model="form.name" type="text" required minlength="2" class="input-field" placeholder="Ex. Soin visage doux" />
      </div>

      <div class="lg:col-span-2">
        <label class="mb-1.5 block text-sm font-medium text-ink">Description</label>
        <textarea v-model="form.description" required rows="4" minlength="10" class="input-field" placeholder="Décrivez les bénéfices et l’utilisation du produit" />
      </div>

      <div>
        <label class="mb-1.5 block text-sm font-medium text-ink">Prix (TND)</label>
        <input v-model.number="form.price" type="number" step="0.01" min="0" required class="input-field" />
      </div>

      <div>
        <label class="mb-1.5 block text-sm font-medium text-ink">Stock</label>
        <input v-model.number="form.stock" type="number" min="0" required class="input-field" />
      </div>

      <div>
        <label class="mb-1.5 block text-sm font-medium text-ink">Catégorie</label>
        <select v-model="form.categoryId" required class="input-field" :disabled="isLoadingCategories">
          <option value="" disabled>Choisir une catégorie</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
        </select>
      </div>

      <div class="lg:col-span-2">
        <label class="mb-1.5 block text-sm font-medium text-ink">Image du produit</label>
        <div class="rounded-[1.25rem] border border-dashed border-mist bg-mist/20 p-4">
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="block w-full text-sm text-ink/70 file:mr-4 file:rounded-full file:border-0 file:bg-sage file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-sage-dark"
            @change="handleFileChange"
          />
          <p class="mt-2 text-sm text-ink/60">Formats acceptés : JPG, PNG, WebP. Taille maximale : 5 Mo.</p>
          <div v-if="uploading" class="mt-3 text-sm text-sage">Téléchargement en cours…</div>
          <div v-else-if="uploadError" class="mt-3 rounded-xl bg-clay/10 px-3 py-2 text-sm text-clay">{{ uploadError }}</div>
        </div>
      </div>

      <div class="lg:col-span-2">
        <label class="mb-1.5 block text-sm font-medium text-ink">URL image (optionnel)</label>
        <input v-model="form.imageUrl" type="text" class="input-field" placeholder="https://..." />
      </div>
    </div>

    <div v-if="form.imageUrl" class="rounded-[1.25rem] border border-mist bg-mist/20 p-3">
      <p class="mb-2 text-sm font-medium text-ink">Aperçu</p>
      <img :src="form.imageUrl" :alt="form.name || 'Image produit'" class="h-48 w-full rounded-[1rem] object-cover" @error="handleImageError" />
    </div>

    <p v-if="error" class="rounded-xl bg-clay/10 px-3 py-2 text-sm text-clay">{{ error }}</p>

    <div class="flex flex-col gap-3 border-t border-mist pt-4 sm:flex-row sm:justify-end">
      <NuxtLink to="/admin/produits" class="inline-flex items-center justify-center rounded-pill border border-mist bg-white px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-mist">
        Annuler
      </NuxtLink>
      <button type="submit" :disabled="loading" class="btn-primary">
        {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { Category } from '~/types/product';

const props = defineProps<{
  initial?: any;
  loading?: boolean;
  error?: string;
}>();

const emit = defineEmits<{ submit: [payload: any] }>();

const { fetchCategories } = useCategories();
const { uploadImage } = useStorage();
const categories = ref<Category[]>([]);
const isLoadingCategories = ref(true);
const fileInput = ref<HTMLInputElement | null>(null);
const uploading = ref(false);
const uploadError = ref('');

const form = reactive({
  name: props.initial?.name || '',
  description: props.initial?.description || '',
  price: props.initial?.price || 0,
  stock: props.initial?.stock || 0,
  categoryId: props.initial?.categoryId || props.initial?.category?.id || '',
  imageUrl: props.initial?.imageUrl || '',
});

watch(
  () => props.initial,
  (val) => {
    if (val) {
      Object.assign(form, {
        name: val.name || '',
        description: val.description || '',
        price: Number(val.price) || 0,
        stock: Number(val.stock) || 0,
        categoryId: val.categoryId || val.category?.id || '',
        imageUrl: val.imageUrl || '',
      });
    }
  },
  { deep: true },
);

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.style.display = 'none';
};

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return;

  uploading.value = true;
  uploadError.value = '';

  try {
    const result = await uploadImage(file);
    form.imageUrl = result.url;
  } catch (error: any) {
    uploadError.value = error?.data?.message || 'Impossible d’envoyer l’image';
  } finally {
    uploading.value = false;
    if (fileInput.value) fileInput.value.value = '';
  }
};

const submit = () => {
  const payload = {
    ...form,
    price: Number(form.price),
    stock: Number(form.stock),
    imageUrl: form.imageUrl?.trim() || undefined,
  };

  emit('submit', payload);
};

onMounted(async () => {
  try {
    categories.value = await fetchCategories();
  } finally {
    isLoadingCategories.value = false;
  }
});
</script>