import type { Profile } from '../../types/supabase'
import type { Database } from '../../types/supabase-schema'
import { createClient } from '@supabase/supabase-js'
import { useRuntimeConfig } from 'nuxt/app'
import { useAuth } from '../composables/use-auth'

// Define store
export const useProfileStore = defineStore('profile', () => {
  const config = useRuntimeConfig()
  const { getUser } = useAuth()

  const userProfile = ref<Profile | null>(null)
  const loading = ref(false)

  let supabaseClient: ReturnType<typeof createClient<Database>> | null = null

  // Handle get supabase client
  const getSupabaseClient = () => {
    if (supabaseClient)
      return supabaseClient

    const url = config.public.supabaseUrl
    const key = config.public.supabaseAnonKey

    if (!url || !key) {
      throw new Error('Missing Supabase config in runtimeConfig')
    }

    supabaseClient = createClient<Database>(url, key)
    return supabaseClient
  }

  const showError = (err: unknown) => {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[ProfileStore Error]', message)
  }

  // Handle fetching profile
  async function fetchProfile(uid?: string | null, email?: string | null) {
    loading.value = true

    try {
      const firebaseUser = getUser()
      const queryUid = uid || firebaseUser?.uid || (firebaseUser as any)?.user_id || null
      const queryEmail = email || firebaseUser?.email || null

      if (!queryUid && !queryEmail) {
        userProfile.value = null
        return
      }

      const client = getSupabaseClient()
      let query = client.from('profiles').select('*')

      if (queryUid)
        query = query.eq('user_id', queryUid)
      else if (queryEmail)
        query = query.eq('email', queryEmail)

      const { data, error } = await query.maybeSingle()

      // Ignore “no rows” error
      if (error && error.code !== 'PGRST116')
        throw error

      userProfile.value = data ?? null
    }
    catch (err) {
      showError(err)
      userProfile.value = null
    }
    finally {
      loading.value = false
    }
  }

  // Handle clearing profile
  function clearProfile() {
    userProfile.value = null
    loading.value = false
  }

  const getProfile = () => userProfile // Get profile

  return {
    userProfile,
    loading,
    fetchProfile,
    clearProfile,
    getProfile,
  }
})
