import { defineNuxtRouteMiddleware } from 'nuxt/app'
import { useAuth } from '@/composables/use-auth'
import { useProfileStore } from '@/stores/profile'

export default defineNuxtRouteMiddleware(async () => {
  const ADMIN_DASHBOARD_PATH = '/admin/dashboard'
  const USER_DASHBOARD_PATH = '/app/dashboard'

  const { getUser } = useAuth()
  const profileStore = useProfileStore()
  const firebaseUser = getUser()
  const cachedProfile = profileStore.getProfile().value

  // Use either Firebase Auth (client) or profile store (SSR hydrated by plugin) to detect session
  const hasSession = firebaseUser || cachedProfile

  if (hasSession) {
    // Profile is already loaded by auth plugin on SSR, or by previous navigation
    const role = cachedProfile?.role

    // Redirect them back to their appropriate dashboard
    return navigateTo(role === 'admin' ? ADMIN_DASHBOARD_PATH : USER_DASHBOARD_PATH)
  }
})
