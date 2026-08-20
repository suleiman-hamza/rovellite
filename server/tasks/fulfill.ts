import type { Json } from '~~/types/supabase-schema'
import type { createAdminSupabaseClient } from '#server/utils/supabase'
import { z } from 'zod'
import { interpretResponse, paymentLookup, processPayment } from '#server/utils/coralpay-service'

// Schema & Types
export const fulfillmentPayloadSchema = z.object({
  orderId: z.string().min(1, { error: 'orderId is required' }),
  userId: z.string().min(1, { error: 'userId is required' }),
  planId: z.string().min(1, { error: 'planId is required' }),
  targetIdentifier: z.string().min(1, { error: 'targetIdentifier is required' }),
  amount: z.number().positive({ error: 'amount must be a positive number' }),
  serviceProvider: z.string().min(1, { error: 'serviceProvider is required' }),
  planName: z.string().min(1, { error: 'planName is required' }),
})

export type FulfillmentPayload = z.infer<typeof fulfillmentPayloadSchema>

// Typed shape for CoralPay plan metadata
interface CoralPayPlanMetadata {
  coralpay?: { packageSlug?: string }
  packageSlug?: string
}

// Exponential Backoff Config
/** Delays in milliseconds for polling pending transactions (09/68) */
const POLL_DELAYS_MS = [10_000, 20_000, 40_000, 80_000] as const
const MAX_POLL_ATTEMPTS = POLL_DELAYS_MS.length

// Shared DB Helper

/**
 * Marks an order as COMPLETED and saves vendor response data.
 * Extracted to eliminate duplication across provider handlers.
 */
async function markOrderCompleted(
  supabase: ReturnType<typeof createAdminSupabaseClient>,
  orderId: string,
  vendorResponse: Record<string, Json>,
  extras?: {
    vendor_tx_id?: string | null
    fulfillment_token?: string | null
  },
): Promise<void> {
  const { error: updateError } = await supabase
    .from('orders')
    .update({
      status: 'COMPLETED',
      vendor_response: vendorResponse,
      vendor_tx_id: extras?.vendor_tx_id ?? null,
      fulfillment_token: extras?.fulfillment_token ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId)

  if (updateError) {
    console.error('[fulfillment] Failed to update order to COMPLETED:', updateError.message)
    throw updateError
  }
}

// Provider Handlers
/**
 * Handles CoralPay fulfillment:
 * - Fetches plan metadata + user profile
 * - Dispatches payment, interprets ISO 8583 response
 * - Polls with exponential backoff on 09/68
 * - Returns vendorResponse on success, throws on failure, returns null on exhausted poll
 */
async function fulfillCoralPay(
  supabase: ReturnType<typeof createAdminSupabaseClient>,
  payload: FulfillmentPayload,
): Promise<Record<string, Json> | null> {
  const { orderId, userId, planId, targetIdentifier, amount } = payload

  // Fetch Plan Metadata
  const { data: plan, error: planError } = await supabase
    .from('subscription_plans')
    .select('metadata')
    .eq('id', planId)
    .single()

  if (planError || !plan) {
    throw new Error(planError?.message || 'Subscription plan metadata not found')
  }

  const metadata = (plan.metadata || {}) as CoralPayPlanMetadata
  const packageSlug = metadata?.coralpay?.packageSlug || metadata?.packageSlug
  if (!packageSlug) {
    throw new Error(`Plan ${planId} is missing coralpay.packageSlug in metadata`)
  }

  // Fetch User Profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('phone, full_name, email')
    .eq('user_id', userId)
    .single()

  if (profileError || !profile) {
    throw new Error(`User profile not found for userId: ${userId}`)
  }

  if (!profile.phone || !profile.email) {
    throw new Error(`User profile for ${userId} is missing required phone or email for vendor dispatch`)
  }

  const paymentPayload = {
    paymentReference: `ref_${orderId}`,
    customerId: targetIdentifier,
    packageSlug,
    channel: 'WEB' as const,
    amount,
    customerName: profile.full_name || 'Unknown Customer',
    phoneNumber: profile.phone,
    email: profile.email,
  }

  // Save vendor request to order
  await supabase
    .from('orders')
    .update({ vendor_request: paymentPayload })
    .eq('id', orderId)

  // Dispatch to CoralPay
  const cpResponse = await processPayment(paymentPayload)
  const interpretation = interpretResponse(cpResponse)

  if (interpretation.action === 'COMPLETE') {
    return cpResponse.responseData as Record<string, Json>
  }

  if (interpretation.action === 'POLL') {
    // Exponential Backoff Polling for 09/68
    for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
      const delay = POLL_DELAYS_MS[attempt]!
      await new Promise(resolve => setTimeout(resolve, delay))

      try {
        const lookupResponse = await paymentLookup({
          paymentReference: `ref_${orderId}`,
        })

        const lookupInterpretation = interpretResponse(lookupResponse)

        if (lookupInterpretation.action === 'COMPLETE') {
          return lookupResponse.responseData as Record<string, Json>
        }

        if (lookupInterpretation.action === 'FAIL') {
          throw new Error(
            lookupInterpretation.customerMessage
            || lookupInterpretation.message
            || `Transaction failed with code: ${lookupInterpretation.code}`,
          )
        }
        // action === 'POLL' → continue to next attempt
      }
      catch (pollError: any) {
        // Re-throw only on business-logic failures, swallow transient network errors
        if (pollError.message && !pollError.message.includes('fetch') && !pollError.message.includes('timeout')) {
          throw pollError
        }
      }
    }

    // Polling exhausted — DO NOT AUTO-REVERSE.
    // Leave as PENDING_FULFILLMENT for manual reconciliation.
    return null
  }

  // action === 'FAIL' (codes: 06, 25, 96)
  throw new Error(
    interpretation.customerMessage
    || interpretation.message
    || `Vendor rejected with code: ${interpretation.code}`,
  )
}

/**
 * Handles Sochitel fulfillment.
 * Not yet implemented — throws to prevent silent fake completions.
 */
async function fulfillSochitel(
  _supabase: ReturnType<typeof createAdminSupabaseClient>,
  _payload: FulfillmentPayload,
): Promise<Record<string, Json>> {
  // TODO: Implement Sochitel client integration
  // vendorResponse = await sochitelClient.purchase({ ... })
  throw new Error('SOCHITEL fulfillment is not yet implemented')
}

// Main Orchestrator

/**
 * Background fulfillment worker that dispatches subscription orders
 * to the appropriate third-party vendor API (CoralPay / Sochitel).
 *
 * On success → marks order COMPLETED with vendor response.
 * On pending (09/68) → polls with exponential backoff. If still pending,
 *   leaves order as PENDING_FULFILLMENT (NEVER auto-reverses).
 * On failure (06/25/96) → rolls back: marks order FAILED, refunds wallet, logs CREDIT transaction.
 */
export async function fulfillOrder(
  supabase: ReturnType<typeof createAdminSupabaseClient>,
  payload: FulfillmentPayload,
): Promise<void> {
  const validatedPayload = fulfillmentPayloadSchema.parse(payload)
  const { orderId, userId, amount, serviceProvider } = validatedPayload

  // Idempotency Guard
  const { data: existingOrder } = await supabase
    .from('orders')
    .select('status')
    .eq('id', orderId)
    .single()

  if (existingOrder?.status === 'COMPLETED' || existingOrder?.status === 'FAILED') {
    console.warn(`[fulfillment] Order ${orderId} is already ${existingOrder.status}. Skipping.`)
    return
  }

  try {
    let vendorResponse: Record<string, Json> | null = null

    if (serviceProvider === 'CORALPAY') {
      vendorResponse = await fulfillCoralPay(supabase, validatedPayload)
    }
    else if (serviceProvider === 'SOCHITEL') {
      vendorResponse = await fulfillSochitel(supabase, validatedPayload)
    }
    else {
      throw new Error(`Unknown service provider: ${serviceProvider}`)
    }

    // null = polling exhausted → leave as PENDING_FULFILLMENT
    if (vendorResponse === null) {
      console.warn(`[fulfillment] Polling exhausted for order ${orderId}. Left as PENDING_FULFILLMENT.`)
      return
    }

    const vendorTxId = (vendorResponse as any)?.transactionId ?? null
    const fulfillmentToken = (vendorResponse as any)?.token ?? (vendorResponse as any)?.rechargeToken ?? null

    await markOrderCompleted(supabase, orderId, vendorResponse, {
      vendor_tx_id: vendorTxId,
      fulfillment_token: fulfillmentToken,
    })
  }
  catch (error: any) {
    console.error('[fulfillment] Vendor fulfillment failed:', {
      orderId,
      error: error.message,
    })

    await rollbackOrder(supabase, orderId, userId, amount, error.message)
  }
}

// Rollback Helper

/**
 * Refunds the user atomically via Supabase RPC on fulfillment failure.
 * Marks order FAILED and logs a CREDIT transaction.
 */
async function rollbackOrder(
  supabase: ReturnType<typeof createAdminSupabaseClient>,
  orderId: string,
  userId: string,
  amount: number,
  errorMessage: string,
): Promise<void> {
  try {
    const { data, error: rpcError } = await supabase.rpc(
      'reverse_subscription_debit',
      {
        p_order_id: orderId,
        p_user_id: userId,
        p_amount: amount,
        p_error_message: errorMessage,
      },
    )

    if (rpcError) {
      console.error('[fulfillment/rollback] Rollback RPC failed:', rpcError.message)
      return
    }

    const result = data as any
    if (result?.error) {
      console.error('[fulfillment/rollback] Rollback returned error:', result.error)
      return
    }

    console.warn('[fulfillment/rollback] Rollback completed successfully for order:', orderId)
  }
  catch (error: any) {
    console.error('[fulfillment/rollback] Unexpected error during rollback:', error.message || error)
  }
}
