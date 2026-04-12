import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Social Commerce Platform - Vite Configuration
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components/ui': path.resolve(__dirname, './components/ui'),
      '@/hooks': path.resolve(__dirname, './hooks'),
      '@/lib': path.resolve(__dirname, './lib'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: ['.vercel.run', 'localhost', '127.0.0.1'],
  },
})
