import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Globals para no tener que importar describe, it, expect en cada archivo
    globals: true,
    
    // Entorno de ejecución
    environment: 'node',
    
    // Archivos de test
    include: ['src/**/*.{test,spec}.ts'],
    exclude: ['node_modules', 'lib', 'coverage'],
    
    // Setup files (equivalente a jest.setup.js)
    setupFiles: ['./vitest.setup.ts'],
    
    // Coverage (opcional)
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'lib/',
        'src/**/*.test.ts',
        'src/**/*.spec.ts',
        'src/types/**',
      ],
    },
    
    // Timeout
    testTimeout: 30000,
  },
});
