/**
 * 🔥 Firebase Functions - Entry Point
 * 
 * Este archivo expone las Cloud Functions HTTP que el frontend puede llamar.
 */

import * as functions from 'firebase-functions';
import { sendMessage, getChatHistory } from './chatbot/geminiController';
import { ChatRequest } from './chatbot/types';
import { 
  getLogsByUser, 
  getLogsByDateRange, 
  getChatStatistics,
  exportLogsToCSV 
} from './chatbot/loggingService';

/**
 * 🤖 Endpoint: Enviar mensaje al chatbot
 * 
 * POST /chatbot-sendMessage
 * Body: { message: string, userId?: string, context?: string }
 * 
 * Ejemplo:
 * curl -X POST https://your-project.cloudfunctions.net/chatbot-sendMessage \
 *   -H "Content-Type: application/json" \
 *   -d '{"message": "Hola", "userId": "user123"}'
 */
export const chatbotSendMessage = functions.https.onRequest(async (req, res) => {
  // CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  // Solo aceptar POST
  if (req.method !== 'POST') {
    res.status(405).json({ 
      error: 'Method not allowed',
      code: 'METHOD_NOT_ALLOWED' 
    });
    return;
  }

  try {
    const { message, userId, context } = req.body;

    // Validación básica
    if (!message || typeof message !== 'string') {
      res.status(400).json({ 
        error: 'Message is required and must be a string',
        code: 'INVALID_REQUEST' 
      });
      return;
    }

    // Crear request
    const chatRequest: ChatRequest = {
      message,
      userId: userId || 'anonymous',
      context
    };

    // Llamar al controller
    const response = await sendMessage(chatRequest);

    // Retornar respuesta
    res.status(200).json(response);

  } catch (error: any) {
    console.error('Error en chatbot-sendMessage:', error);
    
    res.status(500).json({ 
      error: error.message || 'Internal server error',
      code: error.code || 'INTERNAL_ERROR',
      details: error.details
    });
  }
});

/**
 * 📜 Endpoint: Obtener historial de chat
 * 
 * GET /chatbot-getChatHistory?userId=xxx&conversationId=xxx
 * 
 * Ejemplo:
 * curl https://your-project.cloudfunctions.net/chatbot-getChatHistory?userId=user123
 */
export const chatbotGetChatHistory = functions.https.onRequest(async (req, res) => {
  // CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  // Solo aceptar GET
  if (req.method !== 'GET') {
    res.status(405).json({ 
      error: 'Method not allowed',
      code: 'METHOD_NOT_ALLOWED' 
    });
    return;
  }

  try {
    const { userId, conversationId } = req.query;

    // Validación básica
    if (!userId || typeof userId !== 'string') {
      res.status(400).json({ 
        error: 'userId is required',
        code: 'INVALID_REQUEST' 
      });
      return;
    }

    // Llamar al controller
    const history = await getChatHistory(
      userId,
      conversationId ? parseInt(conversationId as string, 10) : undefined
    );

    // Retornar historial
    res.status(200).json(history);

  } catch (error: any) {
    console.error('Error en chatbot-getChatHistory:', error);
    
    res.status(500).json({ 
      error: error.message || 'Internal server error',
      code: error.code || 'INTERNAL_ERROR'
    });
  }
});

/**
 * 📊 Endpoint: Obtener estadísticas del chatbot
 * 
 * GET /chatbot-getStatistics
 */
export const chatbotGetStatistics = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const stats = await getChatStatistics();
    res.status(200).json(stats);
  } catch (error: any) {
    console.error('Error en chatbot-getStatistics:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * 📥 Endpoint: Exportar logs a CSV
 * 
 * GET /chatbot-exportLogs?userId=xxx&startDate=xxx&endDate=xxx
 * 
 * Ejemplo:
 * curl "https://your-project.cloudfunctions.net/chatbot-exportLogs?startDate=2025-01-01&endDate=2025-12-31"
 */
export const chatbotExportLogs = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const { userId, startDate, endDate } = req.query;

    let logs;

    if (userId) {
      // Obtener logs por usuario
      logs = await getLogsByUser(userId as string, 1000);
    } else if (startDate && endDate) {
      // Obtener logs por rango de fechas
      logs = await getLogsByDateRange(
        startDate as string,
        endDate as string,
        1000
      );
    } else {
      // Por defecto: últimos 30 días
      const end = new Date().toISOString();
      const start = new Date();
      start.setDate(start.getDate() - 30);
      logs = await getLogsByDateRange(start.toISOString(), end, 1000);
    }

    // Convertir a CSV
    const csvData = exportLogsToCSV(logs);

    // Enviar como descarga
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="chatbot_logs_${new Date().toISOString().split('T')[0]}.csv"`);
    res.status(200).send(csvData);

  } catch (error: any) {
    console.error('Error en chatbot-exportLogs:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * 📜 Endpoint: Obtener logs por usuario
 * 
 * GET /chatbot-getUserLogs?userId=xxx&limit=50
 */
export const chatbotGetUserLogs = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    const { userId, limit } = req.query;

    if (!userId) {
      res.status(400).json({ 
        error: 'userId is required',
        code: 'INVALID_REQUEST' 
      });
      return;
    }

    const logs = await getLogsByUser(
      userId as string,
      limit ? parseInt(limit as string, 10) : 50
    );

    res.status(200).json({ 
      logs,
      count: logs.length,
      userId 
    });

  } catch (error: any) {
    console.error('Error en chatbot-getUserLogs:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * 🏥 Endpoint: Health check
 * 
 * GET /chatbot-health
 */
export const chatbotHealth = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  
  res.status(200).json({ 
    status: 'ok',
    service: 'chatbot',
    timestamp: new Date().toISOString()
  });
});
