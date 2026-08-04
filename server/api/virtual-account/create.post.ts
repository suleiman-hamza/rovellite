import { z } from 'zod'
import { handleUtilityError } from '#server/utils/error-handler'
import { createAdminSupabaseClient } from '#server/utils/supabase'
import { createVirtualAccount } from '#server/utils/virtual-account/create'

const createVaSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  bvn: z.string().length(11, 'BVN must be exactly 11 digits'),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Validate with Zod
    const { userId, bvn } = createVaSchema.parse(body || {})

    const adminSupabase = createAdminSupabaseClient()
    const result = await createVirtualAccount(adminSupabase, { userId, bvn })

    return result
  }
  catch (error: any) {
    return handleUtilityError(error, 'Failed to create virtual account')
  }
})
