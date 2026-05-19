import { z } from 'zod'
import { handleUtilityError } from '#server/utils/error-handler'
import { createAdminSupabaseClient } from '#server/utils/supabase'
import { getRovelsubTransactionById } from '#server/utils/transaction/get-by-id'

// Schema to validate the route parameter
const transactionIdSchema = z.string().min(1, 'Transaction ID is required')

export default defineEventHandler(async (event) => {
  try {
    // Extract the dynamic 'id' parameter from the URL (e.g., /api/transactions/123)
    const idParam = getRouterParam(event, 'id')

    // Validate the ID
    const transactionId = transactionIdSchema.parse(idParam)

    const adminSupabase = createAdminSupabaseClient()

    const result = await getRovelsubTransactionById(
      adminSupabase,
      transactionId,
    )

    return result
  }
  catch (error: any) {
    return handleUtilityError(error, 'Failed to fetch transaction')
  }
})
