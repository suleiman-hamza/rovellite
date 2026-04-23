import { createAdminSupabaseClient } from '#server/utils/supabase'
import { updateVirtualAccountStatus } from '#server/utils/update-virtual-account'
import { z } from 'zod'
import { handleUtilityError } from '~~/server/utils/error-handler'

const updateVaSchema = z.object({
  virtualAccountNo: z.string().min(1, 'virtualAccountNo is required'),
  status: z.enum(['Enabled', 'Disabled']),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { virtualAccountNo, status } = updateVaSchema.parse(body)

    const adminSupabase = createAdminSupabaseClient()
    const result = await updateVirtualAccountStatus(adminSupabase, { virtualAccountNo, status })

    return result
  }
  catch (error: any) {
    return handleUtilityError(error, 'Failed to update virtual account status')
  }
})
