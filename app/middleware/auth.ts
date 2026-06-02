import { defineNuxtRouteMiddleware } from 'nuxt/app'
import { useAuth } from '@/composables/use-auth'
import { useProfileStore } from '@/stores/profile'

export default defineNuxtRouteMiddleware(async (to) => {
  const { getUser } = useAuth()
  const profileStore = useProfileStore()

  // Skip auth check for public pages
  const publicPaths = ['/login', '/register']
  if (publicPaths.includes(to.path))
    return

  const firebaseUser = getUser()

  // Redirect unauthenticated users
  if (!firebaseUser)
    return navigateTo('/login')

  // Fetch profile if missing
  if (!profileStore.getProfile().value && !profileStore.loading) {
    await profileStore.fetchProfile()
  }

  // Retry once if profile still missing
  if (!profileStore.getProfile().value) {
    await profileStore.fetchProfile()

    // Redirect if profile still unavailable
    if (!profileStore.getProfile().value) {
      return navigateTo('/login')
    }
  }

  // Role-Based Access Guard
  const currentProfile = profileStore.getProfile().value
  const isAdminRoute = to.path.startsWith('/admin')

  // If a standard user tries to access an admin route, boot them to the standard dashboard
  if (isAdminRoute && currentProfile?.role !== 'admin') {
    return navigateTo('/app/dashboard') // Redirect non-admins to user dashboard
  }
})
