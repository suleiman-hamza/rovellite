import admin from 'firebase-admin'
import { defineEventHandler, getCookie } from 'h3'

export default defineEventHandler(async (event) => {
  const session = getCookie(event, '__session')
  if (!session) {
    return { success: true } // Already logged out
  }

  try {
    const decodedClaims = await admin.auth().verifySessionCookie(session)
    await admin.auth().revokeRefreshTokens(decodedClaims.sub) // Revoke all tokens for security
  }
  catch {

  }

  clearFirebaseSessionCookie(event)
  return { success: true }
})
