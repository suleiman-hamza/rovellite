import type { User } from 'firebase/auth'
import type { SignupInput } from '~~/shared/validations/auth'
import {
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { ref } from 'vue'

// Authethentication composable
export function useAuth() {
  const { $firebaseAuth: firebaseAuth } = useNuxtApp() // Access $firebaseAuth
  const user = useState<User | null>('authUser', () => null) // Use state for SSR-safe access
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Handle user sign up (Server-Driven)
  const signUp = async (payload: SignupInput) => {
    loading.value = true

    try {
      const response = await $fetch('/api/auth/signup', {
        method: 'POST',
        body: payload,
      })

      return response
    }
    catch (err: any) {
      error.value = err.message
      throw err
    }
    finally {
      loading.value = false
    }
  }

  // Handle user sign in
  const signIn = async (email: string, password: string) => {
    loading.value = true

    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password)

      // check if user is verified on client
      if (!userCredential.user.emailVerified) {
        throw new Error('Email not verified. Please verify your email before logging in.')
      }

      // Hit login endpoint to strictly verify on backend and get session
      const idToken = await userCredential.user.getIdToken(true)
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      })

      if (response.success) {
        user.value = userCredential.user
      }

      return userCredential.user
    }
    catch (err: any) {
      error.value = err.message
      // If the backend returns 403 because email isn't verified (even if client bypassed it)
      if (err.response?.status === 403) {
        error.value = 'Email not verified. Please verify your email before logging in.'
      }
      throw err
    }
    finally {
      loading.value = false
    }
  }

  // Handle account verification after clicking email link
  const verifyAccount = async () => {
    loading.value = true
    try {
      // Force reload the user to get the latest emailVerified status from Firebase
      await firebaseAuth.currentUser?.reload()
      const currentUser = firebaseAuth.currentUser

      if (!currentUser || !currentUser.emailVerified) {
        throw new Error('Email is still not verified. Check your inbox or try again.')
      }

      const idToken = await currentUser.getIdToken(true)
      const response = await $fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      })

      if (response.success) {
        user.value = currentUser
        return true
      }
      return false
    }
    catch (err: any) {
      error.value = err.message
      throw err
    }
    finally {
      loading.value = false
    }
  }

  // Handle user sign out
  const signOutUser = async () => {
    loading.value = true

    try {
      const result = await $fetch('/api/auth/logout', {
        method: 'POST',
      })

      await signOut(firebaseAuth)
      if (!result.success) {
        throw new Error('Failed to log out on server')
      }
      else {
        user.value = null
        return result
      }
    }
    catch (err: any) {
      error.value = err.message
      throw err
    }
    finally {
      loading.value = false
    }
  }

  // Check if email is verified
  const isEmailVerified = (u?: User) => {
    if (u)
      return !!u.emailVerified
    return !!user.value?.emailVerified
  }

  const getUser = () => user.value

  return {
    signUp,
    signIn,
    verifyAccount,
    signOutUser,
    isEmailVerified,
    getUser,
    loading,
    error,
  }
}
