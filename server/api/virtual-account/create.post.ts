import { z } from 'zod'
import { apiResponse } from '#server/utils/api-response'
import { verifyAuthToken } from '#server/utils/auth-verifier'
import { handleUtilityError } from '#server/utils/error-handler'
import { createAdminSupabaseClient } from '#server/utils/supabase'
import { createVirtualAccount } from '#server/utils/virtual-account/create'

const createVaSchema = z.object({
  userId: z.string().min(1, { error: 'userId is required' }),
  bvn: z.string().length(11, { error: 'BVN must be exactly 11 digits' }),
})

export default defineEventHandler(async (event) => {
  try {
    const authUid
      = event.context.user?.uid
        || (await verifyAuthToken(event)).decodedToken.uid

    if (!authUid) {
      return apiResponse.error('Authentication is required to create virtual account', 401)
    }

    const body = await readBody(event)
    const { userId: rawUserId, bvn } = createVaSchema.parse(body || {})

    const targetUserId = rawUserId || authUid

    if (targetUserId !== authUid && event.context.user?.role !== 'admin') {
      return apiResponse.error('You are not authorized to create virtual account for another user', 403)
    }

    const adminSupabase = createAdminSupabaseClient()
    const result = await createVirtualAccount(adminSupabase, { userId: targetUserId, bvn })

    return result
  }
  catch (error: any) {
    return handleUtilityError(error, 'Failed to create virtual account')
  }
})
