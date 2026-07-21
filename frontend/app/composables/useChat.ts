export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatProduct {
  id: string;
  name: string;
  price: number;
  description: string | null;
  imageUrl: string | null;
  url: string;
}

export interface ChatResponse {
  reply: string;
  products: ChatProduct[];
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