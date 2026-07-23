import { defineWorkspace } from 'vitest/config';
import path from 'path';

export default defineWorkspace([
  {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './backend/src'),
        'bcryptjs': path.resolve(__dirname, './node_modules/bcryptjs'),
      },
    },
    esbuild: {
      jsx: 'automatic',
    },
    test: {
      name: 'backend',
      root: './backend',
      environment: 'node',
      globals: true,
      include: ['../tests/unit/**/*.test.ts', '../tests/api/**/*.test.ts'],
      setupFiles: ['../setupBackendTests.ts'],
    },
  },
  {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './frontend/src'),
        'next/link': path.resolve(__dirname, './frontend/tests/ui/__mocks__/next-link.tsx'),
        'react': path.resolve(__dirname, './node_modules/react'),
        'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
        'react/jsx-runtime': path.resolve(__dirname, './node_modules/react/jsx-runtime.js'),
      },
      dedupe: ['react', 'react-dom'],
    },
    esbuild: {
      jsx: 'automatic',
    },
    test: {
      name: 'frontend',
      root: './frontend',
      environment: 'jsdom',
      globals: true,
      include: ['tests/ui/**/*.test.tsx'],
      setupFiles: ['../setupTests.ts'],
    },
  },
]);
