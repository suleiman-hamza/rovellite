import admin from 'firebase-admin'
import { defineEventHandler, getCookie } from 'h3'
import { createAdminSupabaseClient } from '#server/utils/supabase'

// Endpoint handler for authenticated users
export default defineEventHandler(async (event) => {
  const adminSupabase = createAdminSupabaseClient()
  const session = getCookie(event, '__session')
  if (!session) {
    return null // No session = not authenticated
  }

  try {
    // Verify session cookie
    const decodedClaims = await admin.auth().verifySessionCookie(session, true) // Check revocation

    // Fetch Supabase profile using UID from claims
    const { data } = await adminSupabase
      .from('profiles')
      .select('*')
      .eq('user_id', decodedClaims.uid)
      .single()

    return data || null
  }
  catch {
    return null // Fail silently to unauthenticated state
  }
})
