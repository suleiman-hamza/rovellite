import { apiResponse } from '#server/utils/api-response'
import { getRovelsubUserWallet } from '#server/utils/wallet'
import { z } from 'zod'

const walletSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
})

export default defineEventHandler(async (event) => {
  try {
    const userId = getQuery(event).userId as string
    const { userId: validatedUserId } = walletSchema.parse({ userId })

    const result = await getRovelsubUserWallet(event, validatedUserId)
    return result
  }
  catch (error: any) {
    // console.error('Wallet Route Error:', error)

    if (error.name === 'ZodError') {
      const message = error.errors?.[0]?.message || 'Validation error'
      return apiResponse.error(message, 400, 'VALIDATION_ERROR')
    }

    return apiResponse.error('Failed to fetch wallet', 500)
  }
})
