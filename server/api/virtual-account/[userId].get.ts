import { apiResponse } from '#server/utils/api-response'
import { queryPalmPayVirtualAccount } from '#server/utils/query-virtual-account'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const getVaSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
})

export default defineEventHandler(async (event) => {
  try {
    const userId = getRouterParam(event, 'userId')
    const { userId: validatedUserId } = getVaSchema.parse({ userId })

    const config = useRuntimeConfig()
    const adminSupabase = createClient(
      config.public.supabaseUrl,
      config.supabaseServiceRoleKey,
    )

    // Get Virtual Account
    const { data: vaData, error: vaError } = await adminSupabase
      .from('virtual_accounts')
      .select(`
        *,
        profiles (
          full_name, email, avatar_url, phone
        )
      `)
      .eq('user_id', validatedUserId)
      .single()

    if (vaError || !vaData) {
      return apiResponse.error('No virtual account found for this user', 404)
    }

    // Refresh latest status from PalmPay
    let freshData = null
    try {
      const queryResult = await queryPalmPayVirtualAccount(vaData.virtual_account_no)

      if (isSuccessResponse(queryResult) && queryResult.data) {
        freshData = queryResult.data

        if (freshData.status !== vaData.status) {
          await adminSupabase
            .from('virtual_accounts')
            .update({
              status: freshData.status,
              raw_response: freshData,
            })
            .eq('virtual_account_no', vaData.virtual_account_no)
        }
      }
    }
    catch (palmError) {
      console.warn('PalmPay status refresh failed:', palmError)
    }

    return apiResponse.success({
      ...vaData,
      palmPayFresh: freshData,
    }, 'Virtual account retrieved successfully')
  }
  catch (error: any) {
    // console.error('Get VA Error:', error)

    if (error.name === 'ZodError') {
      const message = error.errors?.[0]?.message || 'Validation error'
      return apiResponse.error(message, 400, 'VALIDATION_ERROR')
    }

    return apiResponse.error('Failed to fetch virtual account', 500)
  }
})
