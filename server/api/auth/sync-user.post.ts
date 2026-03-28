import { createClient } from '@supabase/supabase-js'
import admin from 'firebase-admin'
import {
  createError,
  defineEventHandler,
  getHeader,
  readBody,
  setCookie,
} from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Initialize Supabase Admin with Service Role Key
  const adminSupabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceRoleKey,
  )

  const authHeader = getHeader(event, 'Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: 'Unauthorized: Missing token' })
  }

  const idToken = authHeader.split('Bearer ')[1]

  try {
    // Verify Firebase ID Token
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    const body = await readBody(event)

    // Construct the profile payload
    const profilePayload: Record<string, any> = {
      user_id: decodedToken.uid,
      email: decodedToken.email || body.email,
      role: body.role || 'user',
    }

    // Optional fields mapping
    const optionalFields = ['name', 'avatar_url', 'phone', 'bio', 'location']
    optionalFields.forEach((field) => {
      const dbKey = field === 'name' ? 'full_name' : field
      if (body[field]) {
        profilePayload[dbKey] = body[field]
      }
    })

    // Upsert into Supabase profiles table
    const { data, error: dbError } = await adminSupabase
      .from('profiles')
      .upsert(profilePayload, { onConflict: 'user_id' })
      .select()
      .single()

    if (dbError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Database sync failed',
        data: { message: dbError.message },
      })
    }

    // Generate Firebase Session Cookie (14 days)
    const expiresIn = 60 * 60 * 24 * 14 * 1000
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn })

    setCookie(event, '__session', sessionCookie, {
      httpOnly: true,
      secure: !import.meta.dev, // False in local dev, true in production
      sameSite: 'strict',
      maxAge: expiresIn / 1000,
      path: '/',
    })

    return {
      success: true,
      profile: data,
    }
  }
  catch (err: any) {
    // Handle specific Firebase Auth errors
    if (err?.code === 'auth/id-token-expired') {
      throw createError({ statusCode: 401, statusMessage: 'Token expired' })
    }

    if (err?.code === 'auth/invalid-id-token') {
      throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
    }

    // Fallback error logging for debugging (server-side only)
    console.error('[sync-user] Internal Failure:', err.message)

    throw createError({
      statusCode: 500,
      statusMessage: 'Sync failed',
      data: { message: err?.message ?? 'Unknown error' },
    })
  }
})
