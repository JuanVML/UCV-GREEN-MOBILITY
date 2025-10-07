import { useState, useEffect, useCallback } from 'react';
import { ChatMessage, SuggestionBubble, ChatSession } from '../types/chatbot';
import { sendMessageToGemini } from '../api/gemini';
import { useAuth } from './useAuth';

// Sugerencias predefinidas para UCV SEDE LIMA NORTE (máximo 3)
const DEFAULT_SUGGESTIONS: SuggestionBubble[] = [
  {
    id: '1',
    text: '¿Ruta desde Independencia hacia UCV Lima Norte?',
    category: 'routes'
  },
  {
    id: '2',
    text: '¿Mejores rutas en bicicleta desde Los Olivos?',
    category: 'routes'
  },
  {
    id: '3',
    text: '¿Cómo llegar en scooter desde Comas?',
    category: 'routes'
  }
];

export const useChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [session, setSession] = useState<ChatSession | null>(null);

  // Inicializar sesión de chat
  useEffect(() => {
    if (user && !session) {
      const newSession: ChatSession = {
        id: `session_${user.email}_${Date.now()}`,
        userId: user.email,
        messages: [],
        createdAt: new Date(),
        isActive: true
      };
      setSession(newSession);
    }
  }, [user, session]);

  // Limpiar sesión al cerrar sesión del usuario
  useEffect(() => {
    if (!user) {
      setMessages([]);
      setSession(null);
      setShowSuggestions(true);
    }
  }, [user]);

  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || !user) return;

    // Ocultar sugerencias al enviar primer mensaje
    if (showSuggestions) {
      setShowSuggestions(false);
    }

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      message: messageText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    // Agregar mensaje del usuario
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Crear contexto de la conversación para Gemini
      const conversationContext = messages
        .map(msg => `${msg.isUser ? 'Usuario' : 'Asistente'}: ${msg.message}`)
        .join('\n');

      const response = await sendMessageToGemini(
        messageText,
        user.email,
        `Conversación previa:\n${conversationContext}\n\nContexto: Eres un asistente de movilidad universitaria para la Universidad César Vallejo (UCV). Ayudas con rutas seguras, transporte sostenible, clima, tráfico y eventos universitarios.`
      );

      const botMessage: ChatMessage = {
        id: `msg_${Date.now()}_bot`,
        message: response.response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now()}_error`,
        message: 'Lo siento, ha ocurrido un error. Por favor intenta nuevamente.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [user, messages, showSuggestions]);

  const selectSuggestion = useCallback((suggestion: SuggestionBubble) => {
    sendMessage(suggestion.text);
  }, [sendMessage]);

  const clearSession = useCallback(() => {
    setMessages([]);
    setShowSuggestions(true);
    if (user) {
      const newSession: ChatSession = {
        id: `session_${user.email}_${Date.now()}`,
        userId: user.email,
        messages: [],
        createdAt: new Date(),
        isActive: true
      };
      setSession(newSession);
    }
  }, [user]);

  return {
    messages,
    isLoading,
    showSuggestions,
    suggestions: DEFAULT_SUGGESTIONS,
    sendMessage,
    selectSuggestion,
    clearSession,
    hasMessages: messages.length > 0
  };
};