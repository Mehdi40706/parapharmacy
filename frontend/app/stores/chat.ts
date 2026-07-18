// stores/chat.ts
import { defineStore } from 'pinia';
import type { ChatMessage } from '~/composables/useChat';

const STORAGE_KEY = 'chat_messages';

const loadFromSession = (): ChatMessage[] => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveToSession = (messages: ChatMessage[]) => {
  if (!import.meta.client) return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // sessionStorage plein/indisponible — on ignore silencieusement
  }
};

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [] as ChatMessage[], // toujours vide au départ, cohérent SSR/client
    sending: false,
    error: '',
    isOpen: false,
    hydrated: false,
  }),

  actions: {
    // À appeler une seule fois, côté client uniquement, après le montage
    hydrate() {
      if (this.hydrated || !import.meta.client) return;
      this.messages = loadFromSession();
      this.hydrated = true;
    },

    toggleOpen() {
      this.isOpen = !this.isOpen;
    },

    async sendMessage(userText: string) {
      const text = userText.trim();
      if (!text || this.sending) return;

      const { sendMessage } = useChat();

      this.error = '';
      this.messages.push({ role: 'user', content: text });
      saveToSession(this.messages);
      this.sending = true;

      try {
        const response = await sendMessage(this.messages);
        this.messages.push({ role: 'assistant', content: response.reply });
        saveToSession(this.messages);
      } catch (err: any) {
        this.error = err?.data?.message || 'Une erreur est survenue, merci de réessayer.';
      } finally {
        this.sending = false;
      }
    },

    resetConversation() {
      this.messages = [];
      this.error = '';
      if (import.meta.client) {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    },
  },
});