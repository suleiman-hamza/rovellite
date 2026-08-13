import { defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import { fulfillOrder } from '#server/tasks/fulfill'
import { apiResponse } from '#server/utils/api-response'
import { verifyAuthToken } from '#server/utils/auth-verifier'
import { handleUtilityError } from '#server/utils/error-handler'
import { createAdminSupabaseClient } from '#server/utils/supabase'

// Validation Schema
const subscribeSchema = z.object({
  subscriptionPlanId: z.uuid({ message: 'Invalid subscription plan ID' }),
  targetIdentifier: z.string().min(1, { message: 'Target identifier is required' }),
  idempotencyKey: z.uuid({ message: 'Idempotency key must be a valid UUID' }),
  amount: z
    .number()
    .min(50, { message: 'Subscription amount must be at least 50 NGN' })
    .optional(),
})

// Handler

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const payload = subscribeSchema.parse(body)

    // Authenticate user via session context or Bearer token
    const userId
      = event.context.user?.uid
        || (await verifyAuthToken(event)).decodedToken.uid

    if (!userId) {
      return apiResponse.error('Authentication is required to subscribe', 401)
    }

    console.warn('[checkout/subscribe] Processing subscription:', {
      userId,
      planId: payload.subscriptionPlanId,
      idempotencyKey: payload.idempotencyKey,
      amount: payload.amount,
    })

    const adminSupabase = createAdminSupabaseClient()

    // Call the PL/pgSQL function via Supabase RPC
    const { data: rpcResult, error: rpcError } = await adminSupabase.rpc(
      'process_subscription_debit',
      {
        p_user_id: userId,
        p_plan_id: payload.subscriptionPlanId,
        p_idempotency_key: payload.idempotencyKey,
        p_target: payload.targetIdentifier,
        p_amount: payload.amount ?? null,
      },
    )

    if (rpcError) {
      console.error('[checkout/subscribe] RPC error:', rpcError.message)

      const msg = rpcError.message || ''
      if (msg.includes('Insufficient balance')) {
        return apiResponse.error('Insufficient wallet balance for this subscription', 400)
      }
      if (msg.includes('not found')) {
        return apiResponse.error(msg, 404)
      }
      if (msg.includes('not active')) {
        return apiResponse.error(msg, 400)
      }

      return apiResponse.error('Failed to process subscription checkout', 500)
    }

    const orderResult = rpcResult as Record<string, unknown>
    const rpcAmount = Number(orderResult.amount || 0)

    let finalAmount = rpcAmount
    if (rpcAmount === 0) {
      if (payload.amount === undefined || payload.amount === null) {
        return apiResponse.error(
          'An amount is required for variable-price subscription plans (minimum 50 NGN)',
          400,
        )
      }
      finalAmount = Math.round(payload.amount * 100) / 100
      // Update order amount in DB for variable plans
      await adminSupabase
        .from('orders')
        .update({ amount: finalAmount })
        .eq('id', orderResult.order_id as string)
    }

    console.warn('[checkout/subscribe] Debit processed successfully:', {
      orderId: orderResult.order_id,
      alreadyProcessed: orderResult.already_processed,
      amount: finalAmount,
    })

    // If this was a duplicate idempotency key, return the existing order
    if (orderResult.already_processed) {
      return apiResponse.success(
        {
          orderId: orderResult.order_id,
          status: orderResult.status,
          amount: finalAmount,
          alreadyProcessed: true,
        },
        'Order was already processed (idempotency)',
      )
    }

    // Dispatch background fulfillment
    const fulfillmentPromise = fulfillOrder(adminSupabase, {
      orderId: orderResult.order_id as string,
      userId,
      planId: payload.subscriptionPlanId,
      targetIdentifier: payload.targetIdentifier,
      amount: finalAmount,
      serviceProvider: orderResult.service_provider as string,
      planName: orderResult.plan_name as string,
    })

    if (typeof event.waitUntil === 'function') {
      event.waitUntil(fulfillmentPromise)
    }
    else {
      fulfillmentPromise.catch((err) => {
        console.error('[checkout/subscribe] Background fulfillment error:', err)
      })
    }

    // Return 202 Accepted immediately
    event.node.res.statusCode = 202

    return apiResponse.success(
      {
        orderId: orderResult.order_id,
        status: 'PENDING_FULFILLMENT',
        amount: finalAmount,
        planName: orderResult.plan_name,
        serviceProvider: orderResult.service_provider,
        targetIdentifier: payload.targetIdentifier,
      },
      'Subscription order sent. Fulfillment in progress.',
    )
  }
  catch (error: any) {
    console.error('[checkout/subscribe] Error:', error.message)
    return handleUtilityError(error, 'Failed to process subscription checkout')
  }
})
