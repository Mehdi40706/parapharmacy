<template>
  <form @submit.prevent="handleSubmit" class="border-t border-mist p-3 flex gap-2 items-end bg-white">
    <textarea
      ref="textareaRef"
      v-model="draft"
      rows="1"
      placeholder="Décrivez ce que vous cherchez..."
      class="flex-1 resize-none border border-mist rounded-2xl px-3.5 py-2.5 text-sm max-h-28 placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-sage/25 focus:border-sage transition-[border-color,box-shadow,height] duration-150"
      :disabled="disabled"
      @keydown.enter.exact.prevent="handleSubmit"
      @input="autoGrow"
    />
    <button
      type="submit"
      :disabled="disabled || !draft.trim()"
      class="shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-sage to-sage-dark text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed disabled:grayscale hover:scale-105 active:scale-95 transition-transform"
      aria-label="Envoyer"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </button>
  </form>
</template>

<script setup lang="ts">
const props = defineProps<{ disabled: boolean; modelValue?: string }>();
const emit = defineEmits<{ send: [text: string]; 'update:modelValue': [text: string] }>();

const draft = ref(props.modelValue ?? '');
const textareaRef = ref<HTMLTextAreaElement | null>(null);

watch(draft, (val) => emit('update:modelValue', val));
watch(() => props.modelValue, (val) => {
  if (val !== undefined && val !== draft.value) draft.value = val;
});

const autoGrow = () => {
  const el = textareaRef.value;
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = `${Math.min(el.scrollHeight, 112)}px`;
};

const handleSubmit = () => {
  const text = draft.value.trim();
  if (!text || props.disabled) return;
  emit('send', text);
  draft.value = '';
  nextTick(() => {
    if (textareaRef.value) textareaRef.value.style.height = 'auto';
  });
};

defineExpose({ focus: () => textareaRef.value?.focus() });
</script>