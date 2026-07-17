<template>
  <div ref="widgetRoot">
    <!-- Bouton flottant -->
    <button
      @click="handleToggle"
      class="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-sage via-sage to-sage-dark text-white shadow-xl shadow-sage-dark/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform ring-4 ring-white/40"
      :aria-label="chatStore.isOpen ? 'Fermer le chat' : 'Ouvrir le chat'"
    >
      <span
        v-if="hasUnread && !chatStore.isOpen"
        class="absolute inset-0 rounded-full bg-sage animate-ping-slow"
        aria-hidden="true"
      />

      <Transition name="icon-swap" mode="out-in">
        <svg v-if="!chatStore.isOpen" key="chat" xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 2a4 4 0 00-4 4v2H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2v-9a2 2 0 00-2-2h-2V6a4 4 0 00-4-4zm-2 6V6a2 2 0 114 0v2h-4z" />
        </svg>
        <svg v-else key="close" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </Transition>

      <!-- Badge non-lu -->
      <span
        v-if="hasUnread"
        class="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-clay border-2 border-white flex items-center justify-center"
      >
        <span class="w-1.5 h-1.5 rounded-full bg-white" />
      </span>
    </button>

    <!-- Panneau de conversation -->
    <Transition name="panel">
      <div
        v-if="chatStore.isOpen"
        class="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 z-40 sm:w-[400px] w-full h-full sm:h-[620px] sm:max-h-[calc(100vh-8rem)] bg-white sm:rounded-[28px] border border-mist shadow-2xl flex flex-col overflow-hidden"
      >
        <!-- Header -->
        <div class="relative bg-gradient-to-br from-sage to-sage-dark px-4 pt-4 pb-6 shrink-0 overflow-hidden">
          <!-- Motif décoratif en arrière-plan -->
          <div class="absolute inset-0 opacity-[0.07] pointer-events-none" aria-hidden="true">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="cross-pattern" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                  <path d="M14 8v12M8 14h12" stroke="white" stroke-width="1.5" stroke-linecap="round" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cross-pattern)" />
            </svg>
          </div>

          <div class="relative flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/25">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M12 2a4 4 0 00-4 4v2H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2v-9a2 2 0 00-2-2h-2V6a4 4 0 00-4-4zm-2 6V6a2 2 0 114 0v2h-4z" />
                </svg>
              </div>
              <div>
                <p class="font-medium text-sm text-white">Assistant Parapharmacie</p>
                <p class="text-xs text-white/75 flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-green-300 inline-block" aria-hidden="true" />
                  En ligne
                </p>
              </div>
            </div>
            <div class="flex items-center gap-1">
              <button
                v-if="chatStore.messages.length > 0"
                @click="chatStore.resetConversation()"
                class="w-8 h-8 rounded-full flex items-center justify-center text-white/75 hover:text-white hover:bg-white/10 transition"
                aria-label="Nouvelle conversation"
                title="Nouvelle conversation"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                @click="chatStore.toggleOpen()"
                class="w-8 h-8 rounded-full flex items-center justify-center text-white/75 hover:text-white hover:bg-white/10 transition sm:hidden"
                aria-label="Fermer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Séparateur en vague, écho du bord perforé du footer -->
        <svg class="block -mt-4 shrink-0" viewBox="0 0 400 16" preserveAspectRatio="none" style="width: 100%; height: 16px;" aria-hidden="true">
          <path d="M0 16 Q 20 0 40 16 Q 60 0 80 16 Q 100 0 120 16 Q 140 0 160 16 Q 180 0 200 16 Q 220 0 240 16 Q 260 0 280 16 Q 300 0 320 16 Q 340 0 360 16 Q 380 0 400 16 L400 16 L0 16 Z" fill="white" />
        </svg>

        <!-- Messages -->
        <div class="relative flex-1 min-h-0">
          <div
            ref="scrollContainer"
            @scroll="handleScroll"
            class="h-full overflow-y-auto px-4 pb-4 pt-1 flex flex-col gap-3 bg-cream/40"
            role="log"
            aria-live="polite"
            aria-label="Conversation avec l'assistant"
          >
            <div v-if="chatStore.messages.length === 0" class="flex flex-col items-center text-center gap-4 py-8">
              <div class="w-14 h-14 rounded-full bg-gradient-to-br from-sage/15 to-honey/20 flex items-center justify-center ring-1 ring-sage/10">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-sage-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <p class="text-sm text-ink/60 max-w-[240px] leading-relaxed">
                Bonjour ! Dites-moi ce que vous cherchez et je vous propose des produits adaptés.
              </p>
              <div class="flex flex-wrap justify-center gap-2">
                <ChatSuggestionChip label="Peau sèche" @select="quickSend" />
                <ChatSuggestionChip label="Douleurs musculaires" @select="quickSend" />
                <ChatSuggestionChip label="Problèmes de sommeil" @select="quickSend" />
              </div>
            </div>

            <TransitionGroup name="msg">
              <ChatMessageBubble
                v-for="(msg, idx) in chatStore.messages"
                :key="idx"
                :role="msg.role"
                :content="msg.content"
              />
            </TransitionGroup>

            <ChatTypingIndicator v-if="chatStore.sending" />

            <p v-if="chatStore.error" class="text-clay text-xs text-center bg-clay/10 rounded-lg px-3 py-2">
              {{ chatStore.error }}
            </p>
          </div>

          <!-- Pastille "nouveau message" quand l'utilisateur a remonté dans l'historique -->
          <Transition name="pill">
            <button
              v-if="showScrollToBottom"
              @click="scrollToBottom(true)"
              class="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-sage-dark text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-md hover:bg-sage transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              Nouveau message
            </button>
          </Transition>
        </div>

        <!-- Input -->
        <ChatInput ref="inputRef" :disabled="chatStore.sending" @send="handleSend" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from '~/stores/chat.js';

const chatStore = useChatStore();
const widgetRoot = ref<HTMLElement | null>(null);
const scrollContainer = ref<HTMLElement | null>(null);
const inputRef = ref<InstanceType<typeof import('./ChatInput.vue').default> | null>(null);
const hasUnread = ref(false);
const isNearBottom = ref(true);
const showScrollToBottom = ref(false);

const SCROLL_THRESHOLD_PX = 80;

const checkNearBottom = () => {
  const el = scrollContainer.value;
  if (!el) return true;
  return el.scrollHeight - el.scrollTop - el.clientHeight < SCROLL_THRESHOLD_PX;
};

const scrollToBottom = (smooth = false) => {
  const el = scrollContainer.value;
  if (!el) return;
  el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
  showScrollToBottom.value = false;
};

const handleScroll = () => {
  isNearBottom.value = checkNearBottom();
  if (isNearBottom.value) {
    showScrollToBottom.value = false;
  }
};

const handleSend = async (text: string) => {
  await nextTick();
  scrollToBottom();
  await chatStore.sendMessage(text);
};

const quickSend = async (label: string) => {
  await chatStore.sendMessage(label);
};

const handleToggle = () => {
  chatStore.toggleOpen();
  hasUnread.value = false;
  if (chatStore.isOpen) {
    nextTick(() => {
      scrollToBottom();
      inputRef.value?.focus();
    });
  }
};

// Défilement intelligent : on ne force le scroll que si l'utilisateur est déjà
// proche du bas, ou si c'est son propre message qui vient d'être envoyé.
watch(
  () => chatStore.messages.length,
  async (newLen, oldLen) => {
    if (newLen <= oldLen) return;

    const lastMessage = chatStore.messages[chatStore.messages.length - 1];

    if (!chatStore.isOpen) {
      hasUnread.value = true;
      return;
    }

    await nextTick();

    if (lastMessage?.role === 'user' || isNearBottom.value) {
      scrollToBottom(true);
    } else {
      showScrollToBottom.value = true;
    }
  },
);

// Fermeture au clavier (Échap)
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && chatStore.isOpen) {
    chatStore.toggleOpen();
  }
};

// Fermeture au clic en dehors du widget (bouton + panneau)
const handleClickOutside = (e: MouseEvent) => {
  if (!chatStore.isOpen) return;
  const target = e.target as Node;
  if (widgetRoot.value && !widgetRoot.value.contains(target)) {
    chatStore.toggleOpen();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
  document.addEventListener('mousedown', handleClickOutside);
});
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>

<style scoped>
.panel-enter-active,
.panel-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}

.icon-swap-enter-active,
.icon-swap-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.icon-swap-enter-from,
.icon-swap-leave-to {
  opacity: 0;
  transform: rotate(-45deg);
}

.msg-enter-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.msg-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.msg-leave-active {
  transition: opacity 0.15s ease;
  position: absolute;
}
.msg-leave-to {
  opacity: 0;
}

.pill-enter-active,
.pill-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.pill-enter-from,
.pill-leave-to {
  opacity: 0;
  transform: translate(-50%, 6px);
}

@keyframes ping-slow {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.6);
    opacity: 0;
  }
}
.animate-ping-slow {
  animation: ping-slow 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@media (prefers-reduced-motion: reduce) {
  .panel-enter-active,
  .panel-leave-active,
  .icon-swap-enter-active,
  .icon-swap-leave-active,
  .msg-enter-active,
  .msg-leave-active,
  .pill-enter-active,
  .pill-leave-active {
    transition: none;
  }
  .animate-ping-slow {
    animation: none;
  }
}
</style>