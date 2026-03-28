import admin from 'firebase-admin'
import { defineEventHandler, getCookie, setCookie } from 'h3'

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
    const expiresIn = 60 * 60 * 24 * 14 * 1000

    setCookie(event, '__session', sessionCookie, {
      httpOnly: true,
      secure: !import.meta.dev,
      sameSite: 'strict',
      maxAge: expiresIn / 1000,
      path: '/',
    })

    // Attach decoded user data to the event context for downstream use in API routes
    event.context.user = decodedClaims
  }
  catch {
    setCookie(event, '__session', '', { maxAge: -1, path: '/' })

    throw createError({
      statusCode: 401,
      statusMessage: 'Session cleared due to authentication error',
    })
  }
})
