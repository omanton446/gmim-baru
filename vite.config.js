import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', '@supabase/supabase-js'],
        },
      },
    },
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
  optimizeDeps: {
    include: ['@supabase/supabase-js', 'react', 'react-dom'],
    esbuildOptions: {
      target: 'es2020',
    },
  },
  resolve: {
    alias: {
      '@supabase/supabase-js': '@supabase/supabase-js',
    },
  },
})