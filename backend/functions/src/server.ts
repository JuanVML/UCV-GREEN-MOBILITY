/**
 * 🚀 Servidor Express Local - Para desarrollo
 * 
 * Este servidor te permite probar el chatbot sin necesidad de Firebase Functions.
 * Solo para desarrollo local.
 * 
 * Para usar:
 * 1. cd backend/functions
 * 2. npm run dev:server
 * 3. El servidor estará en http://localhost:3001
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { sendMessage, getChatHistory } from './chatbot/geminiController';
import { ChatRequest } from './chatbot/types';
import { RATE_LIMITS } from './chatbot/constants';
import { 
  getLogsByUser, 
  getLogsByDateRange, 
  getChatStatistics,
  exportLogsToCSV 
} from './chatbot/loggingService';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rate limiting - Protección contra abuso
const createRateLimiter = (max: number) => rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max, // Máximo de peticiones
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Demasiadas peticiones, por favor intenta más tarde',
    code: 'RATE_LIMIT_EXCEEDED'
  }
});

// Rate limiter específico para chatbot
const chatbotLimiter = createRateLimiter(RATE_LIMITS.ANONYMOUS);

/**
 * 🏥 Health check
 */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    service: 'chatbot',
    timestamp: new Date().toISOString()
  });
});

/**
 * 🤖 POST /chatbot-sendMessage
 * Enviar mensaje al chatbot
 * Rate limit: 20/min autenticados, 10/min anónimos
 */
app.post('/chatbot-sendMessage', chatbotLimiter, async (req, res) => {
  try {
    const { message, userId, context } = req.body;

    // Validación básica
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ 
        error: 'Message is required and must be a string',
        code: 'INVALID_REQUEST' 
      });
    }

    console.log(`📩 Mensaje recibido de usuario ${userId || 'anonymous'}: "${message.substring(0, 50)}..."`);

    // Crear request
    const chatRequest: ChatRequest = {
      message,
      userId: userId || 'anonymous',
      context
    };

    // Llamar al controller
    const response = await sendMessage(chatRequest);

    console.log(`✅ Respuesta enviada: "${response.response.substring(0, 50)}..."`);

    // Retornar respuesta
    res.status(200).json(response);

  } catch (error: any) {
    console.error('❌ Error en chatbot-sendMessage:', error);
    
    res.status(500).json({ 
      error: error.message || 'Internal server error',
      code: error.code || 'INTERNAL_ERROR',
      details: error.details
    });
  }
});

/**
 * 📜 GET /chatbot-getChatHistory
 * Obtener historial de chat
 */
app.get('/chatbot-getChatHistory', async (req, res) => {
  try {
    const { userId, conversationId } = req.query;

    // Validación básica
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ 
        error: 'userId is required',
        code: 'INVALID_REQUEST' 
      });
    }

    console.log(`📜 Obteniendo historial para usuario ${userId}`);

    // Llamar al controller
    const history = await getChatHistory(
      userId,
      conversationId ? parseInt(conversationId as string, 10) : undefined
    );

    console.log(`✅ Historial enviado: ${history.count} mensajes`);

    // Retornar historial
    res.status(200).json(history);

  } catch (error: any) {
    console.error('❌ Error en chatbot-getChatHistory:', error);
    
    res.status(500).json({ 
      error: error.message || 'Internal server error',
      code: error.code || 'INTERNAL_ERROR'
    });
  }
});

/**
 * 📊 GET /chatbot-getStatistics
 * Obtener estadísticas del chatbot
 */
app.get('/chatbot-getStatistics', async (req, res) => {
  try {
    console.log('📊 Obteniendo estadísticas del chatbot');
    const stats = await getChatStatistics();
    console.log(`✅ Estadísticas: ${stats.totalConversations} conversaciones, ${stats.successRate.toFixed(2)}% precisión`);
    res.status(200).json(stats);
  } catch (error: any) {
    console.error('❌ Error en chatbot-getStatistics:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * 📜 GET /chatbot-getUserLogs
 * Obtener logs de un usuario específico
 */
app.get('/chatbot-getUserLogs', async (req, res) => {
  try {
    const { userId, limit } = req.query;

    if (!userId) {
      return res.status(400).json({ 
        error: 'userId is required',
        code: 'INVALID_REQUEST' 
      });
    }

    console.log(`📜 Obteniendo logs para usuario ${userId}`);
    const logs = await getLogsByUser(
      userId as string,
      limit ? parseInt(limit as string, 10) : 50
    );

    console.log(`✅ ${logs.length} logs encontrados`);
    res.status(200).json({ 
      logs,
      count: logs.length,
      userId 
    });

  } catch (error: any) {
    console.error('❌ Error en chatbot-getUserLogs:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

/**
 * 📥 GET /chatbot-exportLogs
 * Exportar logs a CSV
 */
app.get('/chatbot-exportLogs', async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;

    console.log('📥 Exportando logs a CSV...');
    let logs;

    if (userId) {
      logs = await getLogsByUser(userId as string, 1000);
    } else if (startDate && endDate) {
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

    const csvData = exportLogsToCSV(logs);

    console.log(`✅ ${logs.length} logs exportados a CSV`);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="chatbot_logs_${new Date().toISOString().split('T')[0]}.csv"`);
    res.status(200).send(csvData);

  } catch (error: any) {
    console.error('❌ Error en chatbot-exportLogs:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error',
      code: 'INTERNAL_ERROR'
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ================================');
  console.log('🤖  Servidor Chatbot Iniciado');
  console.log('🚀 ================================');
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
  console.log(`💬 Endpoint: http://localhost:${PORT}/chatbot-sendMessage`);
  console.log('');
  console.log('✅ Listo para recibir peticiones!');
  console.log('');
});

// Manejo de errores
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});
