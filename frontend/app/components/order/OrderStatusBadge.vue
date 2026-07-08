<template>
  <span class="badge-pill" :class="colorClass">{{ label }}</span>
</template>

<script setup lang="ts">
const props = defineProps<{ status: string }>();

const map: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'En attente', color: 'bg-honey/10 text-honey-dark' },
  CONFIRMED: { label: 'Confirmée', color: 'bg-sage/10 text-sage-dark' },
  PROCESSING: { label: 'En préparation', color: 'bg-sage/10 text-sage-dark' },
  SHIPPED: { label: 'Expédiée', color: 'bg-sage/10 text-sage-dark' },
  DELIVERED: { label: 'Livrée', color: 'bg-sage text-white' },
  CANCELLED: { label: 'Annulée', color: 'bg-clay/10 text-clay' },
};

const label = computed(() => map[props.status]?.label || props.status);
const colorClass = computed(() => map[props.status]?.color || 'bg-mist text-ink/60');
</script>