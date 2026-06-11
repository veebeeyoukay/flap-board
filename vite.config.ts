/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'sounds/flap.wav'],
      manifest: {
        name: 'flap-board',
        short_name: 'flap-board',
        description: 'Configurable split-flap display board',
        theme_color: '#0c0c0d',
        background_color: '#0c0c0d',
        display: 'standalone',
        orientation: 'landscape-primary',
        start_url: '/',
        icons: [
          {
            src: 'pwa-icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-icons/apple-touch.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,wav,woff2,webmanifest}'],
        runtimeCaching: [
          {
            urlPattern: /\.json(\?.*)?$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'flap-poll-snapshot',
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 5,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
              cacheableResponse: { statuses: [200] },
            },
          },
        ],
      },
    }),
  ],
  server: {
    host: true,
    port: 5173,
  },
  test: {
    environment: 'jsdom',
    environmentOptions: {
      jsdom: { url: 'http://localhost/' },
    },
    setupFiles: ['./tests/setup.ts'],
  },
});
