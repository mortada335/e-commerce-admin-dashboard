import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Ecommerce Admin Dashboard',
        short_name: 'EcomAdmin',
        description: 'Production-ready ecommerce admin dashboard',
        theme_color: '#6366f1',
        background_color: '#0f0f12',
        display: 'standalone',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/localhost:8000\/api\/v1\/dashboard/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'dashboard-api',
              expiration: { maxEntries: 10, maxAgeSeconds: 300 },
            },
          },
          {
            urlPattern: /^https:\/\/localhost:8000\/api\/v1\/products/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'products-api',
              expiration: { maxEntries: 50, maxAgeSeconds: 600 },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1500,
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
