import { z } from 'zod'
import { apiResponse } from '#server/utils/api-response'
import { verifyAuthToken } from '#server/utils/auth-verifier'
import { handleUtilityError } from '#server/utils/error-handler'
import { createAdminSupabaseClient } from '#server/utils/supabase'
import { updateVirtualAccountStatus } from '#server/utils/virtual-account/update'

const updateVaSchema = z.object({
  virtualAccountNo: z.string().min(1, 'virtualAccountNo is required'),
  status: z.enum(['Enabled', 'Disabled']),
})

export default defineEventHandler(async (event) => {
  try {
    const authUid
      = event.context.user?.uid
        || (await verifyAuthToken(event)).decodedToken.uid

    if (!authUid) {
      return apiResponse.error('Authentication is required to update virtual account status', 401)
    }

    const body = await readBody(event)
    const { virtualAccountNo, status } = updateVaSchema.parse(body)

    const adminSupabase = createAdminSupabaseClient()

    // Verify ownership of the virtual account
    const { data: va } = await adminSupabase
      .from('virtual_accounts')
      .select('user_id')
      .eq('virtual_account_no', virtualAccountNo)
      .single()

    if (!va) {
      return apiResponse.error('Virtual account not found', 404)
    }

    if (va.user_id !== authUid && event.context.user?.role !== 'admin') {
      return apiResponse.error('You are not authorized to modify this virtual account', 403)
    }

    const result = await updateVirtualAccountStatus(adminSupabase, { virtualAccountNo, status })

    return result
  }
  catch (error: any) {
    return handleUtilityError(error, 'Failed to update virtual account status')
  }
})
