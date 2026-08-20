import { z } from 'zod'
import { apiResponse } from '#server/utils/api-response'
import { verifyAuthToken } from '#server/utils/auth-verifier'
import { handleUtilityError } from '#server/utils/error-handler'
import { createAdminSupabaseClient } from '#server/utils/supabase'
import { getRovelsubTransactionById } from '#server/utils/transaction/get-by-id'

// Schema to validate the route parameter
const transactionIdSchema = z.string().min(1, { error: 'Transaction ID is required' })

export default defineEventHandler(async (event) => {
  try {
    const authUid
      = event.context.user?.uid
        || (await verifyAuthToken(event)).decodedToken.uid

    if (!authUid) {
      return apiResponse.error('Authentication is required to view transaction details', 401)
    }

    const idParam = getRouterParam(event, 'id')
    const transactionId = transactionIdSchema.parse(idParam)

    const adminSupabase = createAdminSupabaseClient()

    const result = await getRovelsubTransactionById(
      adminSupabase,
      transactionId,
    )

    if (result.success && result.data) {
      const tx = result.data as any
      if (tx.user_id && tx.user_id !== authUid && event.context.user?.role !== 'admin') {
        return apiResponse.error('You are not authorized to view this transaction', 403)
      }
    }

    return result
  }
  catch (error: any) {
    return handleUtilityError(error, 'Failed to fetch transaction')
  }
})
