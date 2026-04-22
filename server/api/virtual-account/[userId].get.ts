import { queryPalmPayVirtualAccount } from '#server/utils/query-virtual-account'
import { createAdminSupabaseClient } from '#server/utils/supabase'
import { handleUtilityError } from '#server/utils/utils-error-handler'
import { z } from 'zod'

const getVaSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
})

export default defineEventHandler(async (event) => {
  try {
    const userId = getRouterParam(event, 'userId')
    const { userId: validatedUserId } = getVaSchema.parse({ userId })

    const adminSupabase = createAdminSupabaseClient()

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

    // Get transactions for this virtual account
    const { data: transactions, error: transactionsError } = await adminSupabase
      .from('transactions')
      .select('*')
      .eq('virtual_account_no', vaData.virtual_account_no)

    if (transactionsError) {
      return apiResponse.error('Failed to fetch transactions', 500)
    }

    // Get user wallet
    const { data: walletData, error: walletError } = await adminSupabase
      .from('wallets')
      .select('*')
      .eq('user_id', validatedUserId)
      .single()

    if (walletError || !walletData) {
      return apiResponse.error('No wallet found for this user', 404)
    }

    
    return apiResponse.success({
      ...vaData,
      palmPayFresh: freshData,
      transactions,
      wallet: walletData
    }, 'Virtual account retrieved successfully')
  }
  catch (error: any) {
    return handleUtilityError(error, 'Failed to fetch virtual account')
  }
})
