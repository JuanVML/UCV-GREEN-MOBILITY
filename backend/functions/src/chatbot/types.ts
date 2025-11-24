/**
 * Tipos para el módulo de Chatbot
 */

export interface ChatRequest {
  message: string;
  userId?: string;
  context?: string;
}

export interface ChatResponse {
  response: string;
  timestamp: string;
  conversationId: string;
}

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface ChatHistory {
  messages: ConversationMessage[];
  count: number;
  userId: string;
}

export enum ErrorCode {
  INVALID_MESSAGE = 'INVALID_MESSAGE',
  MESSAGE_TOO_LONG = 'MESSAGE_TOO_LONG',
  API_ERROR = 'API_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED'
}

export class ChatError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ChatError';
  }
}
