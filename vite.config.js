import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // shadcn/ui components live at the root-level components/ folder.
      // This alias must be listed BEFORE the generic '@' alias so Vite
      // matches '@/components/ui/...' here first.
      '@/components/ui': path.resolve(__dirname, './components/ui'),
      // theme-provider is also at root components/
      '@/components/theme-provider': path.resolve(__dirname, './components/theme-provider'),
      // Everything else under @/ (contexts, pages, api, lib, etc.) lives in src/
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
})
