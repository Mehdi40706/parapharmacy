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
      class="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center"
    >
      <div class="flex flex-col items-center gap-3">
        <div class="w-10 h-10 border-[3px] border-sage/20 border-t-sage rounded-full animate-spin" />
        <p class="text-ink/50 text-sm">{{ label }}</p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{ show: boolean; label?: string }>();
</script>