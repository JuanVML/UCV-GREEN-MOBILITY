/**
 * 📖 Ejemplos de uso del Gemini Controller
 * 
 * Este archivo muestra cómo usar el controller en diferentes escenarios
 */

import { sendMessage, getChatHistory } from './geminiController';
import { ChatError, ErrorCode } from './types';

// =============================================================================
// EJEMPLO 1: Uso básico - Mensaje simple
// =============================================================================

async function example1_basicUsage() {
  console.log('\n=== EJEMPLO 1: Uso básico ===\n');
  
  try {
    const response = await sendMessage({
      message: '¿Cómo llego a la UCV desde Los Olivos?'
    });
    
    console.log('✅ Respuesta recibida:');
    console.log('   Mensaje:', response.response.substring(0, 100) + '...');
    console.log('   ID:', response.conversationId);
    console.log('   Timestamp:', response.timestamp);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// =============================================================================
// EJEMPLO 2: Usuario autenticado con contexto
// =============================================================================

async function example2_authenticatedWithContext() {
  console.log('\n=== EJEMPLO 2: Usuario autenticado con contexto ===\n');
  
  try {
    const response = await sendMessage({
      message: '¿Cuál es la ruta más rápida?',
      userId: 'juan.perez@ucv.edu.pe',
      context: 'El usuario vive en Independencia, zona alta. Prefiere evitar subidas pronunciadas.'
    });
    
    console.log('✅ Respuesta personalizada:');
    console.log('   Usuario:', 'juan.perez@ucv.edu.pe');
    console.log('   Respuesta:', response.response);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// =============================================================================
// EJEMPLO 3: Manejo de errores específicos
// =============================================================================

async function example3_errorHandling() {
  console.log('\n=== EJEMPLO 3: Manejo de errores ===\n');
  
  // Caso 1: Mensaje vacío
  try {
    await sendMessage({ message: '' });
  } catch (error) {
    if (error instanceof ChatError) {
      console.log('✅ Error detectado correctamente:');
      console.log('   Código:', error.code);
      console.log('   Mensaje:', error.message);
    }
  }
  
  // Caso 2: Mensaje demasiado largo
  try {
    const longMessage = 'a'.repeat(3000);
    await sendMessage({ message: longMessage });
  } catch (error) {
    if (error instanceof ChatError && error.code === ErrorCode.MESSAGE_TOO_LONG) {
      console.log('✅ Mensaje rechazado por ser demasiado largo');
    }
  }
  
  // Caso 3: Manejo genérico
  try {
    await sendMessage({ message: 'Mensaje válido' });
  } catch (error) {
    if (error instanceof ChatError) {
      switch (error.code) {
        case ErrorCode.INVALID_MESSAGE:
          console.log('Por favor ingresa un mensaje válido');
          break;
        case ErrorCode.RATE_LIMIT_EXCEEDED:
          console.log('Has enviado muchos mensajes. Espera un momento.');
          break;
        case ErrorCode.API_ERROR:
          console.log('Error de conexión. Intenta nuevamente.');
          break;
        default:
          console.log('Error inesperado:', error.message);
      }
    }
  }
}

// =============================================================================
// EJEMPLO 4: Conversación continua
// =============================================================================

async function example4_conversation() {
  console.log('\n=== EJEMPLO 4: Conversación continua ===\n');
  
  const userId = 'maria.gonzales@ucv.edu.pe';
  const conversationContext: string[] = [];
  
  // Mensaje 1
  const response1 = await sendMessage({
    message: '¿Rutas en bicicleta desde San Martín de Porres?',
    userId
  });
  
  conversationContext.push(`Usuario: ¿Rutas en bicicleta desde San Martín de Porres?`);
  conversationContext.push(`Asistente: ${response1.response}`);
  
  console.log('👤 Usuario:', '¿Rutas en bicicleta desde San Martín de Porres?');
  console.log('🤖 Bot:', response1.response.substring(0, 150) + '...\n');
  
  // Mensaje 2 (con contexto)
  const response2 = await sendMessage({
    message: '¿Y cuánto tiempo me tomaría?',
    userId,
    context: conversationContext.join('\n')
  });
  
  console.log('👤 Usuario:', '¿Y cuánto tiempo me tomaría?');
  console.log('🤖 Bot:', response2.response.substring(0, 150) + '...\n');
  
  // Obtener historial
  const history = await getChatHistory(userId, 10);
  console.log('📜 Historial de', userId + ':', history.count, 'mensajes');
}

// =============================================================================
// EJEMPLO 5: Múltiples usuarios concurrentes
// =============================================================================

async function example5_concurrentUsers() {
  console.log('\n=== EJEMPLO 5: Múltiples usuarios concurrentes ===\n');
  
  const users = [
    { id: 'user1@ucv.edu.pe', message: '¿Ruta desde Los Olivos?' },
    { id: 'user2@ucv.edu.pe', message: '¿Ruta desde Independencia?' },
    { id: 'user3@ucv.edu.pe', message: '¿Ruta desde Comas?' }
  ];
  
  console.log('🚀 Enviando', users.length, 'mensajes en paralelo...\n');
  
  const promises = users.map(user => 
    sendMessage({
      message: user.message,
      userId: user.id
    })
  );
  
  const responses = await Promise.all(promises);
  
  responses.forEach((response, index) => {
    console.log(`✅ Usuario ${index + 1}:`, users[index].id);
    console.log('   Conversation ID:', response.conversationId);
    console.log('   Respuesta:', response.response.substring(0, 80) + '...\n');
  });
}

// =============================================================================
// EJEMPLO 6: Rate limiting y retry
// =============================================================================

async function example6_rateLimiting() {
  console.log('\n=== EJEMPLO 6: Rate limiting y retry ===\n');
  
  async function sendWithRetry(message: string, maxRetries = 3) {
    let retries = 0;
    
    while (retries < maxRetries) {
      try {
        const response = await sendMessage({ message });
        return response;
        
      } catch (error) {
        if (error instanceof ChatError && error.code === ErrorCode.RATE_LIMIT_EXCEEDED) {
          retries++;
          const waitTime = Math.pow(2, retries) * 1000; // Exponential backoff
          
          console.log(`⏳ Rate limit alcanzado. Esperando ${waitTime/1000}s antes de reintentar...`);
          
          await new Promise(resolve => setTimeout(resolve, waitTime));
          
        } else {
          throw error;
        }
      }
    }
    
    throw new Error('Máximo de reintentos alcanzado');
  }
  
  try {
    const response = await sendWithRetry('¿Mejor ruta en bicicleta?');
    console.log('✅ Mensaje enviado con éxito:', response.conversationId);
  } catch (error) {
    console.error('❌ Error después de reintentos:', error);
  }
}

// =============================================================================
// EJEMPLO 7: Validación de entrada antes de enviar
// =============================================================================

async function example7_inputValidation() {
  console.log('\n=== EJEMPLO 7: Validación de entrada ===\n');
  
  function validateInput(message: string): { valid: boolean; error?: string } {
    if (!message || message.trim().length === 0) {
      return { valid: false, error: 'El mensaje no puede estar vacío' };
    }
    
    if (message.length > 2000) {
      return { valid: false, error: 'El mensaje es demasiado largo (máx. 2000 caracteres)' };
    }
    
    // Validaciones adicionales
    const forbiddenWords = ['spam', 'hack'];
    const lowerMessage = message.toLowerCase();
    
    for (const word of forbiddenWords) {
      if (lowerMessage.includes(word)) {
        return { valid: false, error: 'El mensaje contiene palabras no permitidas' };
      }
    }
    
    return { valid: true };
  }
  
  // Caso 1: Mensaje válido
  const message1 = '¿Cómo llego a la UCV?';
  const validation1 = validateInput(message1);
  
  if (validation1.valid) {
    const response = await sendMessage({ message: message1 });
    console.log('✅ Mensaje válido procesado');
  } else {
    console.log('❌ Mensaje rechazado:', validation1.error);
  }
  
  // Caso 2: Mensaje inválido
  const message2 = '';
  const validation2 = validateInput(message2);
  
  if (!validation2.valid) {
    console.log('❌ Validación falló:', validation2.error);
  }
}

// =============================================================================
// EJECUTAR EJEMPLOS
// =============================================================================

async function runAllExamples() {
  console.log('\n🚀 EJECUTANDO EJEMPLOS DE USO\n');
  console.log('='.repeat(60));
  
  try {
    await example1_basicUsage();
    await example2_authenticatedWithContext();
    await example3_errorHandling();
    await example4_conversation();
    await example5_concurrentUsers();
    await example6_rateLimiting();
    await example7_inputValidation();
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ TODOS LOS EJEMPLOS COMPLETADOS\n');
    
  } catch (error) {
    console.error('\n❌ Error ejecutando ejemplos:', error);
  }
}

// Ejecutar si este archivo se corre directamente
if (require.main === module) {
  runAllExamples();
}

// Exportar funciones de ejemplo
export {
  example1_basicUsage,
  example2_authenticatedWithContext,
  example3_errorHandling,
  example4_conversation,
  example5_concurrentUsers,
  example6_rateLimiting,
  example7_inputValidation
};
