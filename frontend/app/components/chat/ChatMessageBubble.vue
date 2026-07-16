<template>
  <div class="flex gap-2" :class="isUser ? 'justify-end' : 'justify-start'">
    <div
      v-if="!isUser"
      class="w-7 h-7 rounded-full bg-sage/15 flex items-center justify-center shrink-0 mt-0.5"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-sage-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2a4 4 0 00-4 4v2H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2v-9a2 2 0 00-2-2h-2V6a4 4 0 00-4-4zm-2 6V6a2 2 0 114 0v2h-4z" />
      </svg>
    </div>

    <div
      class="max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed"
      :class="isUser
        ? 'bg-sage text-white rounded-tr-sm'
        : 'bg-mist/50 text-ink rounded-tl-sm'"
    >
      <span v-html="renderedContent" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  role: 'user' | 'assistant';
  content: string;
}>();

const isUser = computed(() => props.role === 'user');

// Échappe tout le HTML d'abord (sécurité), puis n'autorise qu'un seul pattern précis
// [texte](/produits/ID) à devenir un lien cliquable stylé.
const renderedContent = computed(() => {
  const escaped = props.content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  const linkClass = isUser.value
    ? 'underline decoration-white/50 font-medium text-white hover:decoration-white'
    : 'underline decoration-sage/40 font-medium text-sage-dark hover:decoration-sage';

  return escaped.replace(
    /\[([^\]]+)\]\((\/produits\/[a-zA-Z0-9-]+)\)/g,
    `<a href="$2" class="${linkClass}">$1</a>`,
  );
});
</script>