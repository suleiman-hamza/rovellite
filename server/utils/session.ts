import type { H3Event } from 'h3'
import admin from 'firebase-admin'
import { setCookie } from 'h3'

const EXPIRES_IN = 60 * 60 * 24 * 14 * 1000 // 14 days

export function setFirebaseSessionCookie(event: H3Event, sessionCookie: string) {
  setCookie(event, '__session', sessionCookie, {
    httpOnly: true,
    secure: !import.meta.dev,
    sameSite: 'lax',
    maxAge: EXPIRES_IN / 1000,
    path: '/',
  })
}

export function clearFirebaseSessionCookie(event: H3Event) {
  setCookie(event, '__session', '', { maxAge: -1, path: '/' })
}

export async function createAndSetFirebaseSessionCookie(event: H3Event, idToken: string) {
  const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn: EXPIRES_IN })
  setFirebaseSessionCookie(event, sessionCookie)
  return sessionCookie
}
