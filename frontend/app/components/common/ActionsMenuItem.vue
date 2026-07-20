<template>
  <button
    @click="$emit('click')"
    class="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200"
    :class="danger
      ? 'text-red-600 hover:bg-red-50'
      : 'text-slate-700 hover:bg-slate-100'"
  >
    <Icon
      :name="icon"
      class="h-4 w-4 transition-transform duration-200 group-hover:scale-110"
    />

    <span class="flex-1 text-left">
      {{ label }}
    </span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  icon: string
  danger?: boolean
}>()

defineEmits<{
  click: []
}>()
</script>