<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="show"
      class="fixed inset-0 z-[100]  backdrop-blur-sm flex items-center justify-center"
    >
      <div class="flex flex-col items-center gap-3 px-6 text-center">
        <div class="w-10 h-10 border-[3px] border-sage/20 border-t-sage rounded-full animate-spin" />
        <p class="text-ink/60 text-sm font-medium">{{ label }}</p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ show: boolean; label?: string }>(), {
  label: 'Chargement...',
});

// Empêche le scroll du body pendant que le loader plein écran est affiché
watch(
  () => props.show,
  (show) => {
    if (import.meta.client) {
      document.body.style.overflow = show ? 'hidden' : '';
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  if (import.meta.client) {
    document.body.style.overflow = '';
  }
});
</script>