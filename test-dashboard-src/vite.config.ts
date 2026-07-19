import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: '../test-dashboard',
    emptyOutDir: false, // Maintain dashboard-data.json during builds
  }
})
