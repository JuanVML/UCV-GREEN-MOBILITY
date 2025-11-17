/**
 * Chatbot Module - Exports principales
 * 
 * Importa desde aquí para tener acceso a todas las funcionalidades:
 * import { sendMessage, ChatRequest, ChatResponse } from './chatbot';
 */

// Controller functions
export { sendMessage, getChatHistory, cleanup } from './geminiController';

// Types
export { 
  ChatRequest, 
  ChatResponse, 
  ChatHistory,
  ConversationMessage,
  ChatError,
  ErrorCode 
} from './types';

// Constants
export { 
  MESSAGE_CONSTRAINTS,
  RATE_LIMITS,
  TIMEOUTS,
  UCV_MOBILITY_CONTEXT 
} from './constants';

// Config
export { config, validateConfig } from './config';
