// API service para comunicación con el chatbot Gemini
import { GoogleGenerativeAI } from '@google/generative-ai';

// Función para obtener la API key
const getApiKey = (): string => {
  let apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  
  // Fallback directo si no hay variables de entorno
  if (!apiKey) {
    apiKey = '***REMOVED***';
  }
  
  return apiKey || '';
};

// Configuración de Gemini AI
const API_KEY = getApiKey();
let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

// Inicializar Gemini AI
if (API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  } catch (error) {
    // Error inicializando Gemini AI - fallback a respuestas simuladas
  }
}

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

// Contexto especializado para UCV Green Mobility - SEDE LIMA NORTE
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

// Función para generar respuestas contextuales según el mensaje (FALLBACK)
const getContextualResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  // Respuestas sobre rutas y ubicación - ESPECÍFICO LIMA NORTE
  if (lowerMessage.includes('ruta') || lowerMessage.includes('llegar') || lowerMessage.includes('ubicación') || lowerMessage.includes('ucv')) {
    return `🎯 Para armarte la ruta perfecta hacia UCV SEDE LIMA NORTE necesito:

📍 **¿Desde dónde partes en Lima Norte?**
• Los Olivos: Pro, Mercado Central, Parque Zonal
• Independencia: Tahuantinsuyo, Túpac Amaru, Ermitaño  
• SMP: Fiori, Santa Rosa, Condevilla
• Comas: Collique, El Retablo, Santa Luzmila
• Puente Piedra: Cercado, Shangrila

🕐 **¿A qué hora empiezan tus clases?**

Con esa info te doy ruta exacta en bicicleta �‍♂️ o scooter eléctrico 🛴

¡Escribe tu zona exacta de Lima Norte! 🚀`;
  }

  // Respuesta específica para Tahuantinsuyo
  if (lowerMessage.includes('tahuantinsuyo') || lowerMessage.includes('tahuantisuyo')) {
    return `🏔️ **Tahuantinsuyo, Independencia** - ¡Perfecto!

Para darte la ruta exacta desde el cerro necesito saber:

🕐 **¿A qué hora empiezan tus clases?**
- 7:00 AM (turno mañana)
- 1:00 PM (turno tarde) 
- 6:00 PM (turno noche)
- Otra hora específica

📍 **¿En qué zona exacta de Tahuantinsuyo?**
- 1ra zona (más cerca a Av. Túpac Amaru)
- 4ta zona (parte alta del cerro)
- Otra zona específica

Con esto te armo el recorrido perfecto bajando del cerro hacia UCV 🚴‍♂️`;
  }

  // Respuesta cuando menciona horarios
  if (lowerMessage.includes('hora') || lowerMessage.includes('clase') || lowerMessage.includes('am') || lowerMessage.includes('pm')) {
    return `⏰ ¡Perfecto! Ya tengo tu horario.

Ahora necesito tu **ubicación exacta**:
📍 ¿Desde dónde partes hacia la UCV?

Escribe el lugar específico, ejemplo:
• "Tahuantinsuyo 4ta zona"
• "Pro Los Olivos sector 2"
• "Micaela Bastidas"
• "Villa El Salvador"

¡Con eso te doy tu ruta personalizada! 🎯`;
  }

  // Respuestas específicas por distrito mejoradas
  if (lowerMessage.includes('los olivos') || lowerMessage.includes('olivos')) {
    return `🚴‍♂️ **Ruta desde Los Olivos a UCV:**

🕐 **¿A qué hora son tus clases?**
Te ayudo a calcular cuándo salir.

**Ruta Opción 1 (15-20 min bicicleta):**
• Jr. Las Palmeras → Av. Carlos Izaguirre
• Av. Carlos Izaguirre → Av. Alfredo Mendiola
• Av. Alfredo Mendiola → UCV (ciclovia protegida)

🛴 **Opción Scooter (10-12 min):**
• Mismo recorrido, más rápido
• Distancia: ~4.5 km

¡Dime tu horario y te calculo cuándo salir! ⏰`;
  }

  if (lowerMessage.includes('san martín') || lowerMessage.includes('san martin')) {
    return `🚴‍♂️ **Ruta desde San Martín de Porres a UCV:**

🕐 **¿A qué hora empiezan tus clases?**

**Ruta Recomendada (12-18 min bicicleta):**
• Av. Perú → Av. Universitaria
• Av. Universitaria → Av. Alfredo Mendiola
• Av. Alfredo Mendiola → UCV

🛴 **Opción Scooter (8-10 min):**
• Misma ruta, más eficiente
• Distancia: ~3.8 km

**⚠️ Importante:** Tramo Av. Perú sin ciclovia - ir despacio

¡Escribe tu horario para el tiempo de salida exacto! ⏰`;
  }

  if (lowerMessage.includes('independencia')) {
    // Si no especifica Tahuantinsuyo, pregunta por la zona exacta
    if (!lowerMessage.includes('tahuantinsuyo')) {
      return `📍 **Independencia** - necesito ser más específico:

¿Desde qué zona exacta de Independencia?
• Tahuantinsuyo (1ra, 2da, 3ra, 4ta zona)
• El Ermitaño
• Túpac Amaru
• Payet
• Otra zona

🕐 **También necesito:** ¿A qué hora son tus clases?

Con esa info te doy la ruta exacta desde tu zona específica 🎯`;
    }
  }

  // Respuestas sobre carpooling/compartir vehículo
  if (lowerMessage.includes('carpool') || lowerMessage.includes('compartir') || lowerMessage.includes('compañeros') || lowerMessage.includes('grupo')) {
    return `🚗👥 **Carpooling hacia UCV:**

🕐 **¿A qué hora van a clases?**
• Turno mañana (7:00 AM)
• Turno tarde (1:00 PM)  
• Turno noche (6:00 PM)

📍 **¿Desde qué zona organizan el carpooling?**

💡 **Consejos para organizar:**
✅ Grupo WhatsApp por zona
✅ Dividir gastos de combustible
✅ Rutas que beneficien a todos
✅ Horarios fijos de recogida

¡Dime horario y zona para ayudarte mejor! 🎯`;
  }

  // Respuestas sobre transporte sostenible
  if (lowerMessage.includes('sostenible') || lowerMessage.includes('ecológico') || lowerMessage.includes('verde') || lowerMessage.includes('medio ambiente')) {
    return `🌱 **¡Excelente elección de movilidad sostenible!**

🕐 **¿A qué hora son tus clases?**
📍 **¿Desde dónde partes hacia UCV?**

**Opciones sostenibles disponibles:**
🚴‍♂️ **Bicicleta**: 0% emisiones, ejercicio gratis
🛴 **Scooter eléctrico**: Rápido y limpio
🚶‍♂️ **Caminar**: Si vives cerca (menos de 2km)

Con tu ubicación y horario te armo el plan perfecto 🎯`;
  }

  // Respuestas sobre bicicletas y scooters mejorada
  if (lowerMessage.includes('bicicleta') || lowerMessage.includes('bike') || lowerMessage.includes('scooter') || lowerMessage.includes('ciclovia')) {
    return `🚴‍♂️🛴 **¡Excelente elección!**

Para darte la ruta exacta necesito:

🕐 **¿A qué hora empiezan tus clases?**
📍 **¿Desde dónde partes exactamente?**

**Ejemplos de ubicación específica:**
• "Tahuantinsuyo 4ta zona, Independencia"
• "Pro Los Olivos sector 2"
• "Micaela Bastidas, San Martín"

**Te daré:**
✅ Ruta calle por calle
✅ Hora de salida recomendada
✅ Tiempo estimado de viaje
✅ Consejos de seguridad

¡Escribe ubicación y horario! 🎯`;
  }

  // Respuestas sobre tráfico
  if (lowerMessage.includes('tráfico') || lowerMessage.includes('tránsito') || lowerMessage.includes('congestión')) {
    return `🚦 **Info de Tráfico para ciclistas:**

🕐 **¿A qué hora necesitas llegar a UCV?**
📍 **¿Desde dónde partes?**

**Horarios con menos tráfico:**
✅ 9:00 AM - 11:00 AM
✅ 2:00 PM - 4:00 PM
✅ Después de 8:00 PM

**Ventaja bicicleta/scooter:**
🚴‍♂️ No se afecta por tráfico vehicular
🛴 Usa ciclovías exclusivas
⚡ Siempre más rápido que buses en horas pico

¡Dime tu horario y ubicación para la ruta perfecta! 🎯`;
  }

  // Respuestas sobre eventos universitarios
  if (lowerMessage.includes('evento') || lowerMessage.includes('actividad') || lowerMessage.includes('semana')) {
    return `🎓 **Eventos Universitarios:**

🕐 **¿A qué hora es el evento?**
📍 **¿Desde dónde partes?**

**Para eventos especiales recomiendo:**
🚴‍♂️ **Bicicleta**: Evita el tráfico extra
🛴 **Scooter**: Llega rápido y sin sudar
🕐 **Sal 15 min antes**: Por mayor afluencia

**Estacionamiento en UCV:**
✅ Área de bicicletas disponible
✅ Seguridad del campus
✅ Gratis para estudiantes

¡Escribe horario y ubicación para tu plan de ruta! 🎯`;
  }

  // Respuesta por defecto mejorada
  return `¡Hola! Soy AsistenteMobil 🚴‍♂️

Te ayudo con rutas seguras hacia la UCV usando:
🚴‍♂️ **Bicicleta** - Ciclovías protegidas
🛴 **Scooter eléctrico** - Rutas rápidas

Para darte la mejor ruta, necesito saber:

📍 **¿Desde dónde partes?** (zona específica)
🕐 **¿A qué hora son tus clases?**

¡Escribe ambos datos y te armo tu ruta personalizada! 🎯`;
};

/**
 * Envía un mensaje al chatbot Gemini
 */
export const sendMessageToGemini = async (
  message: string,
  userId?: string,
  context?: string
): Promise<ChatResponse> => {
  try {
    // Verificar que tenemos API key y modelo inicializado
    if (!API_KEY || !model) {
      // Usar respuestas simuladas si no hay API key
      return new Promise((resolve) => {
        setTimeout(() => {
          const responses = getContextualResponse(message);
          resolve({
            response: responses,
            timestamp: new Date().toISOString(),
            conversationId: `conv_simulated_${Date.now()}`,
          });
        }, 800);
      });
    }

    // Crear el prompt completo con contexto UCV
    const fullPrompt = `
      ${getUCVContext()}
      
      CONTEXTO DE LA CONVERSACIÓN:
      ${context || 'Nueva conversación iniciada'}
      
      USUARIO PREGUNTA: ${message}
      
      METODOLOGÍA DE RESPUESTA OBLIGATORIA:
      1. Si el usuario pregunta por rutas y NO ha mencionado horario de clases → pregúntale "¿A qué hora empiezan tus clases?"
      2. Si ya tienes ubicación + horario → da ruta específica calle por calle con hora de salida
      3. Reconoce ubicaciones específicas como Tahuantinsuyo, Pro Los Olivos, zonas altas, cerros
      4. SOLO recomienda bicicleta 🚴‍♂️ y scooter eléctrico 🛴, NUNCA buses/taxis
      5. Para zonas con subidas/cerros: agrega 5-10 min extra al tiempo estimado
      6. Usa tu conocimiento geográfico real de Lima para dar calles exactas
      
      Responde en español, máximo 150 palabras, usa emojis.
    `;

    // Llamada real a la API de Gemini
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();

    return {
      response: text,
      timestamp: new Date().toISOString(),
      conversationId: `conv_${userId || 'anonymous'}_${Date.now()}`,
    };

  } catch (error) {
    // Error con Gemini API - fallback a respuestas simuladas
    
    // Fallback a respuestas simuladas en caso de error
    const fallbackResponse = getContextualResponse(message);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          response: fallbackResponse,
          timestamp: new Date().toISOString(),
          conversationId: `conv_fallback_${Date.now()}`,
        });
      }, 800);
    });
  }
};

/**
 * Obtiene el historial de conversación
 */
export const getChatHistory = async (
  userId: string,
  limit: number = 50
): Promise<ChatMessage[]> => {
  try {
    // Simulación temporal
    return [];
  } catch (error) {
    // Error obteniendo historial
    return [];
  }
};
