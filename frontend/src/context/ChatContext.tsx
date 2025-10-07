import React, { createContext, useContext, useState, useEffect } from 'react';
import { ChatMessage, ChatSession } from '../types/chatbot';
import { useAuth } from '../hooks/useAuth';

interface ChatContextType {
  currentSession: ChatSession | null;
  messages: ChatMessage[];
  isLoading: boolean;
  clearChatSession: () => void;
  initializeChatSession: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Limpiar sesión cuando el usuario se desloguea
  useEffect(() => {
    if (!user) {
      clearChatSession();
    } else if (user && !currentSession) {
      initializeChatSession();
    }
  }, [user, currentSession]);

  const clearChatSession = () => {
    setCurrentSession(null);
    setMessages([]);
    setIsLoading(false);
  };

  const initializeChatSession = () => {
    if (user) {
      const newSession: ChatSession = {
        id: `session_${user.email}_${Date.now()}`,
        userId: user.email,
        messages: [],
        createdAt: new Date(),
        isActive: true
      };
      setCurrentSession(newSession);
      setMessages([]);
    }
  };

  const value: ChatContextType = {
    currentSession,
    messages,
    isLoading,
    clearChatSession,
    initializeChatSession,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};