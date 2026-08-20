import { z } from 'zod'
import { apiResponse } from '#server/utils/api-response'
import { verifyAuthToken } from '#server/utils/auth-verifier'
import { handleUtilityError } from '#server/utils/error-handler'
import { createAdminSupabaseClient } from '#server/utils/supabase'
import { getRovelsubUserTransactions } from '#server/utils/transaction/get-by-user'

const transactionsSchema = z.object({
  userId: z.string().min(1, { error: 'userId is required' }).optional(),
  limit: z.string().optional().default('20'),
})

export default defineEventHandler(async (event) => {
  try {
    const authUid
      = event.context.user?.uid
        || (await verifyAuthToken(event)).decodedToken.uid

    if (!authUid) {
      return apiResponse.error('Authentication is required to fetch transactions', 401)
    }

    const query = getQuery(event)
    const { userId: rawUserId, limit } = transactionsSchema.parse(query)

    const targetUserId = rawUserId || authUid

    if (targetUserId !== authUid && event.context.user?.role !== 'admin') {
      return apiResponse.error('You are not authorized to view these transactions', 403)
    }

    const adminSupabase = createAdminSupabaseClient()

    const result = await getRovelsubUserTransactions(
      adminSupabase,
      targetUserId,
      Number.parseInt(limit),
    )

    return result
  }
  catch (error: any) {
    return handleUtilityError(error, 'Failed to fetch transactions')
  }
})
