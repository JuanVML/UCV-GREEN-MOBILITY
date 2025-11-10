interface ChatRequest {
  message: string;
  userId?: string;
  context?: string;
}

interface ChatResponse {
  response: string;
  timestamp: string;
  conversationId: string;
}

interface ConversationMessage {
  role: string;
  content: string;
  timestamp: string;
}

/**
 * 🔵 FASE REFACTOR - CÓDIGO MEJORADO Y LIMPIO
 * Mejora: Funciones auxiliares para mejor organización y mantenibilidad
 */

// 🔧 Función auxiliar para validar mensaje
const validateMessage = (message: string): void => {
  console.log('🔵 [HELPER] Ejecutando validación de mensaje...');
  
  if (!message || message.trim().length === 0) {
    console.log('🔵 [VALIDACIÓN] ❌ Mensaje inválido detectado');
    throw new Error('El mensaje es requerido');
  }
  
  console.log('🔵 [VALIDACIÓN] ✅ Mensaje válido');
};

// 🔧 Función auxiliar para generar ID de conversación
const generateConversationId = (userId?: string): string => {
  const userIdPart = userId || 'anonymous';
  const timestamp = Date.now();
  const conversationId = `conv_${userIdPart}_${timestamp}`;
  
  console.log('🔵 [HELPER] ConversationId generado:', conversationId);
  
  return conversationId;
};

// 🔧 Función auxiliar para crear respuesta simulada
const createSimulatedResponse = (message: string, conversationId: string): ChatResponse => {
  console.log('🔵 [HELPER] Generando respuesta simulada...');
  
  const response: ChatResponse = {
    response: `Gracias por tu mensaje: "${message}". Como asistente de movilidad sostenible, te recomiendo considerar opciones de transporte ecológico como bicicletas, transporte público eléctrico o caminar cuando sea posible. ¿Te gustaría saber más sobre alguna opción específica?`,
    timestamp: new Date().toISOString(),
    conversationId,
  };
  
  console.log('🔵 [HELPER] Respuesta creada exitosamente');
  
  return response;
};

export const sendMessage = async (requestData: any): Promise<ChatResponse> => {
  try {
    console.log('\n🔵 ═══════════════════════════════════════');
    console.log('🔵 FASE REFACTOR - Iniciando sendMessage...');
    console.log('🔵 [MEJORA] Usando funciones auxiliares para código más limpio');
    console.log('🔵 ═══════════════════════════════════════');
    
    const { message, userId, context }: ChatRequest = requestData;
    
    console.log('🔵 Datos recibidos:');
    console.log('   - Mensaje:', `"${message}"`);
    console.log('   - UserId:', userId || 'anonymous');
    console.log('');
    
    // ✅ Usar función auxiliar para validar (código más limpio y reutilizable)
    validateMessage(message);
    
    console.log('');
    
    // ✅ Generar ID de conversación con función auxiliar
    const conversationId = generateConversationId(userId);
    
    console.log('');
    
    // ✅ Crear respuesta con función auxiliar
    const response = createSimulatedResponse(message, conversationId);

    console.log('');
    console.log('🔵 [ÉXITO] ✅ Proceso completado con código refactorizado');
    console.log('   - Response:', response.response.substring(0, 50) + '...');
    console.log('   - ConversationId:', response.conversationId);
    console.log('   - Timestamp:', response.timestamp);
    console.log('');
    
    // TODO: Aquí integrar con Gemini API real en producción
    // const geminiResponse = await callGeminiAPI(message, context);
    
    return response;

  } catch (error) {
    console.error('🔵 [CATCH] Error capturado:', error);
    
    if (error instanceof Error && error.message === 'El mensaje es requerido') {
      console.log('🔵 [CORRECTO] ✅ Relanzando error de validación\n');
      throw error;
    }
    
    throw new Error('Error interno del servidor');
  }
};

export const getChatHistoryService = async (
  userId: string, 
  limit: number = 50
): Promise<{ messages: ConversationMessage[]; count: number; userId: string }> => {
  try {
    // Aplicar límite máximo
    const finalLimit = Math.min(limit, 50);
    
    const mockHistory: ConversationMessage[] = [];
    
    return {
      messages: mockHistory.slice(0, finalLimit),
      count: mockHistory.length,
      userId
    };
  } catch (error) {
    console.error('Error en getChatHistory:', error);
    throw new Error('Error obteniendo historial');
  }
};

export const setMobilityContext = (): string => {
  return `Eres un asistente especializado en movilidad sostenible para estudiantes de la Universidad César Vallejo (UCV) en Lima Norte, Perú.`;
};

// 🧪 SUITE COMPLETA DE PRUEBAS - FASE REFACTOR
console.log('\n\n🧪 ═══════════════════════════════════════════════════════');
console.log('🧪 EJECUTANDO SUITE COMPLETA DE PRUEBAS - FASE REFACTOR');
console.log('🧪 ═══════════════════════════════════════════════════════\n');

// TEST 1: Mensaje vacío
console.log('📝 TEST 1: Mensaje vacío (debe rechazar)');
sendMessage({ message: '', userId: 'user123' })
  .then(() => {
    console.log('\n❌ FALLO: No debería aceptar mensaje vacío\n');
  })
  .catch(error => {
    console.log('\n✅ ÉXITO: Rechazó correctamente mensaje vacío');
    console.log('   Error capturado:', error.message);
    console.log('');
  });

// TEST 2: Mensaje con espacios
setTimeout(() => {
  console.log('📝 TEST 2: Mensaje con solo espacios (debe rechazar)');
  sendMessage({ message: '    ', userId: 'user456' })
    .then(() => {
      console.log('\n❌ FALLO: No debería aceptar solo espacios\n');
    })
    .catch(error => {
      console.log('\n✅ ÉXITO: Rechazó correctamente mensaje con espacios');
      console.log('   Error capturado:', error.message);
      console.log('');
    });
}, 500);

// TEST 3: Mensaje válido con userId
setTimeout(() => {
  console.log('📝 TEST 3: Mensaje válido con userId (debe procesar)');
  sendMessage({ message: '¿Cómo llego a la UCV en bici?', userId: 'user789' })
    .then(response => {
      console.log('\n✅ ÉXITO: Procesó correctamente mensaje válido');
      console.log('   ConversationId:', response.conversationId);
      console.log('   Contiene userId "user789":', response.conversationId.includes('user789'));
      console.log('');
    })
    .catch(error => {
      console.log('\n❌ FALLO: No debería rechazar mensaje válido');
      console.log('   Error:', error.message);
      console.log('');
    });
}, 1000);

// TEST 4: Usuario anónimo
setTimeout(() => {
  console.log('📝 TEST 4: Usuario anónimo (debe procesar)');
  sendMessage({ message: '¿Opciones de transporte público?' })
    .then(response => {
      console.log('\n✅ ÉXITO: Procesó usuario anónimo correctamente');
      console.log('   ConversationId:', response.conversationId);
      console.log('   Contiene "anonymous":', response.conversationId.includes('anonymous'));
      console.log('');
    })
    .catch(error => {
      console.log('\n❌ FALLO: No debería rechazar usuario anónimo');
      console.log('   Error:', error.message);
      console.log('');
    });
}, 1500);

// TEST 5: Mensaje largo
setTimeout(() => {
  console.log('📝 TEST 5: Mensaje largo (debe procesar)');
  sendMessage({ 
    message: '¿Cuáles son las mejores rutas en bicicleta desde Los Olivos hasta la UCV considerando seguridad y ciclovías disponibles?',
    userId: 'user999'
  })
    .then(response => {
      console.log('\n✅ ÉXITO: Procesó mensaje largo correctamente');
      console.log('   ConversationId:', response.conversationId);
      console.log('   Timestamp válido:', response.timestamp.length > 0);
      console.log('');
    })
    .catch(error => {
      console.log('\n❌ FALLO: No debería rechazar mensaje largo');
      console.log('   Error:', error.message);
      console.log('');
    });
}, 2000);

// TEST 6: Verificar que todas las funciones auxiliares funcionan
setTimeout(() => {
  console.log('📝 TEST 6: Verificar funciones auxiliares');
  
  try {
    // Probar validateMessage
    validateMessage('Mensaje de prueba');
    console.log('   ✅ validateMessage funciona');
    
    // Probar generateConversationId
    const id1 = generateConversationId('testUser');
    const id2 = generateConversationId();
    console.log('   ✅ generateConversationId funciona');
    console.log('      - Con userId:', id1.includes('testUser'));
    console.log('      - Sin userId (anónimo):', id2.includes('anonymous'));
    
    // Probar createSimulatedResponse
    const testResponse = createSimulatedResponse('Test', 'conv_test_123');
    console.log('   ✅ createSimulatedResponse funciona');
    console.log('      - Tiene respuesta:', testResponse.response.length > 0);
    console.log('      - Tiene timestamp:', testResponse.timestamp.length > 0);
    console.log('');
    
  } catch (error) {
    console.log('   ❌ Error en funciones auxiliares:', error);
  }
}, 2500);

setTimeout(() => {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('✅ SUITE DE PRUEBAS COMPLETADA - FASE REFACTOR');
  console.log('═══════════════════════════════════════════════════════');
  console.log('\n📊 MEJORAS IMPLEMENTADAS:');
  console.log('   ✅ Código modular con funciones auxiliares');
  console.log('   ✅ Mejor organización y legibilidad');
  console.log('   ✅ Funciones reutilizables');
  console.log('   ✅ Más fácil de mantener y testear');
  console.log('   ✅ Separación de responsabilidades');
  console.log('\n🎯 RESULTADO TDD:');
  console.log('   🔴 ROJO    → Escribimos la prueba que falla');
  console.log('   🟢 VERDE   → Código mínimo que funciona');
  console.log('   🔵 REFACTOR → Código mejorado y limpio');
  console.log('');
}, 3000);