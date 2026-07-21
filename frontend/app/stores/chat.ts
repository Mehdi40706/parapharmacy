// stores/chat.ts
import { defineStore } from 'pinia';
import type { ChatMessage, ChatProduct } from '~/composables/useChat';

interface ChatMessageWithProducts extends ChatMessage {
  products?: ChatProduct[];
}

const STORAGE_KEY = 'chat_messages';

const loadFromSession = (): ChatMessageWithProducts[] => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveToSession = (messages: ChatMessageWithProducts[]) => {
  if (!import.meta.client) return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
  }
};

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [] as ChatMessageWithProducts[],
    sending: false,
    error: '',
    isOpen: false,
    hydrated: false,
  }),

  actions: {
    hydrate() {
      if (this.hydrated || !import.meta.client) return;
      this.messages = loadFromSession();
      this.hydrated = true;
    },

    toggleOpen() {
      this.isOpen = !this.isOpen;
    },

   // stores/chat.ts — dans sendMessage()
    async sendMessage(userText: string) {
      const text = userText.trim();
      if (!text || this.sending) return;

      const { sendMessage } = useChat();

      this.error = '';
      this.messages.push({ role: 'user', content: text });
      saveToSession(this.messages);
      this.sending = true;

      try {
        // Ne transmet que role/content au backend — jamais "products",
        // qui est une donnée d'affichage frontend uniquement et fait
        // échouer la validation NestJS (forbidNonWhitelisted).
        const payload = this.messages.map(({ role, content }) => ({ role, content }));
        const response = await sendMessage(payload);

        this.messages.push({
          role: 'assistant',
          content: response.reply,
          products: response.products,
        });
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