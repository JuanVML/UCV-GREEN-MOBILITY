import { useState, useEffect, useCallback } from 'react';
import { ChatMessage, SuggestionBubble, ChatSession } from '../types/chatbot';
import { sendMessage as sendMessageToBackend, ChatError } from '../api/chatbot';
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
      // Crear contexto de la conversación (solo historial, sin duplicar contexto UCV)
      // El backend ya tiene el contexto completo de UCV en constants.ts
      const conversationContext = messages
        .slice(-5) // Solo últimos 5 mensajes para optimizar
        .map(msg => `${msg.isUser ? 'Usuario' : 'Asistente'}: ${msg.message}`)
        .join('\n');

      // Llamar al backend centralizado
      const response = await sendMessageToBackend(
        messageText,
        user.email,
        conversationContext // ✅ Solo historial, sin contexto duplicado
      );

      const botMessage: ChatMessage = {
        id: `msg_${Date.now()}_bot`,
        message: response.response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // Debug: Log del error completo
      console.error('❌ Error completo en useChat:', error);
      console.error('Tipo de error:', error?.constructor?.name);
      console.error('Código:', (error as any)?.code);
      console.error('Mensaje:', (error as any)?.message);
      
      // Manejo de errores mejorado
      let errorText = 'Lo siento, ha ocurrido un error. Por favor intenta nuevamente.';
      
      if (error instanceof ChatError) {
        switch (error.code) {
          case 'TIMEOUT':
            errorText = 'La petición tardó demasiado. Verifica tu conexión e intenta nuevamente.';
            break;
          case 'NETWORK_ERROR':
            errorText = 'Sin conexión a internet. Verifica tu red e intenta nuevamente.';
            break;
          case 'BACKEND_ERROR':
            errorText = 'Error del servidor. Intenta nuevamente en unos momentos.';
            break;
        }
      }
      
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now()}_error`,
        message: errorText,
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