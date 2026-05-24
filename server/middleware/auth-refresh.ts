import admin from 'firebase-admin'
import { defineEventHandler, getCookie } from 'h3'

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
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true)

    // Refresh the 14-day window on every active request
    setFirebaseSessionCookie(event, sessionCookie)

    // Attach decoded user data to the event context for downstream use in API routes
    event.context.user = decodedClaims
  }
  catch {
    clearFirebaseSessionCookie(event)

    throw createError({
      statusCode: 401,
      statusMessage: 'Session cleared due to authentication error',
    })
  }
})
