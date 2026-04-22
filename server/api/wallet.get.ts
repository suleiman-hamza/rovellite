import { getRovelsubUserWallet } from '#server/utils/wallet'
import { createAdminSupabaseClient } from '#server/utils/supabase'
import { z } from 'zod'
import { handleUtilityError } from '#server/utils/utils-error-handler'

const walletSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
})

export default defineEventHandler(async (event) => {
  try {
    const userId = getQuery(event).userId as string
    const { userId: validatedUserId } = walletSchema.parse({ userId })

    const adminSupabase = createAdminSupabaseClient()
    const result = await getRovelsubUserWallet(adminSupabase, validatedUserId)
    return result
  }
  catch (error: any) {
    return handleUtilityError(error, 'Failed to fetch wallet')
  }
})
