
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: 'autoUpdate',

      includeAssets: [
        'favicon.svg',
        'pwa-icon.svg',
      ],

      manifest: {
        name: 'ZreaxerTools',
        short_name: 'ZreaxerTools',
        description:
          'Günlük hayatını kolaylaştıran ücretsiz çevrimiçi araçlar.',

        theme_color: '#101827',
        background_color: '#101827',

        display: 'standalone',
        orientation: 'any',
        start_url: '/',
        scope: '/',

        icons: [
          {
            src: '/pwa-icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },

      workbox: {
        navigateFallback: '/index.html',

        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,webp,woff,woff2}',
        ],
      },

      devOptions: {
        enabled: false,
      },
    }),
  ],
})
