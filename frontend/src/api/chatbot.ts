/**
 * 🚀 Cliente HTTP para Backend Chatbot
 * 
 * Este archivo reemplaza la llamada directa a Gemini API.
 * Ahora el frontend llama al backend, y el backend se comunica con Gemini.
 * 
 * Arquitectura:
 * Frontend (este archivo) → Backend (Firebase Functions) → Gemini API
 * 
 * Beneficios:
 * ✅ API key segura en el servidor
 * ✅ Sin código duplicado
 * ✅ Control centralizado
 * ✅ Rate limiting posible
 * ✅ Caché implementable
 */

// Tipos compartidos
export interface ChatMessage {
  message: string;
  userId?: string;
  context?: string;
}

export interface ChatResponse {
  response: string;
  timestamp: string;
  conversationId?: string;
}

export interface ChatHistory {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
  }>;
  count: number;
  userId: string;
}

// Configuración del backend
const BACKEND_CONFIG = {
  // URL del servidor local de desarrollo
  // Usar 10.0.2.2 para Android Emulator (localhost del host)
  // Usar localhost para iOS Simulator o web
  baseUrl: 'http://10.0.2.2:3001', // Android Emulator
  // baseUrl: 'http://localhost:3001', // iOS/Web
  
  // Timeout de peticiones (30 segundos)
  timeout: 30000,
};

/**
 * Maneja errores de red y del backend
 */
class ChatError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ChatError';
  }
}

/**
 * Envía un mensaje al chatbot a través del backend
 * 
 * @param message - Mensaje del usuario
 * @param userId - ID del usuario (opcional)
 * @param context - Contexto adicional (opcional)
 * @returns Respuesta del chatbot
 */
export async function sendMessage(
  message: string,
  userId?: string,
  context?: string
): Promise<ChatResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), BACKEND_CONFIG.timeout);

    const response = await fetch(`${BACKEND_CONFIG.baseUrl}/chatbot-sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        userId,
        context,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Backend error:', response.status, errorData);
      throw new ChatError(
        errorData.code || 'BACKEND_ERROR',
        errorData.message || `Error del servidor: ${response.status}`,
        errorData
      );
    }

    const data: ChatResponse = await response.json();
    console.log('✅ Respuesta del backend:', data);
    return data;

  } catch (error) {
    // Error de red o timeout
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ChatError(
          'TIMEOUT',
          'La petición tardó demasiado. Intenta nuevamente.',
          error
        );
      }

      if (error.message.includes('fetch')) {
        throw new ChatError(
          'NETWORK_ERROR',
          'Error de conexión. Verifica tu internet.',
          error
        );
      }
    }

    // Re-lanzar ChatError
    if (error instanceof ChatError) {
      throw error;
    }

    // Error desconocido
    throw new ChatError(
      'UNKNOWN_ERROR',
      'Error inesperado. Intenta nuevamente.',
      error
    );
  }
}

/**
 * Obtiene el historial de conversación de un usuario
 * 
 * @param userId - ID del usuario
 * @param limit - Número máximo de mensajes a retornar (default: 50)
 * @returns Historial de mensajes
 */
export async function getChatHistory(
  userId: string,
  limit: number = 50
): Promise<ChatHistory> {
  try {
    const response = await fetch(
      `${BACKEND_CONFIG.baseUrl}/chatbot-getChatHistory?userId=${encodeURIComponent(userId)}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new ChatError(
        'BACKEND_ERROR',
        `Error obteniendo historial: ${response.status}`
      );
    }

    const data: ChatHistory = await response.json();
    return data;

  } catch (error) {
    if (error instanceof ChatError) {
      throw error;
    }

    throw new ChatError(
      'UNKNOWN_ERROR',
      'Error obteniendo historial de chat',
      error
    );
  }
}

/**
 * Verifica si el backend está disponible
 * 
 * @returns true si el backend responde, false si no
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${BACKEND_CONFIG.baseUrl}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000), // 5 segundos timeout
    });

    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Configuración para desarrollo local
 * Útil para testing y desarrollo
 */
export function setBackendUrl(url: string): void {
  (BACKEND_CONFIG as any).baseUrl = url;
}

// Exportar tipos y configuración
export { ChatError, BACKEND_CONFIG };
