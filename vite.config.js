import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // Pakai function untuk manualChunks (bukan object!)
      manualChunks: (id) => {
        if (id.includes('node_modules')) {
          if (id.includes('@supabase')) {
            return 'supabase'
          }
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor'
          }
          return 'vendor'
        }
      }
    },
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {
    include: ['@supabase/supabase-js', 'react', 'react-dom'],
  },
  resolve: {
    alias: {
      '@supabase/supabase-js': '@supabase/supabase-js',
    },
  },
})