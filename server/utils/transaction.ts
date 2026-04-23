import type { Database } from '../../types/supabase-schema'
import type { SupabaseClient } from '@supabase/supabase-js'
import { apiResponse } from '#server/utils/api-response'
import { handleUtilityError } from '~~/server/utils/error-handler'

export async function getRovelsubUserTransactions(
  supabase: SupabaseClient<Database>,
  userId: string,
  limit = 20
) {
  try {
    // fetch user wallet
    const walletQuery = await supabase
      .from('wallets')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (walletQuery.error) {
      // console.error('Wallet fetch error:', walletQuery.error)
      return apiResponse.error('Failed to fetch wallet', 500)
    }

    const walletId = walletQuery.data?.id

    if (!walletId) {
      return apiResponse.error('Wallet not found for user', 404)
    }

    // fetch transactions for the wallet
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        wallet:wallets!transactions_wallet_id_fkey (
          balance,
          currency
        )
      `)
      .eq('wallet_id', walletId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      // console.error('Transactions fetch error:', error)
      return apiResponse.error('Failed to fetch transactions', 500)
    }

    return apiResponse.success(data || [], 'Transactions retrieved successfully')
  } catch (error: any) {
    return handleUtilityError(error, 'Failed to fetch transactions')
  }
}
