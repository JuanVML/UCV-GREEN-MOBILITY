/**
 * 📊 Logging Service - Sistema de registro de conversaciones
 * Guarda todas las interacciones del chatbot en Firestore para análisis
 * 
 * @module chatbot/loggingService
 * @author UCV Green Mobility Team
 * @version 1.0.0
 */

import * as admin from 'firebase-admin';

// Inicializar Firebase Admin si no está inicializado
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Interfaz para un log de conversación
 */
export interface ChatLog {
  conversationId: string;
  userId: string;
  userMessage: string;
  botResponse: string;
  timestamp: string;
  responseTime: number; // en milisegundos
  messageLength: number;
  responseLength: number;
  success: boolean;
  errorMessage?: string;
  context?: string;
}

/**
 * Interfaz para estadísticas agregadas
 */
export interface ChatStats {
  totalConversations: number;
  totalUsers: number;
  averageResponseTime: number;
  successRate: number;
  lastUpdated: string;
}

/**
 * Guarda un log de conversación en Firestore
 * 
 * @param logData - Datos del log a guardar
 * @returns ID del documento creado
 */
export async function saveChatLog(logData: ChatLog): Promise<string> {
  try {
    const docRef = await db.collection('chatbot_logs').add({
      ...logData,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`📝 Log guardado: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error guardando log:', error);
    throw error;
  }
}

/**
 * Obtiene logs por usuario
 * 
 * @param userId - ID del usuario
 * @param limit - Número máximo de logs a obtener
 * @returns Array de logs
 */
export async function getLogsByUser(
  userId: string, 
  limit: number = 50
): Promise<ChatLog[]> {
  try {
    const snapshot = await db.collection('chatbot_logs')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();
    
    const logs: ChatLog[] = [];
    snapshot.forEach(doc => {
      logs.push(doc.data() as ChatLog);
    });
    
    return logs;
  } catch (error) {
    console.error('❌ Error obteniendo logs:', error);
    throw error;
  }
}

/**
 * Obtiene todos los logs en un rango de fechas
 * 
 * @param startDate - Fecha inicio (ISO string)
 * @param endDate - Fecha fin (ISO string)
 * @param limit - Número máximo de logs
 * @returns Array de logs
 */
export async function getLogsByDateRange(
  startDate: string,
  endDate: string,
  limit: number = 1000
): Promise<ChatLog[]> {
  try {
    const snapshot = await db.collection('chatbot_logs')
      .where('timestamp', '>=', startDate)
      .where('timestamp', '<=', endDate)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();
    
    const logs: ChatLog[] = [];
    snapshot.forEach(doc => {
      logs.push(doc.data() as ChatLog);
    });
    
    return logs;
  } catch (error) {
    console.error('❌ Error obteniendo logs por fecha:', error);
    throw error;
  }
}

/**
 * Calcula estadísticas de uso del chatbot
 * 
 * @returns Estadísticas agregadas
 */
export async function getChatStatistics(): Promise<ChatStats> {
  try {
    const snapshot = await db.collection('chatbot_logs')
      .orderBy('timestamp', 'desc')
      .limit(1000)
      .get();
    
    const logs: ChatLog[] = [];
    snapshot.forEach(doc => {
      logs.push(doc.data() as ChatLog);
    });
    
    const totalConversations = logs.length;
    const uniqueUsers = new Set(logs.map(log => log.userId)).size;
    const successfulLogs = logs.filter(log => log.success);
    const totalResponseTime = logs.reduce((sum, log) => sum + log.responseTime, 0);
    
    const stats: ChatStats = {
      totalConversations,
      totalUsers: uniqueUsers,
      averageResponseTime: totalConversations > 0 ? totalResponseTime / totalConversations : 0,
      successRate: totalConversations > 0 ? (successfulLogs.length / totalConversations) * 100 : 0,
      lastUpdated: new Date().toISOString()
    };
    
    return stats;
  } catch (error) {
    console.error('❌ Error calculando estadísticas:', error);
    throw error;
  }
}

/**
 * Exporta logs a formato CSV
 * 
 * @param logs - Array de logs a exportar
 * @returns String en formato CSV
 */
export function exportLogsToCSV(logs: ChatLog[]): string {
  const headers = [
    'Conversation ID',
    'User ID',
    'User Message',
    'Bot Response',
    'Timestamp',
    'Response Time (ms)',
    'Message Length',
    'Response Length',
    'Success',
    'Error Message'
  ];
  
  const rows = logs.map(log => [
    log.conversationId,
    log.userId,
    `"${log.userMessage.replace(/"/g, '""')}"`, // Escapar comillas
    `"${log.botResponse.replace(/"/g, '""')}"`,
    log.timestamp,
    log.responseTime.toString(),
    log.messageLength.toString(),
    log.responseLength.toString(),
    log.success ? 'Yes' : 'No',
    log.errorMessage || ''
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csvContent;
}

/**
 * Limpia logs antiguos (más de X días)
 * 
 * @param daysToKeep - Número de días de logs a mantener
 * @returns Número de logs eliminados
 */
export async function cleanOldLogs(daysToKeep: number = 90): Promise<number> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    const cutoffISO = cutoffDate.toISOString();
    
    const snapshot = await db.collection('chatbot_logs')
      .where('timestamp', '<', cutoffISO)
      .get();
    
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    
    console.log(`🧹 ${snapshot.size} logs antiguos eliminados`);
    return snapshot.size;
  } catch (error) {
    console.error('❌ Error limpiando logs antiguos:', error);
    throw error;
  }
}
