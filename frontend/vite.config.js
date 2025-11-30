import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // String to look for
      '/api': {
        target: 'http://localhost:8000', // Your Backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
})