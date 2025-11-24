/**
 * Configuración del módulo de Chatbot
 * Usa funciones para acceso lazy de las variables de entorno
 */

// Función para obtener la API key en runtime
function getApiKey(): string {
  return process.env.GEMINI_API_KEY || process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
}

export const config = {
  // Variables de entorno (evaluadas lazy)
  gemini: {
    get apiKey() { return getApiKey(); },
    model: 'gemini-2.0-flash',
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024,
  },
  
  // Configuración de ambiente
  environment: {
    get isDevelopment() { return process.env.NODE_ENV === 'development'; },
    get isProduction() { return process.env.NODE_ENV === 'production'; },
    get isTesting() { return process.env.NODE_ENV === 'test'; },
  },
  
  // Configuración de logging
  logging: {
    get enabled() { return process.env.NODE_ENV !== 'production'; },
    get verbose() { return process.env.LOG_LEVEL === 'verbose'; },
  }
};

// Validar configuración crítica
export function validateConfig(): void {
  if (!config.gemini.apiKey) {
    throw new Error(
      '❌ GEMINI_API_KEY no configurada. ' +
      'Agrega GEMINI_API_KEY o EXPO_PUBLIC_GEMINI_API_KEY a tus variables de entorno.'
    );
  }
  
  if (config.gemini.apiKey === 'your-gemini-api-key-here') {
    throw new Error(
      '❌ GEMINI_API_KEY tiene valor por defecto. ' +
      'Configura una API key válida.'
    );
  }
}
