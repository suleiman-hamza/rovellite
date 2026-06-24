import { defineNuxtRouteMiddleware } from 'nuxt/app'
import { useAuth } from '@/composables/use-auth'
import { useProfileStore } from '@/stores/profile'

export default defineNuxtRouteMiddleware(async (to) => {
  const LOGIN_PATH = '/login'
  const USER_DASHBOARD_PATH = '/app/dashboard'
  const ADMIN_DASHBOARD_PATH = '/admin/dashboard'
  const ADMIN_PATH = '/admin'
  const USER_APP_PATH = '/app'

  const { getUser } = useAuth()
  const profileStore = useProfileStore()

  const firebaseUser = getUser()
  const cachedProfile = profileStore.getProfile().value

  // Use either Firebase Auth (client) or profile store (SSR hydrated by plugin) to detect session
  const hasSession = firebaseUser || cachedProfile

  // Redirect unauthenticated users
  if (!hasSession)
    return navigateTo(LOGIN_PATH)

  // Fetch profile if missing (e.g. client-side navigation with only Firebase session)
  if (!cachedProfile && !profileStore.loading) {
    await profileStore.fetchProfile()
  }

  // Retry once if profile still missing
  if (!profileStore.getProfile().value) {
    await profileStore.fetchProfile()

    // Redirect if profile still unavailable
    if (!profileStore.getProfile().value) {
      return navigateTo(LOGIN_PATH)
    }
  }

  // Role-Based Access Guard
  const currentProfile = profileStore.getProfile().value
  const isAdminRoute = to.path.startsWith(ADMIN_PATH)
  const isUserAppRoute = to.path.startsWith(USER_APP_PATH)

  // If a standard user tries to access an admin route, redirect to user dashboard
  if (isAdminRoute && currentProfile?.role !== 'admin') {
    return navigateTo(USER_DASHBOARD_PATH)
  }

  // If an admin tries to access a user route, redirect to admin dashboard
  if (isUserAppRoute && currentProfile?.role === 'admin') {
    return navigateTo(ADMIN_DASHBOARD_PATH)
  }
})
