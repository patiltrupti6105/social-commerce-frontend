import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Social Commerce Platform - Vite Configuration
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@/components/ui', replacement: path.resolve(__dirname, './components/ui') },
      { find: '@/hooks', replacement: path.resolve(__dirname, './hooks') },
      { find: '@/lib', replacement: path.resolve(__dirname, './lib') },
      { find: '@', replacement: path.resolve(__dirname, './src') },
    ],
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: ['.vercel.run', 'localhost', '127.0.0.1'],
  },
})
