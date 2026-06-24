import type { FirebaseOptions } from 'firebase/app' // Import for type assertion
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { defineNuxtPlugin, useRouter, useRuntimeConfig, useState } from 'nuxt/app'
import { useProfileStore } from '@/stores/profile'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public.firebase as FirebaseOptions
  const app = initializeApp(config)
  const auth = getAuth(app)

  const user = useState('authUser')
  const profileStore = useProfileStore()
  let isInitialized = false

  // Sync Firebase Auth state client-side
  onAuthStateChanged(auth, async (firebaseUser) => {
    user.value = firebaseUser

    const wasInitialized = isInitialized
    isInitialized = true

    if (firebaseUser) {
      // Fetch or refresh profile if missing
      if (!profileStore.getProfile().value) {
        await profileStore.fetchProfile(firebaseUser.uid, firebaseUser.email)
      }

      // Only perform auto-redirection on initial startup/persistence load
      // to avoid interrupting active login forms and claim syncing.
      if (!wasInitialized) {
        const currentRoute = useRouter().currentRoute.value
        const middleware = currentRoute.meta.middleware
        const isGuestRoute = middleware === 'guest' || (Array.isArray(middleware) && middleware.includes('guest'))

        if (isGuestRoute) {
          const role = profileStore.getProfile().value?.role
          const ADMIN_DASHBOARD_PATH = '/admin/dashboard'
          const USER_DASHBOARD_PATH = '/app/dashboard'
          navigateTo(role === 'admin' ? ADMIN_DASHBOARD_PATH : USER_DASHBOARD_PATH)
        }
      }
    }
    else {
      // User is signed out, clear the profile store
      profileStore.clearProfile()
    }
  })

  return {
    provide: {
      firebaseAuth: auth, // Provide auth instance
    },
  }
})
