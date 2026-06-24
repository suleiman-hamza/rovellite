import type { Profile, WalletRow } from '~~/types/supabase'
import { defineEventHandler, getQuery } from 'h3'
import { apiResponse } from '#server/utils/api-response'
import { handleUtilityError } from '#server/utils/error-handler'
import { paginationSchema } from '#server/utils/pagination'
import { createAdminSupabaseClient } from '#server/utils/supabase'

export interface AdminUserListItem extends Profile {
  wallet: Pick<WalletRow, 'id' | 'balance' | 'currency' | 'status'> | null
}

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { limit, offset } = paginationSchema.parse(query)

    const adminSupabase = createAdminSupabaseClient()

    // Fetch all user profiles with their wallet info
    const { data, error, count } = await adminSupabase
      .from('profiles')
      .select(`
        *,
        wallet:wallets!wallets_user_id_fkey (
          id,
          balance,
          currency,
          status
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return apiResponse.error(`Failed to fetch users: ${error.message}`, 500)
    }

    return apiResponse.success(
      {
        users: (data || []) as AdminUserListItem[],
        total: count ?? 0,
        limit,
        offset,
      },
      'Users retrieved successfully',
    )
  }
  catch (error: any) {
    return handleUtilityError(error, 'Failed to fetch users')
  }
})
