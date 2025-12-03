import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/', // Root domain deployment
  plugins: [react()],
  server: {
    allowedHosts: ['localhost', '127.0.0.1']
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          swiper: ['swiper', 'swiper/react'],
          particles: ['react-tsparticles', 'tsparticles-slim'],
        }
      }
    }
  }
})
