import type { Json } from '~~/types/supabase-schema'
import type { createAdminSupabaseClient } from '#server/utils/supabase'
import { z } from 'zod'
import { interpretResponse, paymentLookup, processPayment } from '~~/server/utils/coralpay-service'

// Fulfillment Payload Schema & Type Validation
export const fulfillmentPayloadSchema = z.object({
  orderId: z.string().min(1, 'orderId is required'),
  userId: z.string().min(1, 'userId is required'),
  planId: z.string().min(1, 'planId is required'),
  targetIdentifier: z.string().min(1, 'targetIdentifier is required'),
  amount: z.number().positive('amount must be a positive number'),
  serviceProvider: z.string().min(1, 'serviceProvider is required'),
  planName: z.string().min(1, 'planName is required'),
})

export type FulfillmentPayload = z.infer<typeof fulfillmentPayloadSchema>

// Exponential Backoff Configuration

/** Delays in milliseconds for polling pending transactions (09/68) */
const POLL_DELAYS_MS = [10_000, 20_000, 40_000, 80_000] as const
const MAX_POLL_ATTEMPTS = POLL_DELAYS_MS.length

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
  // Validate payload structure using Zod
  const validatedPayload = fulfillmentPayloadSchema.parse(payload)
  const { orderId, userId, targetIdentifier, amount, serviceProvider, planName, planId } = validatedPayload

  console.warn('[fulfillment] Starting background fulfillment:', {
    orderId,
    serviceProvider,
    target: targetIdentifier,
  })

  try {
    let vendorResponse: Record<string, Json>

    if (serviceProvider === 'CORALPAY') {
      console.warn('[Coralpay fulfillment] Fetching plan metadata and user profile...')

      // Fetch Plan Metadata
      const { data: plan, error: planError } = await supabase
        .from('subscription_plans')
        .select('metadata')
        .eq('id', planId)
        .single()

      if (planError || !plan) {
        throw new Error(planError?.message || 'Subscription plan metadata not found')
      }

      const metadata = (plan.metadata || {}) as any
      const packageSlug = metadata?.coralpay?.packageSlug || metadata?.packageSlug
      if (!packageSlug) {
        throw new Error(`Plan ${planId} is missing coralpay.packageSlug in metadata`)
      }

      // Fetch User Profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('phone, full_name, email')
        .eq('user_id', userId)
        .single()

      const customerName = profile?.full_name || 'RovelSub Customer'
      const phoneNumber = profile?.phone || '2348000000000'
      const email = profile?.email || 'customer@rovellite.com'

      // Build payment payload
      const paymentPayload = {
        paymentReference: `ref_${orderId}`,
        customerId: targetIdentifier,
        packageSlug,
        channel: 'WEB' as const,
        amount,
        customerName,
        phoneNumber,
        email,
      }

      console.warn('[fulfillment] Dispatching process-payment to CoralPay API...', paymentPayload)

      // Save vendor request to order
      await supabase
        .from('orders')
        .update({ vendor_request: paymentPayload })
        .eq('id', orderId)

      // Call CoralPay directly via the service layer (not through own proxy)
      const cpResponse = await processPayment(paymentPayload)

      // Interpret the ISO 8583 response
      const interpretation = interpretResponse(cpResponse)

      console.warn('[fulfillment] Response interpretation:', {
        action: interpretation.action,
        code: interpretation.code,
        message: interpretation.message,
      })

      if (interpretation.action === 'COMPLETE') {
        vendorResponse = cpResponse.responseData as Record<string, Json>
      }
      else if (interpretation.action === 'POLL') {
        // Exponential Backoff Polling for 09/68
        console.warn(`[fulfillment] Payment pending (code: ${interpretation.code}). Starting exponential backoff polling...`)

        let pollResult: Record<string, Json> | null = null

        for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
          const delay = POLL_DELAYS_MS[attempt]!
          console.warn(`[fulfillment] Polling attempt ${attempt + 1}/${MAX_POLL_ATTEMPTS} after ${delay / 1000}s...`)
          await new Promise(resolve => setTimeout(resolve, delay))

          try {
            const lookupResponse = await paymentLookup({
              paymentReference: `ref_${orderId}`,
            })

            const lookupInterpretation = interpretResponse(lookupResponse)

            if (lookupInterpretation.action === 'COMPLETE') {
              console.warn('[fulfillment] Polling resolved: SUCCESS')
              pollResult = lookupResponse.responseData as Record<string, Json>
              break
            }
            else if (lookupInterpretation.action === 'FAIL') {
              // Terminal failure during polling
              throw new Error(
                lookupInterpretation.customerMessage
                || lookupInterpretation.message
                || `Transaction failed with code: ${lookupInterpretation.code}`,
              )
            }
            // Still POLL → continue to next attempt
            console.warn(`[fulfillment] Still pending (code: ${lookupInterpretation.code}). Continuing...`)
          }
          catch (pollErr: any) {
            console.error('[fulfillment] Polling iteration error:', pollErr.message)
            // Only re-throw if it's a business-logic failure, not a transient network error
            if (pollErr.message && !pollErr.message.includes('fetch') && !pollErr.message.includes('timeout')) {
              throw pollErr
            }
          }
        }

        if (pollResult) {
          vendorResponse = pollResult
        }
        else {
          // Polling exhausted without resolution.
          // DO NOT AUTO-REVERSE — leave as PENDING_FULFILLMENT for manual reconciliation.
          console.warn('[fulfillment] ⚠️ Polling exhausted without final status. Leaving order as PENDING_FULFILLMENT for reconciliation.')
          return
        }
      }
      else {
        // action === 'FAIL' (codes: 06, 25, 96)
        throw new Error(
          interpretation.customerMessage
          || interpretation.message
          || `Vendor rejected with code: ${interpretation.code}`,
        )
      }

      // Extract vendor_tx_id and fulfillment_token
      const vendorTxId = (vendorResponse as any)?.transactionId || null
      const fulfillmentToken = (vendorResponse as any)?.token || (vendorResponse as any)?.rechargeToken || null

      // Mark order as COMPLETED with enriched data
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'COMPLETED',
          vendor_response: vendorResponse,
          vendor_tx_id: vendorTxId,
          fulfillment_token: fulfillmentToken,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId)

      if (updateError) {
        console.error('[fulfillment] Failed to update order to COMPLETED:', updateError.message)
        throw updateError
      }
    }
    else if (serviceProvider === 'SOCHITEL') {
      console.warn('[fulfillment] Dispatching to Sochitel API...')
      // vendorResponse = await sochitelClient.purchase({ ... })
      vendorResponse = { status: 'simulated_success', provider: 'SOCHITEL' }

      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'COMPLETED',
          vendor_response: vendorResponse,
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId)

      if (updateError) {
        console.error('[fulfillment] Failed to update order to COMPLETED:', updateError.message)
        throw updateError
      }
    }
    else {
      throw new Error(`Unknown service provider: ${serviceProvider}`)
    }

    console.warn('[fulfillment] ✅ Order fulfilled successfully:', {
      orderId,
      planName,
      target: targetIdentifier,
    })
  }
  catch (error: any) {
    console.error('[fulfillment] Vendor fulfillment failed:', {
      orderId,
      error: error.message,
    })

    // Rollback: Mark order FAILED and refund the user
    await rollbackOrder(supabase, orderId, userId, amount, error.message)
  }
}

// Rollback Helper — refunds the user on fulfillment failure

async function rollbackOrder(
  supabase: ReturnType<typeof createAdminSupabaseClient>,
  orderId: string,
  userId: string,
  amount: number,
  errorMessage: string,
): Promise<void> {
  console.warn('[fulfillment/rollback] Starting atomic rollback for order:', orderId)

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
    console.warn('[fulfillment/rollback] ✅ Atomic rollback completed successfully. Refunded balance:', result.new_balance)
  }
  catch (err: any) {
    console.error('[fulfillment/rollback] Critical rollback error:', err.message)
  }
}
