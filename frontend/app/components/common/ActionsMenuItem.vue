<template>
  <button
    @click="$emit('click')"
    class="w-full text-left px-4 py-2 text-sm hover:bg-mist transition-colors"
    :class="danger ? 'text-clay' : 'text-ink'"
  >
    {{ label }}
  </button>
</template>

<script setup lang="ts">
defineProps<{ label: string; danger?: boolean }>();
defineEmits<{ click: [] }>();
</script>