<script setup lang="ts">
import { applyActionCode, getAuth } from 'firebase/auth'

definePageMeta({
  layout: 'auth-layout',
})

const route = useRoute()
const toast = useToast()
const { verifyAccount } = useAuth()

const loading = ref(true)
const success = ref(false)
const errorMessage = ref('')

onMounted(async () => {
  // Extract the oobCode from the URL query parameters
  const actionCode = route.query.oobCode as string
  const mode = route.query.mode as string

  // verifying emails only
  if (!actionCode || mode !== 'verifyEmail') {
    errorMessage.value = 'Invalid or missing verification code.'
    loading.value = false
    return
  }

  try {
    const auth = getAuth()

    // Tell Firebase to verify this code
    await applyActionCode(auth, actionCode)

    // Wait for auth state to initialize
    await auth.authStateReady()

    if (auth.currentUser) {
      // If the user happens to be logged in on this browser (same device flow)
      // Force token refresh and hit the backend verify endpoint to update Supabase
      await verifyAccount()
      success.value = true
      toast.add({
        title: 'Email Verified',
        description: 'Your email has been successfully verified! You are now logged in.',
      })
      setTimeout(navigateTo, 4000, '/dashboard')
    }
    else {
      // If the user is on a different device or not logged in
      // The email is verified in Firebase, but they must log in to get a session
      success.value = true
      toast.add({
        title: 'Email Verified',
        description: 'Your email has been successfully verified! Please log in.',
      })
      setTimeout(navigateTo, 4000, '/login')
    }
  }
  catch (error: any) {
    errorMessage.value = error.message || 'The verification link is invalid or has expired.'
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4">
    <UCard class="w-full max-w-md text-center py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center">
        <UIcon name="i-lucide-loader-2" class="animate-spin text-5xl text-[#1177FE] mb-4" />
        <h2 class="text-xl font-semibold mb-2">
          Verifying your email...
        </h2>
        <p class="text-gray-500">
          Please wait while we confirm your email address.
        </p>
      </div>

      <!-- Success State -->
      <div v-else-if="success" class="flex flex-col items-center">
        <UIcon name="i-lucide-check-circle" class="text-5xl text-green-500 mb-4" />
        <h2 class="text-xl font-semibold mb-2">
          Email Verified!
        </h2>
        <p class="text-gray-500 mb-6">
          Redirecting you shortly...
        </p>
      </div>

      <!-- Error State -->
      <div v-else class="flex flex-col items-center">
        <UIcon name="i-lucide-x-circle" class="text-5xl text-red-500 mb-4" />
        <h2 class="text-xl font-semibold mb-2">
          Verification Failed
        </h2>
        <p class="text-gray-500 mb-6">
          {{ errorMessage }}
        </p>
        <UButton to="/login" class="bg-[#1177FE] text-white px-6">
          Go to Login
        </UButton>
      </div>
    </UCard>
  </div>
</template>
