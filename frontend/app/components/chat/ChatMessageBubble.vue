<template>
  <div class="flex gap-2 msg-bubble" :class="isUser ? 'justify-end' : 'justify-start'">
    <div
      v-if="!isUser"
      class="w-7 h-7 rounded-full bg-gradient-to-br from-sage/20 to-honey/20 flex items-center justify-center shrink-0 mt-0.5 ring-1 ring-sage/10"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-sage-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 2a4 4 0 00-4 4v2H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2v-9a2 2 0 00-2-2h-2V6a4 4 0 00-4-4zm-2 6V6a2 2 0 114 0v2h-4z" />
      </svg>
    </div>

    <div
      class="max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm"
      :class="isUser
        ? 'bg-gradient-to-br from-sage to-sage-dark text-white rounded-tr-sm'
        : 'bg-white border border-mist/70 text-ink rounded-tl-sm'"
    >
      <span v-html="renderedContent" /><span v-if="isRevealing" class="reveal-cursor" aria-hidden="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  role: 'user' | 'assistant';
  content: string;
}>();

const isUser = computed(() => props.role === 'user');

const WORD_DELAY_MS = 35;

// Découpe en alternant mots et blancs (espaces, retours à la ligne) pour
// pouvoir révéler mot par mot sans jamais casser le formatage d'origine.
const tokens = computed(() => props.content.split(/(\s+)/));

const revealCount = ref(isUser.value ? tokens.value.length : 0);
let timer: ReturnType<typeof setTimeout> | null = null;

const scheduleReveal = () => {
  if (revealCount.value >= tokens.value.length) return;
  const nextToken = tokens.value[revealCount.value];
  const delay = /^\s+$/.test(nextToken) ? 0 : WORD_DELAY_MS;
  timer = setTimeout(() => {
    revealCount.value++;
    scheduleReveal();
  }, delay);
};

onMounted(() => {
  if (!isUser.value) {
    scheduleReveal();
  }
});

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer);
});

const isRevealing = computed(() => !isUser.value && revealCount.value < tokens.value.length);

// Échappe tout le HTML d'abord (sécurité), convertit les retours à la ligne
// pour un affichage correct des réponses multi-paragraphes, puis n'autorise
// qu'un seul pattern précis [texte](/produits/ID) à devenir un lien cliquable.
const renderedContent = computed(() => {
  const revealedRaw = tokens.value.slice(0, revealCount.value).join('');

  const escaped = revealedRaw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  const linkClass = isUser.value
    ? 'underline decoration-white/50 font-medium text-white hover:decoration-white'
    : 'underline decoration-sage/40 font-medium text-sage-dark hover:decoration-sage';

  const withLinks = escaped.replace(
    /\[([^\]]+)\]\((\/produits\/[a-zA-Z0-9-]+)\)/g,
    `<a href="$2" class="${linkClass}">$1</a>`,
  );

  return withLinks.replace(/\n/g, '<br />');
});
</script>

<style scoped>
.msg-bubble {
  animation: bubble-in 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes bubble-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.reveal-cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  vertical-align: text-bottom;
  margin-left: 1px;
  background: currentColor;
  opacity: 0.5;
  animation: cursor-blink 0.9s infinite;
}

@keyframes cursor-blink {
  0%, 45% {
    opacity: 0.5;
  }
  50%, 95% {
    opacity: 0;
  }
  100% {
    opacity: 0.5;
  }
}

@media (prefers-reduced-motion: reduce) {
  .msg-bubble {
    animation: none;
  }
  .reveal-cursor {
    animation: none;
    opacity: 0;
  }
}
</style>