<template>
    <button
    @click="handleClick"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
    class="inline-flex items-center gap-2 pl-3 pr-4 py-2 rounded-full border border-mist bg-white text-sm font-medium text-ink/70 hover:text-sage-dark hover:border-sage/40 hover:bg-sage/5 active:scale-[0.97] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/40"
    >
    <Icon
      name="lucide:arrow-left"
      class="w-4 h-4 shrink-0 transition-transform duration-150"
      :class="hovering ? '-translate-x-0.5' : ''"
    />
    {{ label }}
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string;
    fallback?: string;
  }>(),
  {
    label: 'Retour',
    fallback: '/',
  },
);

const router = useRouter();
const hovering = ref(false);

const handleClick = () => {
  if (window.history.state?.back) {
    router.back();
  } else {
    router.push(props.fallback);
  }
};
</script>