import { z } from 'zod'
import { handleUtilityError } from '~~/server/utils/error-handler'
import { verifyBvn } from '#server/utils/bvn/verify'
import { createAdminSupabaseClient } from '#server/utils/supabase'

const bvnSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  bvn: z.string()
    .length(11, 'BVN must be exactly 11 digits')
    .regex(/^22\d{9}$/, 'BVN must start with 22'),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { userId, bvn } = bvnSchema.parse(body || {})

    const adminSupabase = createAdminSupabaseClient()
    const result = await verifyBvn(adminSupabase, { userId, bvn })

    return result
  }
  catch (error: any) {
    return handleUtilityError(error, 'Failed to verify BVN')
  }
})
