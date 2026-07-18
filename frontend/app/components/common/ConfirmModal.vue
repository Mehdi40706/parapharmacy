<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4"
        @click.self="$emit('cancel')"
      >
        <div class="bg-white rounded-2xl p-6 max-w-sm w-full">
          <h2 class="font-display font-semibold text-lg mb-2">{{ title }}</h2>
          <p class="text-ink/60 text-sm mb-6">
            <slot>{{ message }}</slot>
          </p>
          <div class="flex gap-3">
            <button
              @click="$emit('cancel')"
              class="btn-secondary flex-1"
              :disabled="loading"
            >
              {{ cancelLabel }}
            </button>
            <button
              @click="$emit('confirm')"
              class="btn-primary bg-clay hover:bg-clay/90 flex-1"
              :disabled="loading"
            >
              {{ loading ? loadingLabel : confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    open: boolean;
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    loadingLabel?: string;
    loading?: boolean;
  }>(),
  {
    title: 'Confirmer la suppression',
    message: 'Cette action est irréversible.',
    confirmLabel: 'Supprimer',
    cancelLabel: 'Annuler',
    loadingLabel: 'Suppression...',
    loading: false,
  },
);

defineEmits<{ confirm: []; cancel: [] }>();
</script>