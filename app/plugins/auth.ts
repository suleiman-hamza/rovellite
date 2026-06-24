import type { Profile } from '../../types/supabase'
import { defineNuxtPlugin, useRequestHeaders } from 'nuxt/app'
import { useProfileStore } from '@/stores/profile'

export default defineNuxtPlugin(async () => {
  const store = useProfileStore()

  // Hydrate profile store from server session cookie
  // NOTE: Do NOT set useState('authUser') here — that state is typed as Firebase User
  // and must only be populated by Firebase Auth on the client side.
  const headers = useRequestHeaders(['cookie']) as Record<string, string>
  const data = await $fetch<Profile | null>('/api/auth/user', { headers }).catch(() => null)

  data ? (store.userProfile = data) : store.clearProfile()
})
