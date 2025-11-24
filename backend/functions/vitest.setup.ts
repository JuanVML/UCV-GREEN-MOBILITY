/**
 * Vitest setup file
 * Configuración de variables de entorno para tests
 */

// Cargar .env ANTES de los tests
import { config } from 'dotenv';
config();

// Configurar el entorno de test
process.env.NODE_ENV = 'test';

// Si necesitas más configuración global, agrégala aquí
