import { apiResponse } from '#server/utils/api-response'
import { createClient } from '@supabase/supabase-js'

export async function getRovelsubUserTransactions(_event: any, userId: string, limit = 20) {
  try {
    const config = useRuntimeConfig()
    const adminSupabase = createClient(
      config.public.supabaseUrl,
      config.supabaseServiceRoleKey,
    )

    const { data, error } = await adminSupabase
      .from('transactions')
      .select(`
        *,
        wallet:wallets (
          balance,
          currency
        )
      `)
      .eq('wallet_id',
        // Subquery to get wallet_id from user_id
        (await adminSupabase.from('wallets').select('id').eq('user_id', userId).single()).data?.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Transactions fetch error:', error)
      return apiResponse.error('Failed to fetch transactions', 500)
    }

    return apiResponse.success(data || [], 'Transactions retrieved successfully')
  }
  catch (error: any) {
    console.error('Get Transactions Error:', error)
    return apiResponse.error('Failed to fetch transactions', 500)
  }
}
