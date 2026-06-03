import type { Database } from '~~/types/supabase-schema'
import admin from 'firebase-admin'
import { defineEventHandler, getCookie } from 'h3'
import { handleUtilityError } from '~~/server/utils/error-handler'
import { clearFirebaseSessionCookie, setFirebaseSessionCookie } from '~~/server/utils/session'

type UserRole = Database['public']['Enums']['user_role']

// Extend H3's runtime context type interface so event.context.user is globally known
declare module 'h3' {
  interface H3EventContext {
    user?: admin.auth.DecodedIdToken & {
      role?: UserRole
    }
  }
}

export default defineEventHandler(async (event) => {
  // Skip static assets, internal Nuxt calls, and the logout route
  if (
    event.path.startsWith('/_nuxt')
    || event.path.startsWith('/api/auth/logout')
    || event.path.includes('.') // Skips files like favicon.ico, images, etc.
  ) {
    return
  }

  const sessionCookie = getCookie(event, '__session')
  if (!sessionCookie)
    return

  try {
    // Verify the session cookie and check for revocation
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true) as admin.auth.DecodedIdToken & { role?: UserRole }

    // Refresh the 14-day window on every active request
    setFirebaseSessionCookie(event, sessionCookie)

    // Attach decoded user data to the event context for downstream use in API routes
    event.context.user = decodedClaims
  }
  catch (error: any) {
    clearFirebaseSessionCookie(event)

    event.context.user = undefined

    // console.warn('Session automatically revoked:', error.message)
    return handleUtilityError(error, 'Session cleared due to authentication error')
  }
})
