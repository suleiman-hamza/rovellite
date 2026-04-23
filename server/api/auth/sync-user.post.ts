import type { ProfileInsert, UserRole } from '../../../types/supabase'
import { apiResponse } from '#server/utils/api-response'
import { createAdminSupabaseClient } from '#server/utils/supabase'
import { createRovelsubUserWallet } from '#server/utils/wallet'
import admin from 'firebase-admin'
import {
  createError,
  defineEventHandler,
  getHeader,
  readBody,
  setCookie,
} from 'h3'
import { z } from 'zod'

const syncUserSchema = z.object({
  email: z.email().optional(),
  name: z.string({ message: 'Name required' })
    .min(8, 'Name must be at least 8 characters long')
    .max(30, 'Name must be at most 30 characters long')
    .regex(/^[a-z ]+$/i, 'Name can only contain letters and spaces')
    .trim()
    .toLowerCase(),
  role: z.enum(['user', 'admin']).default('user'),
  avatar_url: z.url().optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  referredBy: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  try {
    const adminSupabase = createAdminSupabaseClient()

    const authHeader = getHeader(event, 'Authorization')
    if (!authHeader?.startsWith('Bearer')) {
      return apiResponse.error('Unauthorized: Missing token', 401)
    }

    const idToken = authHeader.split('Bearer ')[1] as string

    // Verify Firebase ID Token
    const decodedToken = await admin.auth().verifyIdToken(idToken)

    // Read and validate body
    const rawBody = await readBody(event)
    const body = syncUserSchema.parse(rawBody || {})

    const profilePayload: ProfileInsert = {
      user_id: decodedToken.uid,
      email: decodedToken.email!,
      role: (body.role || 'user') as UserRole,
      full_name: body.name,
      avatar_url: body.avatar_url,
      phone: body.phone,
      bio: body.bio,
      location: body.location,
      verified: false,
      referred_by: body.referredBy,
      status: 'active',
    }

    // Upsert into Supabase profiles table
    const { data: profile, error: dbError } = await adminSupabase
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

    // Ensure user has a wallet
    await createRovelsubUserWallet(adminSupabase, decodedToken.uid)

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

    return apiResponse.success({
      profile,
    }, 'User profile and wallet synced successfully')
  }
  catch (err: any) {
    console.error('[sync-user] Error:', err)

    if (err?.code === 'auth/id-token-expired' || err?.code === 'auth/invalid-id-token') {
      return apiResponse.error('Invalid or expired token', 401)
    }

    return apiResponse.error('Sync failed', 500)
  }
})
