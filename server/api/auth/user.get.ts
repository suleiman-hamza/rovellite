import { defineEventHandler } from 'h3'
import { createAdminSupabaseClient } from '#server/utils/supabase'

// Endpoint handler for authenticated users
export default defineEventHandler(async (event) => {
  const adminSupabase = createAdminSupabaseClient()
  const decodedClaims = event.context.user

  if (!decodedClaims) {
    return null // No session = not authenticated
  }

  try {
    // Fetch Supabase profile using UID from claims
    const { data } = await adminSupabase
      .from('profiles')
      .select('*')
      .eq('user_id', decodedClaims.uid)
      .single()

    return data || null
  }
  catch (error) {
    console.error('[user.get.ts] Error fetching profile:', error)
    return null // Fail silently to unauthenticated state
  }
})
