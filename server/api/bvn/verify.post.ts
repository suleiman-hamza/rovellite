import { z } from 'zod'
import { handleUtilityError } from '~~/server/utils/error-handler'
import { apiResponse } from '#server/utils/api-response'
import { verifyAuthToken } from '#server/utils/auth-verifier'
import { verifyBvn } from '#server/utils/bvn/verify'
import { createAdminSupabaseClient } from '#server/utils/supabase'

const bvnSchema = z.object({
  userId: z.string().min(1, { error: 'userId is required' }).optional(),
  bvn: z.string()
    .length(11, { error: 'BVN must be exactly 11 digits' })
    .regex(/^22\d{9}$/, { error: 'BVN must start with 22' }),
})

export default defineEventHandler(async (event) => {
  try {
    const authUid
      = event.context.user?.uid
        || (await verifyAuthToken(event)).decodedToken.uid

    if (!authUid) {
      return apiResponse.error('Authentication is required for BVN verification', 401)
    }

    const body = await readBody(event)
    const { userId: rawUserId, bvn } = bvnSchema.parse(body || {})

    const targetUserId = rawUserId || authUid

    if (targetUserId !== authUid && event.context.user?.role !== 'admin') {
      return apiResponse.error('You are not authorized to verify BVN for another user', 403)
    }

    const adminSupabase = createAdminSupabaseClient()
    const result = await verifyBvn(adminSupabase, { userId: targetUserId, bvn })

    return result
  }
  catch (error: any) {
    return handleUtilityError(error, 'Failed to verify BVN')
  }
})
