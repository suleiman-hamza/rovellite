import type { Profile } from '../../types/supabase'
import { defineNuxtPlugin } from 'nuxt/app'
import { useProfileStore } from '@/stores/profile'

export default defineNuxtPlugin(async () => {
  const user = useState('authUser') // Shared state from useAuth
  const store = useProfileStore()

  // Fetch user-profile
  const { data } = await useFetch('/api/auth/me')

  if (data.value) {
    user.value = data.value // Set authUser to fetched profile

    if (data.value) {
      store.userProfile = data.value as Profile // Sync to profile store
    }
  }
  else {
    user.value = null
    store.clearProfile() // Reset store if unauthenticated
  }
})
