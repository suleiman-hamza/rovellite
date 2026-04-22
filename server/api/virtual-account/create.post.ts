import { createVirtualAccount } from '#server/utils/create-virtual-account'
import { createAdminSupabaseClient } from '#server/utils/supabase'
import { handleUtilityError } from '#server/utils/utils-error-handler'
import { z } from 'zod'

const createVaSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Validate with Zod
    const { userId } = createVaSchema.parse(body)

    const adminSupabase = createAdminSupabaseClient()
    const result = await createVirtualAccount(adminSupabase, { userId })

    return result
  }
  catch (error: any) {
    return handleUtilityError(error, 'Failed to create virtual account')
  }
})
