/**
 * 🚀 Cliente de Chatbot con Gemini AI Directo
 * 
 * Este archivo se comunica directamente con la API de Gemini
 * sin necesidad de un backend intermediario.
 * 
 * Arquitectura:
 * Frontend (este archivo) → Gemini API
 * 
 * Ventajas:
 * ✅ Sin dependencia de backend local
 * ✅ Respuestas más rápidas
 * ✅ API key en variables de entorno
 * ✅ Funciona offline con fallbacks
 */

import { Platform } from 'react-native';
import { sendMessageToGemini } from './gemini';

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

/**
 * Maneja errores del chatbot
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

// Backend URL detection: use emulator host for Android, localhost for iOS/sim
const LOCAL_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
const BACKEND_CONFIG = {
  baseUrl: `http://${LOCAL_HOST}:3001`,
  // reducir timeout para detectar rápidamente que el servidor local no responde
  timeout: 8000,
};

// Permitimos sobrescribir la URL en runtime (útil para dispositivos físicos)
export function setBackendUrl(url: string) {
  (BACKEND_CONFIG as any).baseUrl = url;
}

// Contexto especializado para UCV Green Mobility
const getUCVContext = (): string => {
  return `
    Eres AsistenteMobil de UCV Green Mobility para la Universidad César Vallejo SEDE LIMA NORTE únicamente.
    
    INFORMACIÓN CLAVE:
    - UCV SEDE LIMA NORTE ubicada en Av. Alfredo Mendiola 6232, Los Olivos
    - COBERTURA: SOLO Lima Norte (Los Olivos, Independencia, SMP, Comas, Puente Piedra)
    - Especialista en rutas con bicicleta 🚴‍♂️ y scooter eléctrico 🛴 únicamente
    
    ZONAS ESPECÍFICAS QUE CONOCES EN LIMA NORTE:
    - Los Olivos: Pro, Mercado Central, Parque Zonal, Panamericana Norte
    - Independencia: Tahuantinsuyo (todas las zonas), Túpac Amaru, Ermitaño, cerros
    - SMP: Fiori, Santa Rosa, Condevilla, Naranjal
    - Comas: Collique, El Retablo, Santa Luzmila, cerros altos
    - Puente Piedra: Cercado, Shangrila, Chillón
    
    METODOLOGÍA OBLIGATORIA:
    1. Si preguntan por rutas → pregúntales: "¿A qué hora empiezan tus clases?"
    2. Con ubicación de Lima Norte + horario → da ruta detallada calle por calle
    3. Para zonas altas/cerros: considera 10-15 min extra por subidas
    4. Si preguntan por ubicaciones FUERA de Lima Norte → recomienda campus más cercano
    
    INSTRUCCIONES:
    - NUNCA menciones transporte público, solo bici/scooter eléctrico
    - Da rutas con nombres exactos de calles dentro de Lima Norte
    - Máximo 150 palabras por respuesta
    - Usa emojis moderadamente
  `;
};

/**
 * Respuestas contextuales como fallback
 */
const getContextualResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('ruta') || lowerMessage.includes('llegar') || lowerMessage.includes('ubicación')) {
    return `🎯 Para armarte la ruta perfecta hacia UCV SEDE LIMA NORTE necesito:

📍 **¿Desde dónde partes en Lima Norte?**
• Los Olivos, Independencia, SMP, Comas, Puente Piedra

🕐 **¿A qué hora empiezan tus clases?**

¡Escribe tu zona exacta y horario! 🚀`;
  }

  if (lowerMessage.includes('bicicleta') || lowerMessage.includes('scooter')) {
    return `🚴‍♂️🛴 **¡Excelente elección de movilidad sostenible!**

Para darte la ruta exacta necesito:
🕐 **¿A qué hora empiezan tus clases?**
📍 **¿Desde dónde partes exactamente?**

¡Escribe los detalles y te doy la ruta calle por calle! 🎯`;
  }

  return `Hola 👋 Soy AsistenteMobil de UCV Green Mobility. 

¿En qué puedo ayudarte? Cuéntame:
• Tu ubicación en Lima Norte
• A qué hora empiezan tus clases
• Si prefieres bicicleta 🚴‍♂️ o scooter 🛴`;
};

/**
 * Envía un mensaje al chatbot usando Gemini AI directamente
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
      body: JSON.stringify({ message, userId, context }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Backend error:', response.status, errorData);
      throw new ChatError(
        errorData.code || 'BACKEND_ERROR',
        errorData.error || errorData.message || `Error del servidor: ${response.status}`,
        errorData
      );
    }

    const data: ChatResponse = await response.json();
    return data;
  } catch (error) {


    try {
      const fallback = await sendMessageToGemini(message, userId, context);
      return fallback;
    } catch (fallbackError) {
      // Si el fallback también falla, priorizar el error original si es un ChatError
      if (error instanceof ChatError) throw error;
      if (fallbackError instanceof ChatError) throw fallbackError;
      // Si no son ChatError, lanzar un ChatError genérico
      throw new ChatError('UNKNOWN_ERROR', 'Error inesperado. Intenta nuevamente.', error ?? fallbackError);
    }
  }
}

/**
 * Obtiene el historial de conversación (simulado)
 * 
 * @param userId - ID del usuario
 * @param limit - Número máximo de mensajes a retornar (default: 50)
 * @returns Historial de mensajes
 */
export async function getChatHistory(
  userId: string,
  limit: number = 50
): Promise<ChatHistory> {
  // Retornar historial vacío por ahora
  return {
    messages: [],
    count: 0,
    userId: userId,
  };
}

// Exportar tipos
export { ChatError };
