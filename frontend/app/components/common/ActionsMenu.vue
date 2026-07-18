<template>
  <div class="relative" ref="menuRef">
    <button
      @click="open = !open"
      class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-mist transition-colors"
      aria-label="Actions"
    >
    <Icon name="lucide:ellipsis-vertical" class="w-5 h-5 text-gray-600" />
    </button>

    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="open"
        class="absolute right-0 mt-1 w-44 bg-white rounded-xl border border-mist shadow-lg py-1 z-20"
      >
        <slot :close="() => (open = false)" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';

const open = ref(false);
const menuRef = ref(null);

onClickOutside(menuRef, () => {
  open.value = false;
});
</script>