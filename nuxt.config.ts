// https://nuxt.com/docs/api/configuration/nuxt-config
import process from 'node:process'

export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxtjs/google-fonts', '@nuxt/fonts', '@nuxt/image', '@pinia/nuxt', '@vueuse/nuxt'],
  // configuration for components in pages folders
  pages: {
    pattern: ['**/*.vue', '!**/components/**'],
  },
  // configuration for components in pages folders
  components: [
    '~/components',
    {
      path: '~/pages',
      pattern: '**/components/**',
      pathPrefix: false,
    },
  ],
  imports: {
    autoImport: true,
  },
  devtools: {
    enabled: true,
  },
  app: {
    head: {
      title: 'RovelSub-Point',
      // link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },],
      meta: [
        // a short description of the page. In some situations, this description is used in the snippet shown in search results.
        {
          name: 'description',
          content:
            'RovelSub Point Utility Application.',
        },
        { name: 'author', content: 'Suleiman Hamza' },
        { name: 'creator', content: 'ROVEL' },
        // The title of your page without any branding such as your site name.
        { property: 'og:title', content: 'RovelSub Point' },
        // A brief description of the content, usually between 2 and 4 sentences.
        {
          property: 'og:description',
          content:
            'Access airtime, data, subscriptions, and pay bills in one platform.',
        },
        // The URL of the image that appears when someone shares the content.
        // https://developers.facebook.com/docs/sharing/webmasters#images
        { property: 'og:image', content: 'https://rovellite.vercel.app/images/landing-page/rovel-new-logo.png' },
        { property: 'og:type', content: 'website' },
        // The canonical URL for your page.
        { property: 'og:url', content: 'https://rovellite.vercel.app/' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: 'https://rovellite.vercel.app/images/landing-page/rovel-new-logo.png' },
        { name: 'twitter:site', content: '@thee_hamza001' },
      ],
    },
  },

  css: ['~/assets/css/main.css'],
  ui: {
    colorMode: false,
  },
  runtimeConfig: {
    apisecret: '1234567',
    CORALPAY_USERNAME: process.env.CORALPAY_USERNAME,
    CORALPAY_PASSWORD: process.env.CORALPAY_PASSWORD,
    SECRET_KEY: process.env.PAYSTACK_SECRET_KEY,
    // PALMPAY_BACKEND_PUBLIC_KEY: process.env.PALMPAY_BACKEND_PUBLIC_KEY,
    palmpayAppId: process.env.PALMPAY_APP_ID ?? '',
    palmpayBaseUrl: process.env.PALMPAY_BASE_URL ?? '',
    palmpayPrivateKey: process.env.PALMPAY_PRIVATE_KEY ?? '',
    palmpayPublicKey: process.env.PALMPAY_PUBLIC_KEY ?? '',
    easeidBaseUrl: process.env.EASEID_BASE_URL ?? '',
    // Firebase Admin SDK
    // Private keys (Server-side only)
    firebaseAdminServiceAccount: process.env.FIREBASE_SERVICE_ACCOUNT_JSON
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
      : null,
    // firebaseAdminServiceAccount: JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON || '{}'),

    // Supabase SERVICE ROLE (server only)
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,

    public: {
      firebase: {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID,
      },

      // Flattened & explicit (matches server usage)
      supabaseUrl: process.env.SUPABASE_URL ?? '',
      supabaseAnonKey: process.env.SUPABASE_KEY ?? '',

      PALMPAY_MERCHANT_ID: 125010905579101,
    },
  },

  routeRules: {
    '/': { prerender: true },
  },

  compatibilityDate: '2025-01-15',
  vite: {
    server: {
      allowedHosts: ['handful-hangup-crushing.ngrok-free.dev'],
    },
    optimizeDeps: {
      include: [
        'embla-carousel-vue',
        'zod',
        'firebase/app',
        'firebase/auth',
        '@supabase/supabase-js',
        'maska/vue',
      ],
    },
  },
  eslint: {
    config: {
      standalone: false,
      stylistic: true,
    },
  },

  googleFonts: {
    families: {
      Poppins: true,
      Inter: '200..700',
    },
    preload: true,
    // display: 'swap',
  },
})
