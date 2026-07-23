import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
  },
  test: {
    // Global configurations
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'json-summary'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/', 
        '**/node_modules/**', 
        'tests/', 
        '**/tests/**', 
        'setupTests.ts', 
        'setupBackendTests.ts',
        '**/.next/**',
        '**/frontend/.next/**',
        '**/backend/.next/**'
      ],
    },
  },
});
