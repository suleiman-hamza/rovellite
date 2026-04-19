import { apiResponse } from '#server/utils/api-response'
import { getRovelsubUserTransactions } from '#server/utils/transaction'
import { z } from 'zod'

const transactionsSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  limit: z.string().optional().default('20'),
})

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { userId, limit } = transactionsSchema.parse(query)

    const result = await getRovelsubUserTransactions(event, userId, Number.parseInt(limit))

    return result
  }
  catch (error: any) {
    console.error('Transactions Route Error:', error)

    if (error.name === 'ZodError') {
      const message = error.errors?.[0]?.message || 'Validation error'
      return apiResponse.error(message, 400, 'VALIDATION_ERROR')
    }

    return apiResponse.error('Failed to fetch transactions', 500)
  }
})
