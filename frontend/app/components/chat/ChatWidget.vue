<template>
  <div>
    <!-- Bouton flottant -->
    <button
      @click="handleToggle"
      class="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 w-14 h-14 rounded-full bg-sage text-white shadow-lg shadow-sage/20 flex items-center justify-center hover:bg-sage-dark hover:scale-105 active:scale-95 transition-all"
      :aria-label="chatStore.isOpen ? 'Fermer le chat' : 'Ouvrir le chat'"
    >
      <Transition name="icon-swap" mode="out-in">
        <svg v-if="!chatStore.isOpen" key="chat" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <svg v-else key="close" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </Transition>

      <!-- Badge non-lu -->
      <span
        v-if="hasUnread"
        class="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-clay border-2 border-white"
      />
    </button>

    <!-- Panneau de conversation -->
    <Transition name="panel">
      <div
        v-if="chatStore.isOpen"
        class="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 z-40 sm:w-[400px] w-full h-full sm:h-[600px] sm:max-h-[calc(100vh-8rem)] bg-white sm:rounded-3xl border border-mist shadow-2xl flex flex-col overflow-hidden"
      >
        <!-- Header -->
        <div class="bg-gradient-to-r from-sage to-sage-dark px-4 py-4 flex items-center justify-between shrink-0">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2a4 4 0 00-4 4v2H6a2 2 0 00-2 2v9a2 2 0 002 2h12a2 2 0 002-2v-9a2 2 0 00-2-2h-2V6a4 4 0 00-4-4zm-2 6V6a2 2 0 114 0v2h-4z" />
              </svg>
            </div>
            <div>
              <p class="font-medium text-sm text-white">Assistant Parapharmacie</p>
              <p class="text-xs text-white/70">En ligne</p>
            </div>
          </div>
          <div class="flex items-center gap-1">
            <button
              v-if="chatStore.messages.length > 0"
              @click="chatStore.resetConversation()"
              class="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition"
              aria-label="Nouvelle conversation"
              title="Nouvelle conversation"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              @click="chatStore.toggleOpen()"
              class="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition sm:hidden"
              aria-label="Fermer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Messages -->
        <div ref="scrollContainer" class="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-cream/30">
          <div v-if="chatStore.messages.length === 0" class="flex flex-col items-center text-center gap-4 py-6">
            <div class="w-12 h-12 rounded-full bg-sage/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-sage-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <p class="text-sm text-ink/60 max-w-[240px]">
              Bonjour ! Dites-moi ce que vous cherchez et je vous propose des produits adaptés.
            </p>
            <div class="flex flex-wrap justify-center gap-2">
              <ChatSuggestionChip label="Peau sèche" @select="quickSend" />
              <ChatSuggestionChip label="Douleurs musculaires" @select="quickSend" />
              <ChatSuggestionChip label="Problèmes de sommeil" @select="quickSend" />
            </div>
          </div>

          <ChatMessageBubble
            v-for="(msg, idx) in chatStore.messages"
            :key="idx"
            :role="msg.role"
            :content="msg.content"
          />

          <ChatTypingIndicator v-if="chatStore.sending" />

          <p v-if="chatStore.error" class="text-clay text-xs text-center bg-clay/10 rounded-lg px-3 py-2">
            {{ chatStore.error }}
          </p>
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
const scrollContainer = ref<HTMLElement | null>(null);
const inputRef = ref<InstanceType<typeof import('./ChatInput.vue').default> | null>(null);
const hasUnread = ref(false);

const scrollToBottom = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
  }
};

const handleSend = async (text: string) => {
  await chatStore.sendMessage(text);
  await nextTick();
  scrollToBottom();
};

const quickSend = async (label: string) => {
  await chatStore.sendMessage(label);
  await nextTick();
  scrollToBottom();
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

// Marque comme "non lu" si un message arrive alors que le panneau est fermé
watch(
  () => chatStore.messages.length,
  async (newLen, oldLen) => {
    if (chatStore.isOpen) {
      await nextTick();
      scrollToBottom();
    } else if (newLen > oldLen) {
      hasUnread.value = true;
    }
  },
);

// Fermeture au clavier (Échap)
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && chatStore.isOpen) {
    chatStore.toggleOpen();
  }
};

onMounted(() => window.addEventListener('keydown', handleKeydown));
onUnmounted(() => window.removeEventListener('keydown', handleKeydown));
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

@media (prefers-reduced-motion: reduce) {
  .panel-enter-active,
  .panel-leave-active,
  .icon-swap-enter-active,
  .icon-swap-leave-active {
    transition: none;
  }
}
</style>