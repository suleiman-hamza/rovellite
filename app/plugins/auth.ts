import type { Profile } from '../../types/supabase'
import { defineNuxtPlugin, useRequestHeaders } from 'nuxt/app'
import { useProfileStore } from '@/stores/profile'

export default defineNuxtPlugin(async () => {
  const user = useState('authUser') // Shared state from useAuth
  const store = useProfileStore()

  // Fetch user-profile
  const headers = useRequestHeaders(['cookie']) as Record<string, string>
  const data = await $fetch<Profile | null>('/api/auth/user', { headers }).catch(() => null)

  user.value = data || null
  data ? (store.userProfile = data) : store.clearProfile()
})
