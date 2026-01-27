import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './setupTests.ts',
  },
  build: {
    outDir: '../ecommerce-backend/dist' // When we run npm run build (vite build), the code is saved in ecommerce-backend/dist folder so that we can upload to AWS backend and frontend together
  }
});