import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../../../types/supabase-schema'
import { apiResponse } from '../api-response'
import { handleUtilityError } from '../error-handler'

export async function getRovelsubTransactionById(
  supabase: SupabaseClient<Database>,
  transactionId: string,
) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        wallet:wallets!transactions_wallet_id_fkey (
          balance,
          currency
        )
      `)
      .eq('id', transactionId)
      .single()

    if (error) {
      // Supabase returns a PGRST116 error code if .single() finds no rows
      if (error.code === 'PGRST116') {
        return apiResponse.error('Transaction not found', 404)
      }
      return apiResponse.error('Failed to fetch transaction', 500)
    }

    return apiResponse.success(data, 'Transaction retrieved successfully')
  }
  catch (error: any) {
    return handleUtilityError(error, 'Failed to fetch transaction')
  }
}
