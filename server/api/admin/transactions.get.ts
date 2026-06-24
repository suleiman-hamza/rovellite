import type { Profile, TransactionRow, WalletRow } from '~~/types/supabase'
import { defineEventHandler, getQuery } from 'h3'
import { z } from 'zod'
import { apiResponse } from '#server/utils/api-response'
import { handleUtilityError } from '#server/utils/error-handler'
import { paginationSchema } from '#server/utils/pagination'
import { createAdminSupabaseClient } from '#server/utils/supabase'

const transactionsQuerySchema = paginationSchema.extend({
  userId: z.string().optional(),
  status: z.string().optional(),
  type: z.string().optional(),
})

export interface AdminTransactionListItem extends TransactionRow {
  wallet: Pick<WalletRow, 'balance' | 'currency'> | null
  profile: Pick<Profile, 'full_name' | 'email' | 'phone'> | null
}

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { limit, offset, userId, status, type } = transactionsQuerySchema.parse(query)

    const adminSupabase = createAdminSupabaseClient()

    // Build the query with optional filters
    let dbQuery = adminSupabase
      .from('transactions')
      .select(`
        *,
        wallet:wallets!transactions_wallet_id_fkey (
          balance,
          currency
        ),
        profile:profiles!transactions_user_id_fkey (
          full_name,
          email,
          phone
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })

    // Apply optional filters
    if (userId) {
      dbQuery = dbQuery.eq('user_id', userId)
    }
    if (status) {
      dbQuery = dbQuery.eq('status', status)
    }
    if (type) {
      dbQuery = dbQuery.eq('type', type)
    }

    // Apply pagination
    dbQuery = dbQuery.range(offset, offset + limit - 1)

    const { data, error, count } = await dbQuery

    if (error) {
      return apiResponse.error(`Failed to fetch transactions: ${error.message}`, 500)
    }

    return apiResponse.success(
      {
        transactions: (data || []) as AdminTransactionListItem[],
        total: count ?? 0,
        limit,
        offset,
      },
      'Transactions retrieved successfully',
    )
  }
  catch (error: any) {
    return handleUtilityError(error, 'Failed to fetch transactions')
  }
})
