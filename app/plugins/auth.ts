import type { Profile } from '../../types/supabase'
import { defineNuxtPlugin } from 'nuxt/app'
import { useProfileStore } from '@/stores/profile'

export default defineNuxtPlugin(async () => {
  const user = useState('authUser') // Shared state from useAuth
  const store = useProfileStore()

  // Fetch user-profile
  const data = await $fetch<Profile | null>('/api/auth/user').catch(() => null)

  user.value = data || null
  data ? (store.userProfile = data) : store.clearProfile()
})
