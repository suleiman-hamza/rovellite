import type { SupabaseClient } from '@supabase/supabase-js'
import type { WalletInsert, WalletRow } from '../../types/supabase'
import type { Database } from '../../types/supabase-schema'
import { apiResponse } from '#server/utils/api-response'
import { z } from 'zod'
import { handleUtilityError } from './error-handler'

const userIdSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
})

export async function createRovelsubUserWallet(supabase: SupabaseClient<Database>, userId: string) {
  try {
    const { userId: validatedUserId } = userIdSchema.parse({ userId })

    /**
     * check is useful for UX, but NOT safe for concurrency.
     * DB constraint must be the source of truth.
     */
    const { data: existing } = await supabase
      .from('wallets')
      .select('id, balance, status')
      .eq('user_id', validatedUserId)
      .maybeSingle()

    if (existing) {
      return apiResponse.success(existing, 'Wallet already exists')
    }

    const walletInsert: WalletInsert = {
      user_id: validatedUserId,
      balance: 0,
      currency: 'NGN',
      status: 'Active',
    }

    const { data, error } = await supabase
      .from('wallets')
      .insert(walletInsert)
      .select()
      .single()

    /**
     * Handle unique constraint (idempotency safety)
     */
    if (error) {
      // Postgres unique violation
      if (error.code === '23505') {
        const { data: existingWallet } = await supabase
          .from('wallets')
          .select('id, balance, status')
          .eq('user_id', validatedUserId)
          .single()

        return apiResponse.success(existingWallet, 'Wallet already exists')
      }

      throw error
    }

    return apiResponse.success(data as WalletRow, 'Wallet created successfully')
  }
  catch (error: any) {
    return handleUtilityError(error, 'Failed to create wallet')
  }
}

// get user wallet
export async function getRovelsubUserWallet(supabase: SupabaseClient<Database>, userId: string) {
  try {
    const { userId: validatedUserId } = userIdSchema.parse({ userId })

    const { data, error } = await supabase
      .from('wallets')
      .select(`
        *,
        profiles(full_name, email, avatar_url, status, verified)
      `)
      .eq('user_id', validatedUserId)
      .single()

    if (error || !data) {
      return apiResponse.error('Wallet not found', 404)
    }

    return apiResponse.success(data, 'Wallet retrieved successfully')
  }
  catch (error: any) {
    return handleUtilityError(error, 'Failed to fetch wallet')
  }
}
