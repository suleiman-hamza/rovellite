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
      meta: [
        { name: 'description', content: 'RovelSub Point Utility Application' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true },
  },

  compatibilityDate: '2025-01-15',

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
