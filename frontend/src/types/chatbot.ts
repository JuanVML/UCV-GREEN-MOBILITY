// Types for chatbot functionality

export interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

export interface ChatResponse {
  response: string;
  timestamp: string;
  conversationId?: string;
}

export interface SuggestionBubble {
  id: string;
  text: string;
  category: 'routes' | 'weather' | 'traffic' | 'events' | 'general';
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: Date;
  isActive: boolean;
}