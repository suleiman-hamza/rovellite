import admin from 'firebase-admin'
import { defineEventHandler, getCookie } from 'h3'
import { handleUtilityError } from '~~/server/utils/error-handler'
import { clearFirebaseSessionCookie } from '~~/server/utils/session'

export default defineEventHandler(async (event) => {
  const session = getCookie(event, '__session')
  if (!session) {
    return { success: true } // Already logged out
  }

  try {
    const decodedClaims = await admin.auth().verifySessionCookie(session)
    await admin.auth().revokeRefreshTokens(decodedClaims.sub) // Revoke all tokens for security
  }
  catch (error: any) {
    return handleUtilityError(error, 'Failed to log out')
  }

  clearFirebaseSessionCookie(event)
  return { success: true }
})
