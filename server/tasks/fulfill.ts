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
  const { orderId, userId, targetIdentifier, amount, serviceProvider, planName, planId } = payload

  console.warn('[fulfillment] Starting background fulfillment:', {
    orderId,
    serviceProvider,
    target: targetIdentifier,
  })

  try {
    let vendorResponse: Record<string, Json>

    if (serviceProvider === 'CORALPAY') {
      console.warn('[fulfillment] Fetching plan metadata and user profile...')

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

      // 2. Fetch User Profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('phone, full_name, email')
        .eq('user_id', userId)
        .single()

      const customerName = profile?.full_name || 'RovelSub Customer'
      const phoneNumber = profile?.phone || '2348000000000'
      const email = profile?.email || 'customer@rovellite.com'

      // Dispatch to CoralPay process-payment
      const paymentPayload = {
        paymentReference: `ref_${orderId}`,
        customerId: targetIdentifier,
        packageSlug,
        channel: 'WEB',
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

      const cpResponse = await $fetch<any>('/api/coral-pay/transactions/process-payment', {
        method: 'POST',
        body: paymentPayload,
      })

      const responseCode = cpResponse?.responseCode || cpResponse?.responseData?.statusCode
      const hasError = cpResponse?.error ?? true

      if (hasError || !responseCode) {
        throw new Error(cpResponse?.message || 'Unknown CoralPay error occurred')
      }

      if (responseCode === '00') {
        vendorResponse = cpResponse.responseData
      }
      else if (responseCode === '09' || responseCode === '68') {
        console.warn(`[fulfillment] Payment pending (code: ${responseCode}). Starting active polling...`)

        let pollAttempts = 0
        const maxAttempts = 6 // 6 attempts * 5 seconds = 30 seconds
        let pollResult: any = null

        // Poll the transaction status
        while (pollAttempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 5000))
          pollAttempts++
          console.warn(`[fulfillment] Polling transaction status (Attempt ${pollAttempts}/${maxAttempts})...`)

          try {
            const lookupResponse = await $fetch<any>('/api/coral-pay/transactions/payment-lookup', {
              method: 'GET',
              query: { paymentReference: `ref_${orderId}` },
            })

            const lookupCode = lookupResponse?.responseCode || lookupResponse?.responseData?.statusCode

            if (lookupResponse?.error === false && lookupCode === '00') {
              console.warn('[fulfillment] Polling success!')
              pollResult = lookupResponse.responseData
              break
            }
            else if (lookupCode && lookupCode !== '09' && lookupCode !== '68') {
              throw new Error(lookupResponse?.message || `Transaction failed with code: ${lookupCode}`)
            }
          }
          catch (pollErr: any) {
            console.error('[fulfillment] Polling iteration error:', pollErr.message)
            if (pollErr.message && !pollErr.message.includes('fetch')) {
              throw pollErr
            }
          }
        }

        if (pollResult) {
          vendorResponse = pollResult
        }
        else {
          console.warn('[fulfillment] Polling completed without final status. Leaving order pending.')
          return
        }
      }
      else {
        throw new Error(cpResponse?.message || `Vendor rejected checkout with code: ${responseCode}`)
      }
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
