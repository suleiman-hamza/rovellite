import { apiResponse, isSuccessResponse } from '#server/utils/api-response'
import { queryPalmPayVirtualAccount } from '#server/utils/query-virtual-account'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const getVaSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
})

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const adminSupabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceRoleKey,
  )

  try {
    const userId = getRouterParam(event, 'userId')
    const { userId: validatedUserId } = getVaSchema.parse({ userId })

    // Get from database
    const { data, error } = await adminSupabase
      .from('virtual_accounts')
      .select(`
        *,
        profiles (
          full_name,
          email,
          avatar_url,
          phone
        )
      `)
      .eq('user_id', validatedUserId)
      .single()

    if (error || !data) {
      return apiResponse.error('No virtual account found for this user', 404)
    }

    /// Refresh latest status from PalmPay (non-blocking)
    let freshData = null
    try {
      const queryResult = await queryPalmPayVirtualAccount(data.virtual_account_no)

      // Only proceed if query was successful
      if (isSuccessResponse(queryResult)) {
        freshData = queryResult.data

        if (freshData.status !== data.status) {
          await adminSupabase
            .from('virtual_accounts')
            .update({
              status: freshData.status,
              raw_response: freshData,
            })
            .eq('virtual_account_no', data.virtual_account_no)
        }
      }
    }
    catch (palmError) {
      console.warn('PalmPay status refresh failed:', palmError)
    }

    return apiResponse.success({
      ...data,
      palmPayFresh: freshData,
    }, 'Virtual account retrieved successfully')
  }
  catch (error: any) {
    console.error('Get VA Error:', error)

    if (error.name === 'ZodError') {
      return apiResponse.error(error.errors[0].message, 400, 'VALIDATION_ERROR')
    }

    return apiResponse.error(
      error.message || 'Failed to fetch virtual account',
      error.statusCode || 500,
    )
  }
})
