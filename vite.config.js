import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'radix-vendor': [
            '@radix-ui/react-avatar',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-tabs',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-label',
            '@radix-ui/react-slot',
          ],
          'chart-vendor': ['recharts'],
          'utils-vendor': ['axios', 'clsx', 'class-variance-authority', 'tailwind-merge', 'lucide-react'],
        },
      },
    },
  },
})