import admin from 'firebase-admin'
import {
  defineEventHandler,
  getHeader,
  readBody,
} from 'h3'
import { z } from 'zod'
import { handleUtilityError } from '~~/server/utils/error-handler'
import { apiResponse } from '#server/utils/api-response'
import { createAdminSupabaseClient } from '#server/utils/supabase'

const syncUserSchema = z.object({
  email: z.email(),
  name: z.string({ message: 'Name required' }),
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

    // Upsert into Supabase profiles table
    const { data: profile, error: rpcError } = await adminSupabase.rpc('sync_profile_with_wallet', {
      p_user_id: decodedToken.uid,
      p_email: decodedToken.email!,
      p_full_name: body.name,
      p_avatar_url: body.avatar_url,
      p_phone: body.phone,
      p_bio: body.bio,
      p_location: body.location,
      p_referred_by: body.referredBy,
      p_role: 'user',
      p_verified: false,
      p_wallet_balance: 0,
      p_wallet_currency: 'NGN',
      p_wallet_status: 'active',
    })

    if (rpcError) {
      return apiResponse.error(rpcError.message, 500)
    }

    // Generate and set Firebase Session Cookie
    await createAndSetFirebaseSessionCookie(event, idToken)

    return apiResponse.success({
      profile,
    }, 'User profile and wallet synced successfully')
  }
  catch (error: any) {
    console.error('[sync-user] Error:', error)
    return handleUtilityError(error, 'Failed to sync user profile')
  }
})
