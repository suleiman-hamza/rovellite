import process from 'node:process'
import { createClient } from '@supabase/supabase-js'
import admin from 'firebase-admin'
import { defineEventHandler, getCookie } from 'h3'

// Dedicated admin client for server-side ops (bypasses RLS)
const adminSupabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

// Endpoint handler for authenticated users
export default defineEventHandler(async (event) => {
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
