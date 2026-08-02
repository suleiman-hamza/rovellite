// @ts-check
import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here
  antfu({
    // ignores: ['.agent/**'],
    ignores: ['.nuxt/**', 'dist/**', 'node_modules/**', 'public/**', 'coverage/**', '.output/**', '.agents/**'],
  }),

)
// eslint.config.mjs
