import type { FirebaseOptions } from 'firebase/app' // Import for type assertion
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public.firebase as FirebaseOptions
  const app = initializeApp(config)
  const auth = getAuth(app)

  return {
    provide: {
      firebaseAuth: auth, // Provide auth instance
    },
  }
})
