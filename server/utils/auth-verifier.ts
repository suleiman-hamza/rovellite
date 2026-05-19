import type { H3Event } from 'h3'
import admin from 'firebase-admin'
import { createError, getHeader } from 'h3'

/**
 * Extracts and verifies the Firebase Bearer token from the Authorization header.
 * Throws a 401 H3Error if missing or invalid.
 */
export async function verifyAuthToken(event: H3Event, checkRevoked = false) {
  const authHeader = getHeader(event, 'Authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Missing or invalid token format',
    })
  }

  const idToken = authHeader.split('Bearer ')[1] as string

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken, checkRevoked)
    return { decodedToken, idToken }
  }
  catch (error: any) {
    throw createError({
      statusCode: 401,
      statusMessage: `Unauthorized: ${error.message}`,
    })
  }
}
