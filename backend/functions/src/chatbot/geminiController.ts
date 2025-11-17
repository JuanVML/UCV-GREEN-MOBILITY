/**
 * 🚀 Gemini Controller - Backend Centralizado
 * Controlador para manejar interacciones con Gemini AI API
 * 
 * @module chatbot/geminiController
 * @author UCV Green Mobility Team
 * @version 2.0.0 - Refactorizado con mejores prácticas
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  ChatRequest, 
  ChatResponse, 
  ChatHistory,
  ChatError,
  ErrorCode 
} from './types';
import { MESSAGE_CONSTRAINTS, UCV_MOBILITY_CONTEXT } from './constants';
import { config, validateConfig } from './config';
import { saveChatLog, ChatLog } from './loggingService';

// Inicializar Gemini AI
let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

/**
 * Inicializa la conexión con Gemini AI
 */
function initializeGemini(): void {
  if (genAI && model) return; // Ya inicializado
  
  try {
    validateConfig();
    genAI = new GoogleGenerativeAI(config.gemini.apiKey);
    model = genAI.getGenerativeModel({ 
      model: config.gemini.model,
      generationConfig: {
        temperature: config.gemini.temperature,
        topK: config.gemini.topK,
        topP: config.gemini.topP,
        maxOutputTokens: config.gemini.maxOutputTokens,
      }
    });
    
    if (config.logging.enabled) {
      console.log('✅ Gemini AI inicializado correctamente');
    }
  } catch (error) {
    console.error('❌ Error inicializando Gemini AI:', error);
    throw new ChatError(
      ErrorCode.API_ERROR,
      'Error al inicializar servicio de chat',
      error
    );
  }
}

/**
 * Valida el mensaje del usuario
 */
function validateMessage(message: string): void {
  if (!message || message.trim().length === 0) {
    throw new ChatError(
      ErrorCode.INVALID_MESSAGE,
      'El mensaje es requerido y no puede estar vacío'
    );
  }
  
  if (message.length > MESSAGE_CONSTRAINTS.MAX_LENGTH) {
    throw new ChatError(
      ErrorCode.MESSAGE_TOO_LONG,
      `El mensaje excede el límite de ${MESSAGE_CONSTRAINTS.MAX_LENGTH} caracteres`
    );
  }
}

/**
 * Genera un ID único para la conversación
 */
function generateConversationId(userId?: string): string {
  const userPart = userId || 'anonymous';
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `conv_${userPart}_${timestamp}_${random}`;
}

/**
 * Construye el prompt completo con contexto
 */
function buildPrompt(message: string, conversationHistory?: string): string {
  const contextParts = [UCV_MOBILITY_CONTEXT];
  
  // Solo agregar historial si existe (sin duplicar contexto)
  if (conversationHistory && conversationHistory.trim()) {
    contextParts.push('\nCONVERSACIÓN PREVIA:', conversationHistory);
  }
  
  contextParts.push('\nUSUARIO:', message);
  
  return contextParts.join('\n');
}

/**
 * Envía un mensaje al chatbot y obtiene respuesta
 * 
 * @param requestData - Datos de la petición (mensaje, userId, contexto)
 * @returns Respuesta del chatbot
 */
export async function sendMessage(requestData: ChatRequest): Promise<ChatResponse> {
  const startTime = Date.now();
  
  try {
    // Validar entrada
    validateMessage(requestData.message);
    
    // Inicializar Gemini si es necesario
    initializeGemini();
    
    if (!model) {
      throw new ChatError(
        ErrorCode.API_ERROR,
        'Servicio de chat no disponible'
      );
    }
    
    // Generar ID de conversación
    const conversationId = generateConversationId(requestData.userId);
    
    // Construir prompt
    const fullPrompt = buildPrompt(requestData.message, requestData.context);
    
    if (config.logging.verbose) {
      console.log('� Enviando mensaje a Gemini:', {
        userId: requestData.userId || 'anonymous',
        messageLength: requestData.message.length,
        conversationId
      });
    }
    
    // Llamar a Gemini API
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    const chatResponse: ChatResponse = {
      response: text,
      timestamp: new Date().toISOString(),
      conversationId
    };
    
    const duration = Date.now() - startTime;
    
    if (config.logging.enabled) {
      console.log(`✅ Respuesta generada en ${duration}ms`);
    }
    
    // 📝 Guardar log de conversación exitosa
    try {
      await saveChatLog({
        conversationId,
        userId: requestData.userId || 'anonymous',
        userMessage: requestData.message,
        botResponse: text,
        timestamp: chatResponse.timestamp,
        responseTime: duration,
        messageLength: requestData.message.length,
        responseLength: text.length,
        success: true,
        context: requestData.context
      });
    } catch (logError) {
      // No fallar si el logging falla, solo registrar el error
      console.error('⚠️ Error guardando log (no crítico):', logError);
    }
    
    return chatResponse;
    
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ Error en sendMessage (${duration}ms):`, error);
    
    // Re-lanzar errores de ChatError
    if (error instanceof ChatError) {
      throw error;
    }
    
    // Errores de API de Gemini
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new ChatError(
          ErrorCode.API_ERROR,
          'Error de autenticación con el servicio de chat',
          error
        );
      }
      
      if (error.message.includes('quota') || error.message.includes('rate limit')) {
        throw new ChatError(
          ErrorCode.RATE_LIMIT_EXCEEDED,
          'Límite de peticiones excedido. Intenta más tarde',
          error
        );
      }
    }
    
    // 📝 Guardar log de error
    try {
      await saveChatLog({
        conversationId: generateConversationId(requestData.userId),
        userId: requestData.userId || 'anonymous',
        userMessage: requestData.message,
        botResponse: '',
        timestamp: new Date().toISOString(),
        responseTime: duration,
        messageLength: requestData.message.length,
        responseLength: 0,
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        context: requestData.context
      });
    } catch (logError) {
      console.error('⚠️ Error guardando log de error:', logError);
    }
    
    // Error genérico
    throw new ChatError(
      ErrorCode.INTERNAL_ERROR,
      'Error procesando tu mensaje. Intenta nuevamente',
      error
    );
  }
}

/**
 * Obtiene el historial de conversación de un usuario
 * 
 * @param userId - ID del usuario
 * @param limit - Número máximo de mensajes a retornar
 * @returns Historial de mensajes
 */
export async function getChatHistory(
  userId: string, 
  limit: number = 50
): Promise<ChatHistory> {
  try {
    // Aplicar límite máximo
    const finalLimit = Math.min(limit, 100);
    
    // TODO: Implementar integración con base de datos (Firestore)
    // Por ahora retornamos array vacío
    const mockHistory: ChatHistory = {
      messages: [],
      count: 0,
      userId
    };
    
    if (config.logging.verbose) {
      console.log('📜 Obteniendo historial:', { userId, limit: finalLimit });
    }
    
    return mockHistory;
    
  } catch (error) {
    console.error('❌ Error en getChatHistory:', error);
    throw new ChatError(
      ErrorCode.INTERNAL_ERROR,
      'Error obteniendo historial de chat',
      error
    );
  }
}

/**
 * Limpia recursos y cierra conexiones
 */
export function cleanup(): void {
  genAI = null;
  model = null;
  
  if (config.logging.enabled) {
    console.log('🧹 Recursos de Gemini limpiados');
  }
}