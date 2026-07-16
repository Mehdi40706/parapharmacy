export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  reply: string;
}

export const useChat = () => {
  const api = useApi();

  const sendMessage = (messages: ChatMessage[]) => {
    return api<ChatResponse>('/chat', {
      method: 'POST',
      body: { messages },
    });
  };

  return { sendMessage };
};