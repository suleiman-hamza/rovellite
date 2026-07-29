import { defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import { fulfillOrder } from '~~/server/tasks/fulfill'
import { apiResponse } from '~~/server/utils/api-response'
import { verifyAuthToken } from '~~/server/utils/auth-verifier'
import { handleUtilityError } from '~~/server/utils/error-handler'
import { createAdminSupabaseClient } from '#server/utils/supabase'

// Validation Schema
const subscribeSchema = z.object({
  subscriptionPlanId: z.uuid({ message: 'Invalid subscription plan ID' }),
  targetIdentifier: z.string().min(1, { message: 'Target identifier is required' }),
  idempotencyKey: z.uuid({ message: 'Idempotency key must be a valid UUID' }),
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

    console.warn('[checkout/subscribe] Processing subscription intent:', {
      userId,
      planId: payload.subscriptionPlanId,
      idempotencyKey: payload.idempotencyKey,
    })

    const adminSupabase = createAdminSupabaseClient()

    // Call the PL/pgSQL function via Supabase RPC
    // This function atomically:
    //   1. Checks idempotency (returns existing if duplicate)
    //   2. Locks the wallet row (SELECT FOR UPDATE)
    //   3. Validates sufficient balance
    //   4. Debits the wallet
    //   5. Creates a DEBIT transaction ledger line
    //   6. Creates a PENDING_FULFILLMENT order
    const { data: rpcResult, error: rpcError } = await adminSupabase.rpc(
      'process_subscription_debit',
      {
        p_user_id: userId,
        p_plan_id: payload.subscriptionPlanId,
        p_idempotency_key: payload.idempotencyKey,
        p_target: payload.targetIdentifier,
      },
    )

    if (rpcError) {
      console.error('[checkout/subscribe] RPC error:', rpcError.message)

      // Parse PL/pgSQL RAISE EXCEPTION messages for user-friendly errors
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

    console.warn('[checkout/subscribe] Debit processed successfully:', {
      orderId: orderResult.order_id,
      alreadyProcessed: orderResult.already_processed,
      amount: orderResult.amount,
    })

    // If this was a duplicate idempotency key, return the existing order
    if (orderResult.already_processed) {
      return apiResponse.success(
        {
          orderId: orderResult.order_id,
          status: orderResult.status,
          amount: orderResult.amount,
          alreadyProcessed: true,
        },
        'Order was already processed (idempotency)',
      )
    }

    // Dispatch background fulfillment
    // Use event.waitUntil to run fulfillment asynchronously on Vercel
    // without blocking the HTTP response to the client.
    const fulfillmentPromise = fulfillOrder(adminSupabase, {
      orderId: orderResult.order_id as string,
      userId,
      planId: payload.subscriptionPlanId,
      targetIdentifier: payload.targetIdentifier,
      amount: orderResult.amount as number,
      serviceProvider: orderResult.service_provider as string,
      planName: orderResult.plan_name as string,
    })

    // event.waitUntil keeps the serverless function alive
    // until the background promise resolves or rejects
    if (typeof event.waitUntil === 'function') {
      event.waitUntil(fulfillmentPromise)
    }
    else {
      // Fallback: fire-and-forget (log errors only)
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
        amount: orderResult.amount,
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
