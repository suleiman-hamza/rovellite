import { z } from 'zod'
import { handleUtilityError } from '#server/utils/error-handler'
import { createAdminSupabaseClient } from '#server/utils/supabase'
import { getRovelsubUserTransactions } from '#server/utils/transaction/get-by-user'

const transactionsSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  limit: z.string().optional().default('20'),
})

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { userId, limit } = transactionsSchema.parse(query)

    const adminSupabase = createAdminSupabaseClient()

    const result = await getRovelsubUserTransactions(
      adminSupabase,
      userId,
      Number.parseInt(limit),
    )

    return result
  }
  catch (error: any) {
    return handleUtilityError(error, 'Failed to fetch transactions')
  }
})
