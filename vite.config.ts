
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures assets are loaded relatively (essential for Electron & Capacitor)
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    // Removed rollupOptions.external: ['electron'] to allow frontend bundling for Web/Android.
    // The frontend code provided does not import 'electron' directly, so this is safe.
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
})
