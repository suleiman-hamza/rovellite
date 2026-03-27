// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/google-fonts',
    '@nuxt/fonts',
    '@nuxt/image',
  ],
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

  routeRules: {
    '/': { prerender: true },
  },

  compatibilityDate: '2025-01-15',
  vite: {
    optimizeDeps: {
      include: [
        'embla-carousel-vue',
        'zod',
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
