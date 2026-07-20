<template>
  <div class="relative" ref="menuRef">
    <button
      @click="open = !open"
      class="flex h-9 w-9 items-center justify-center rounded-xl border border-transparent text-slate-500 transition-all duration-200 hover:border-slate-200 hover:bg-slate-100 hover:text-slate-700"
      aria-label="Actions"
    >
      <Icon name="lucide:ellipsis" class="h-5 w-5" />
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
      class="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-black/5 z-20"
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