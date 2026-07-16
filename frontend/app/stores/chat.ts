// stores/chat.ts
import { defineStore } from 'pinia';
import { useChat, type ChatMessage } from '~/composables/useChat';

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [] as ChatMessage[],
    sending: false,
    error: '',
    isOpen: false,
  }),

  actions: {
    toggleOpen() {
      this.isOpen = !this.isOpen;
    },

    async sendMessage(userText: string) {
      const text = userText.trim();
      if (!text || this.sending) return;

      const { sendMessage } = useChat();

      this.error = '';
      this.messages.push({ role: 'user', content: text });
      this.sending = true;

      try {
        const response = await sendMessage(this.messages);
        this.messages.push({ role: 'assistant', content: response.reply });
      } catch (err: any) {
        this.error = err?.data?.message || 'Une erreur est survenue, merci de réessayer.';
      } finally {
        this.sending = false;
      }
    },

    resetConversation() {
      this.messages = [];
      this.error = '';
    },
  },
});