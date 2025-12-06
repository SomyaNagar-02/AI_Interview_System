import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react() , tailwindcss()],
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