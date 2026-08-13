import type { SupabaseClient } from '@supabase/supabase-js'
import type { WalletInsert, WalletRow } from '../../types/supabase'
import type { Database } from '../../types/supabase-schema'
import { z } from 'zod'
import { apiResponse } from '#server/utils/api-response'
import { handleUtilityError } from './error-handler'

const userIdSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
})

const walletDebitSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  planId: z.uuid('Invalid subscription plan ID'),
  idempotencyKey: z.uuid('Idempotency key must be a valid UUID'),
  target: z.string().min(1, 'Target identifier is required'),
  amount: z.number().positive('Amount must be greater than zero').optional(),
})

// create user wallet
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
      status: 'active',
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

// Map RPC errors to standard user-facing API responses (prevents drift)
export function mapDebitRpcError(message: string, fallbackMessage = 'Failed to process subscription checkout') {
  if (message.includes('Insufficient balance') || message.includes('Insufficient wallet balance')) {
    return apiResponse.error('Insufficient wallet balance for this subscription', 400)
  }
  if (message.includes('Wallet not found') || message.includes('not found')) {
    return apiResponse.error('Wallet not found for user', 404)
  }
  if (message.includes('Wallet is not active') || message.includes('not active')) {
    return apiResponse.error('Wallet is not active', 400)
  }
  if (message.includes('plan is not active') || message.includes('Plan is not active')) {
    return apiResponse.error('Subscription plan is not active', 400)
  }
  if (message.includes('Subscription plan not found') || message.includes('plan not found')) {
    return apiResponse.error('Subscription plan not found', 404)
  }
  return apiResponse.error(fallbackMessage, 500)
}

// debit user wallet (wraps process_subscription_debit RPC)
export async function debitRovelsubUserWallet(
  supabase: SupabaseClient<Database>,
  userId: string,
  planId: string,
  idempotencyKey: string,
  target: string,
  amount?: number,
) {
  try {
    const {
      userId: validatedUserId,
      planId: validatedPlanId,
      idempotencyKey: validatedIdempotencyKey,
      target: validatedTarget,
      amount: validatedAmount,
    } = walletDebitSchema.parse({
      userId,
      planId,
      idempotencyKey,
      target,
      amount,
    })

    console.warn('[wallet] Debiting wallet via process_subscription_debit RPC:', {
      userId: validatedUserId,
      planId: validatedPlanId,
      idempotencyKey: validatedIdempotencyKey,
      amount: validatedAmount,
    })

    const { data, error: rpcError } = await supabase.rpc(
      'process_subscription_debit',
      {
        p_user_id: validatedUserId,
        p_plan_id: validatedPlanId,
        p_idempotency_key: validatedIdempotencyKey,
        p_target: validatedTarget,
        p_amount: validatedAmount ?? null,
      },
    )

    if (rpcError) {
      console.error('[wallet] Subscription Debit RPC error:', rpcError.message)
      return mapDebitRpcError(rpcError.message, 'Failed to process subscription checkout')
    }

    const orderResult = data as Record<string, any>

    console.warn('[wallet] Subscription debit processed successfully:', {
      orderId: orderResult.order_id,
      status: orderResult.status,
      amount: orderResult.amount,
      alreadyProcessed: orderResult.already_processed,
    })

    return apiResponse.success(
      orderResult,
      orderResult.already_processed
        ? 'Order was already processed (idempotency)'
        : 'Wallet debited successfully',
    )
  }
  catch (error: any) {
    console.error('[wallet] Error debiting wallet for subscription:', error.message)
    return handleUtilityError(error, 'Failed to process subscription checkout')
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

// Cart Checkout (atomic multi-item debit)
export interface CartCheckoutItem {
  plan_id: string
  idempotency_key: string
  target: string
  amount: number
}

const cartCheckoutItemSchema = z.object({
  plan_id: z.string().uuid(),
  idempotency_key: z.string().min(1),
  target: z.string().min(1),
  amount: z.number().positive().optional(),
})

const cartCheckoutSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  masterIdempotencyKey: z.uuid('Master idempotency key must be a valid UUID'),
  items: z.array(cartCheckoutItemSchema).min(1, 'At least one item is required for cart checkout'),
})

// debit cart checkout (wraps process_cart_checkout RPC)
export async function debitRovelsubCartCheckout(
  supabase: SupabaseClient<Database>,
  userId: string,
  masterIdempotencyKey: string,
  items: CartCheckoutItem[],
) {
  try {
    const {
      userId: validatedUserId,
      masterIdempotencyKey: validatedKey,
      items: validatedItems,
    } = cartCheckoutSchema.parse({
      userId,
      masterIdempotencyKey,
      items,
    })

    console.warn('[wallet] Processing atomic cart checkout via process_cart_checkout RPC:', {
      userId: validatedUserId,
      masterIdempotencyKey: validatedKey,
      itemCount: validatedItems.length,
    })

    // Log the items being sent to the RPC for debugging purposes
    console.warn('[wallet] Items being sent to RPC:', JSON.stringify(validatedItems, null, 2))

    const { data, error: rpcError } = await supabase.rpc(
      'process_cart_checkout',
      {
        p_user_id: validatedUserId,
        p_items: validatedItems as any,
        p_master_idempotency_key: validatedKey,
      },
    )

    if (rpcError) {
      console.error('[wallet] Cart checkout RPC error:', rpcError.message)
      return mapDebitRpcError(rpcError.message, 'Failed to process cart checkout')
    }

    const orderResult = data as Record<string, any>

    console.warn('[wallet] Cart checkout debit processed successfully:', {
      orders: orderResult.orders,
    })

    return apiResponse.success(
      orderResult,
      'Wallet debited successfully',
    )
  }
  catch (error: any) {
    console.error('[wallet] Error debiting wallet for cart checkout:', error.message)
    return handleUtilityError(error, 'Failed to process cart checkout')
  }
}
