import type { User } from 'firebase/auth'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
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

  // Handle user sign up
  const signUp = async (email: string, password: string, name?: string) => {
    loading.value = true

    try {
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password,
      )

      // Sync and set session cookie via server route
      const idToken = await userCredential.user.getIdToken(true)
      const response = await $fetch('/api/auth/sync-user', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: {
          email: userCredential.user.email || email,
          name: userCredential.user.displayName || name || 'New User',
        },
      })

      if (response.success) {
        user.value = userCredential.user

        await sendEmailVerification(userCredential.user)
      }

      return userCredential.user
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

      // check if user is verified
      if (!userCredential.user.emailVerified) {
        return userCredential.user
      }

      // Sync and set session cookie via server route
      const idToken = await userCredential.user.getIdToken(true)
      const response = await $fetch('/api/auth/sync-user', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: {
          email: userCredential.user.email,
          name: userCredential.user.displayName || '',
        },
      })

      if (response.success) {
        user.value = userCredential.user
      }

      return userCredential.user
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

  // Handle resend email verification
  // const verifyEmail = async (user: User) => {
  //   await sendEmailVerification(user);
  // };

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
    signOutUser,
    isEmailVerified,
    getUser,
    loading,
    error,
  }
}
