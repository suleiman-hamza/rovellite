import type { Json } from '~~/types/supabase-schema'
import type { createAdminSupabaseClient } from '#server/utils/supabase'

// Fulfillment Payload
export interface FulfillmentPayload {
  orderId: string
  userId: string
  planId: string
  targetIdentifier: string
  amount: number
  serviceProvider: string
  planName: string
}

/**
 * Background fulfillment worker that dispatches subscription orders
 * to the appropriate third-party vendor API (CoralPay / Sochitel).
 *
 * On success → marks order COMPLETED with vendor response.
 * On failure → rolls back: marks order FAILED, refunds wallet, logs CREDIT transaction.
 */
export async function fulfillOrder(
  supabase: ReturnType<typeof createAdminSupabaseClient>,
  payload: FulfillmentPayload,
): Promise<void> {
  const { orderId, userId, targetIdentifier, amount, serviceProvider, planName } = payload

  console.warn('[fulfillment] Starting background fulfillment:', {
    orderId,
    serviceProvider,
    target: targetIdentifier,
  })

  try {
    // Step 1: Call the third-party vendor API
    // Replace with actual CoralPay/Sochitel API calls
    let vendorResponse: Record<string, Json>

    if (serviceProvider === 'CORALPAY') {
      console.warn('[fulfillment] Dispatching to CoralPay API...')
      // vendorResponse = await coralPayClient.purchase({ ... })
      vendorResponse = { status: 'simulated_success', provider: 'CORALPAY' }
    }
    else if (serviceProvider === 'SOCHITEL') {
      console.warn('[fulfillment] Dispatching to Sochitel API...')
      // vendorResponse = await sochitelClient.purchase({ ... })
      vendorResponse = { status: 'simulated_success', provider: 'SOCHITEL' }
    }
    else {
      throw new Error(`Unknown service provider: ${serviceProvider}`)
    }

    // Step 2: Mark order as COMPLETED
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

    console.warn('[fulfillment] Order fulfilled successfully:', {
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
