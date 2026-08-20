import { z } from 'zod'
import { apiResponse } from '#server/utils/api-response'
import { verifyAuthToken } from '#server/utils/auth-verifier'
import { handleUtilityError } from '#server/utils/error-handler'
import { createAdminSupabaseClient } from '#server/utils/supabase'
import { getRovelsubUserWallet } from '#server/utils/wallet'

const walletSchema = z.object({
  userId: z.string().min(1, { error: 'userId is required' }),
})

export default defineEventHandler(async (event) => {
  try {
    const authUid
      = event.context.user?.uid
        || (await verifyAuthToken(event)).decodedToken.uid

    if (!authUid) {
      return apiResponse.error('Authentication is required to fetch wallet', 401)
    }

    const query = getQuery(event)
    const { userId: rawUserId } = walletSchema.parse(query)

    const targetUserId = rawUserId || authUid

    if (targetUserId !== authUid && event.context.user?.role !== 'admin') {
      return apiResponse.error('You are not authorized to view this wallet', 403)
    }

    const adminSupabase = createAdminSupabaseClient()
    const result = await getRovelsubUserWallet(adminSupabase, targetUserId)
    return result
  }
  catch (error: any) {
    return handleUtilityError(error, 'Failed to fetch wallet')
  }
})
