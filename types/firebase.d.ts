import type { Auth } from 'firebase/auth'

// firebase auth interface
declare module 'nuxt/app' {
  interface NuxtApp {
    $firebaseAuth: Auth
  }
}
