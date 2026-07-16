<template>
  <button
    @click="$emit('select', label)"
    class="text-xs px-3 py-1.5 rounded-full border border-mist bg-white hover:border-sage hover:bg-sage/5 transition text-ink/70 hover:text-sage-dark"
  >
    {{ label }}
  </button>
</template>

<script setup lang="ts">
defineProps<{ label: string }>();
defineEmits<{ select: [label: string] }>();
</script>