<template>
  <div ref="widgetRoot">
    <!-- Bouton flottant -->
    <button
      @click="handleToggle"
      class="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2 bg-sage text-white shadow-lg shadow-ink/10 hover:shadow-xl hover:shadow-ink/15 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sage/40"
      :class="chatStore.isOpen
        ? 'w-14 h-14 rounded-full justify-center'
        : 'h-14 pl-4 pr-5 rounded-full'"
      style="margin-bottom: env(safe-area-inset-bottom, 0px);"
      :aria-label="chatStore.isOpen ? 'Fermer le chat' : 'Ouvrir l\'assistant'"
    >
      <span
        v-if="hasUnread && !chatStore.isOpen"
        class="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-clay border-2 border-white"
        aria-hidden="true"
      />

      <Transition name="icon-swap" mode="out-in">
        <div v-if="!chatStore.isOpen" key="open" class="flex items-center gap-2">
          <Icon name="lucide:bot" class="w-5 h-5 shrink-0" />
          <span class="text-sm font-medium whitespace-nowrap">Assistant</span>
        </div>
        <Icon v-else key="close" name="lucide:x" class="w-6 h-6" />
      </Transition>
    </button>

    <!-- Panneau de conversation -->
    <Transition name="panel">
      <div
        v-if="chatStore.isOpen"
        class="fixed bottom-24 right-4 left-4 sm:left-auto sm:right-6 z-40 sm:w-[400px] w-auto h-[70dvh] sm:h-[620px] max-h-[calc(100dvh-7rem)] sm:max-h-[calc(100vh-8rem)] bg-white rounded-[24px] sm:rounded-[28px] border border-mist shadow-2xl flex flex-col overflow-hidden"
        style="padding-top: env(safe-area-inset-top); padding-bottom: env(safe-area-inset-bottom);"
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
                <Icon name="lucide:bot" class="w-5 h-5 text-white" />
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
                class="w-8 h-8 rounded-full flex items-center justify-center text-white/75 hover:text-white hover:bg-white/10 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                aria-label="Nouvelle conversation"
                title="Nouvelle conversation"
              >
                <Icon name="lucide:rotate-ccw" class="w-4 h-4" />
              </button>
              <button
                @click="chatStore.toggleOpen()"
                class="w-8 h-8 rounded-full flex items-center justify-center text-white/75 hover:text-white hover:bg-white/10 transition sm:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                aria-label="Fermer"
              >
                <Icon name="lucide:x" class="w-4 h-4" />
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
            @click="handleMessageClick"
            @scroll="handleScroll"
            class="h-full overflow-y-auto px-4 pb-4 pt-1 flex flex-col gap-3 bg-cream/40"
            role="log"
            aria-live="polite"
            aria-label="Conversation avec l'assistant"
          >
            <div v-if="chatStore.messages.length === 0" class="flex flex-col items-center text-center gap-4 py-8">
              <div class="w-14 h-14 rounded-full bg-gradient-to-br from-sage/15 to-honey/20 flex items-center justify-center ring-1 ring-sage/10">
                <Icon name="lucide:sparkles" class="w-7 h-7 text-sage-dark" />
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
              <div v-for="(msg, idx) in chatStore.messages" :key="idx" class="flex flex-col gap-2">
                <ChatMessageBubble
                  :role="msg.role"
                  :content="msg.content"
                  @reveal="handleReveal"
                />

                <div
                  v-if="msg.role === 'assistant' && msg.products?.length"
                  class="flex flex-col gap-2 ml-9"
                >
                  <ChatProductCard
                    v-for="product in msg.products"
                    :key="product.id"
                    :product="product"
                    @quickview="quickviewProduct = $event"
                  />
                </div>
              </div>
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
              class="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-sage-dark text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-md hover:bg-sage transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-dark/50 focus-visible:ring-offset-2"
            >
              <Icon name="lucide:arrow-down" class="w-3.5 h-3.5" />
              Nouveau message
            </button>
          </Transition>
        </div>

        <!-- Input -->
        <ChatInput ref="inputRef" :disabled="chatStore.sending" @send="handleSend" />
      </div>
    </Transition>

    <!-- Quickview produit -->
    <ChatQuickviewModal :product="quickviewProduct" @close="quickviewProduct = null" />
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from '~/stores/chat.js';
import ChatMessageBubble from './ChatMessageBubble.vue';
import ChatProductCard from './ChatProductCard.vue';
import ChatQuickviewModal from './ChatQuickviewModal.vue';
import type { ChatProduct } from '~/composables/useChat';

const chatStore = useChatStore();
const widgetRoot = ref<HTMLElement | null>(null);
const scrollContainer = ref<HTMLElement | null>(null);
const inputRef = ref<InstanceType<typeof import('./ChatInput.vue').default> | null>(null);
const hasUnread = ref(false);
const isNearBottom = ref(true);
const showScrollToBottom = ref(false);
const quickviewProduct = ref<ChatProduct | null>(null);

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

// Suit le scroll en continu pendant l'effet machine à écrire (mot par mot),
// mais seulement si l'utilisateur est déjà proche du bas — on ne lui vole
// jamais le contrôle s'il est en train de relire un message plus haut.
const handleReveal = () => {
  if (isNearBottom.value) {
    scrollToBottom();
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

// Fermeture au clavier (Échap) — ferme d'abord le quickview s'il est ouvert,
// sinon ferme le panneau de chat
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key !== 'Escape') return;
  if (quickviewProduct.value) {
    quickviewProduct.value = null;
  } else if (chatStore.isOpen) {
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

// Conservé en filet de sécurité si jamais le modèle génère quand même un lien
// markdown [texte](/produits/ID) malgré la consigne du prompt de ne plus le faire.
const handleMessageClick = (e: MouseEvent) => {
  const link = (e.target as HTMLElement).closest('a');
  if (!link) return;

  const href = link.getAttribute('href');
  if (href && href.startsWith('/produits/')) {
    e.preventDefault();
    navigateTo(href);
  }
};

onMounted(() => {
  chatStore.hydrate();
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