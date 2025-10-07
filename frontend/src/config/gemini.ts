// Configuración para integrar con la API real de Gemini
// Para usar en producción, necesitarás obtener una API key gratuita de Google AI Studio

export const GEMINI_CONFIG = {
  // Obtén tu API key gratuita en: https://ai.google.dev/
  API_KEY: process.env.EXPO_PUBLIC_GEMINI_API_KEY || 'your-gemini-api-key-here',
  MODEL: 'gemini-pro',
  
  // Configuraciones de la conversación
  GENERATION_CONFIG: {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024,
  },

  // Configuraciones de seguridad
  SAFETY_SETTINGS: [
    {
      category: "HARM_CATEGORY_HARASSMENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      category: "HARM_CATEGORY_HATE_SPEECH", 
      threshold: "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
      threshold: "BLOCK_MEDIUM_AND_ABOVE"
    }
  ]
};

// Contexto específico para UCV Green Mobility
export const UCV_CONTEXT = `
Eres el asistente virtual oficial de UCV Green Mobility, una iniciativa de movilidad sostenible de la Universidad César Vallejo.

INFORMACIÓN CLAVE:
- Universidad César Vallejo (UCV), Lima Norte, Perú
- Enfoque en transporte sostenible para estudiantes
- Horarios universitarios: 7:00 AM - 10:00 PM
- Zona: Los Olivos, San Martín de Porres, Independencia

OPCIONES DE TRANSPORTE:
1. 🚴‍♂️ Bicicleta: Ciclovías en Av. Venezuela, Av. Alfredo Mendiola
2. 🚌 Metropolitano: Estaciones Naranjal, Universitaria  
3. 🚶‍♂️ Caminar: Para distancias cortas, más saludable
4. 🚗 Carpooling: Compartir vehículo entre estudiantes

RESPONDE SIEMPRE:
- Con información práctica y útil
- Priorizando opciones sostenibles
- De manera amigable y cercana
- Usando emojis para mejor comunicación
- Considerando el presupuesto estudiantil

TEMAS QUE MANEJAS:
- Rutas hacia UCV
- Condiciones del tráfico
- Estado del clima
- Eventos universitarios
- Consejos de movilidad sostenible
- Seguridad en el transporte
`;

export default { GEMINI_CONFIG, UCV_CONTEXT };