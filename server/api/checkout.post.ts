import type { CartCheckoutItem } from '~~/server/utils/wallet'
import { defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import { fulfillOrder } from '~~/server/tasks/fulfill'
import { apiResponse } from '~~/server/utils/api-response'
import { verifyAuthToken } from '~~/server/utils/auth-verifier'
import { handleUtilityError } from '~~/server/utils/error-handler'
import { debitRovelsubCartCheckout, debitRovelsubUserWallet } from '~~/server/utils/wallet'
import { createAdminSupabaseClient } from '#server/utils/supabase'

// Validation Schemas

// Cart item — represents a single bill/airtime/utility product from the cart
const cartItemSchema = z.object({
  productId: z.union([z.string(), z.number()]),
  productName: z.string().min(1, 'Product name is required'),
  amount: z.number().positive('Item amount must be greater than zero'),
  billerId: z.union([z.string(), z.number()]),
  customerReference: z.string().min(1, 'Customer reference is required'),
})

// Unified checkout schema — accepts EITHER a subscription plan OR cart items
const checkoutSchema = z.object({
  // Required: idempotency key to prevent double-processing
  idempotencyKey: z.uuid({ message: 'Idempotency key must be a valid UUID' }),

  // Option A: Subscription plan checkout (premium digital subscriptions)
  subscriptionPlanId: z.uuid({ message: 'Invalid subscription plan ID' }).optional(),
  targetIdentifier: z.string().min(1, 'Target identifier is required').optional(),

  // Option B: General cart items checkout (airtime, bills, utilities)
  cartItems: z.array(cartItemSchema).optional(),
  totalAmount: z.number().positive('Total amount must be greater than zero').optional(),
  description: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
}).refine(
  (data) => {
    // Must provide one of the two checkout types
    const hasSubscription = !!data.subscriptionPlanId
    const hasCart = !!data.cartItems && data.cartItems.length > 0
    return hasSubscription || hasCart
  },
  { message: 'Either subscriptionPlanId or cartItems must be provided' },
).refine(
  (data) => {
    // If subscription plan, targetIdentifier is required
    if (data.subscriptionPlanId && !data.targetIdentifier) {
      return false
    }
    return true
  },
  { message: 'targetIdentifier is required for subscription checkout', path: ['targetIdentifier'] },
).refine(
  (data) => {
    // If cart items, totalAmount is required
    if (data.cartItems && data.cartItems.length > 0 && !data.totalAmount) {
      return false
    }
    return true
  },
  { message: 'totalAmount is required for cart checkout', path: ['totalAmount'] },
)

// Unified Checkout Handler

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const payload = checkoutSchema.parse(body)

    // Authenticate user via session context or Bearer token
    const userId
      = event.context.user?.uid
        || (await verifyAuthToken(event)).decodedToken.uid

    if (!userId) {
      return apiResponse.error('Authentication is required to perform checkout', 401)
    }

    const adminSupabase = createAdminSupabaseClient()

    // Subscription Plan Checkout
    if (payload.subscriptionPlanId) {
      return await handleSubscriptionCheckout(event, adminSupabase, userId, payload)
    }

    // General Cart Checkout
    return await handleCartCheckout(event, adminSupabase, userId, payload)
  }
  catch (error: any) {
    console.error('[checkout] Error:', error.message)
    return handleUtilityError(error, 'Failed to process checkout')
  }
})

// Subscription Checkout Handler
async function handleSubscriptionCheckout(
  event: any,
  supabase: ReturnType<typeof createAdminSupabaseClient>,
  userId: string,
  payload: any,
) {
  console.warn('[checkout] Processing subscription checkout:', {
    userId,
    planId: payload.subscriptionPlanId,
    idempotencyKey: payload.idempotencyKey,
  })

  // Call the consolidated debit utility wrapper
  const result = await debitRovelsubUserWallet(
    supabase,
    userId,
    payload.subscriptionPlanId,
    payload.idempotencyKey,
    payload.targetIdentifier,
  )

  if (!result.success) {
    event.node.res.statusCode = result.statusCode || 400
    return result
  }

  const orderResult = result.data as Record<string, unknown>

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
  const fulfillmentPromise = fulfillOrder(supabase, {
    orderId: orderResult.order_id as string,
    userId,
    planId: payload.subscriptionPlanId,
    targetIdentifier: payload.targetIdentifier,
    amount: orderResult.amount as number,
    serviceProvider: orderResult.service_provider as string,
    planName: orderResult.plan_name as string,
  })

  if (typeof event.waitUntil === 'function') {
    event.waitUntil(fulfillmentPromise)
  }
  else {
    fulfillmentPromise.catch((error: any) => {
      console.error('[checkout] Background fulfillment error:', error)
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
    'Checkout order accepted. Fulfillment in progress.',
  )
}

// General Cart Checkout Handler

async function handleCartCheckout(
  event: any,
  supabase: ReturnType<typeof createAdminSupabaseClient>,
  userId: string,
  payload: any,
) {
  const cartItems = payload.cartItems as Array<{
    productId: string | number
    productName: string
    amount: number
    billerId: string | number
    customerReference: string
  }>

  console.warn('[checkout] Processing cart checkout:', {
    userId,
    itemCount: cartItems.length,
    totalAmount: payload.totalAmount,
    idempotencyKey: payload.idempotencyKey,
  })

  // Server-side total verification
  const totalAmountFromCart = cartItems.reduce(
    (sum, item) => sum + Number(item.amount),
    0,
  )

  if (Math.abs(totalAmountFromCart - payload.totalAmount) > 0.001) {
    return apiResponse.error('Total amount does not match cart item sum', 400)
  }

  // Zod UUID validation for each item (cheap sanity check)
  for (const item of cartItems) {
    const isUuid = z.string().uuid().safeParse(String(item.productId)).success
    if (!isUuid) {
      console.error('[checkout] Invalid product ID format (not UUID):', item.productId)
      return apiResponse.error(
        `Product ID "${item.productId}" for "${item.productName}" is not a valid UUID format. All digital plans/subscriptions must use valid UUIDs.`,
        400,
      )
    }
  }

  // Build the items array for the atomic RPC
  const items: CartCheckoutItem[] = cartItems.map((item, index) => ({
    plan_id: String(item.productId),
    idempotency_key: `${payload.idempotencyKey}-${index}-${item.productId}`,
    target: item.customerReference,
  }))

  // Single atomic debit call — all items debit in one database transaction
  const result = await debitRovelsubCartCheckout(
    supabase,
    userId,
    payload.idempotencyKey,
    items,
  )

  if (!result.success) {
    event.node.res.statusCode = result.statusCode || 400
    return result
  }

  const checkoutResult = result.data as { orders: any[] }
  const orders = checkoutResult.orders

  //  Dispatch background fulfillments ONLY now that checkout debit has fully succeeded
  const fulfillmentPromises: Promise<void>[] = []

  for (const order of orders) {
    if (!order.already_processed) {
      const promise = fulfillOrder(supabase, {
        orderId: order.order_id as string,
        userId,
        planId: items.find(i => i.idempotency_key === order.idempotency_key)?.plan_id || '',
        targetIdentifier: order.target as string,
        amount: order.amount as number,
        serviceProvider: order.service_provider as string,
        planName: order.plan_name as string,
      })
      fulfillmentPromises.push(promise)
    }
  }

  if (fulfillmentPromises.length > 0) {
    const batchPromise = Promise.allSettled(fulfillmentPromises).then((results) => {
      const failed = results.filter(r => r.status === 'rejected')
      if (failed.length > 0) {
        console.error(`[checkout] ${failed.length}/${results.length} fulfillments failed`)
      }
    })

    if (typeof event.waitUntil === 'function') {
      event.waitUntil(batchPromise)
    }
    else {
      batchPromise.catch((err: any) => {
        console.error('[checkout] Batch fulfillment error:', err)
      })
    }
  }

  // Return 202 Accepted with all order IDs
  event.node.res.statusCode = 202

  return apiResponse.success(
    {
      orders: orders.map(o => ({
        orderId: o.order_id,
        status: o.already_processed ? o.status : 'PENDING_FULFILLMENT',
        amount: o.amount,
        planName: o.plan_name,
        serviceProvider: o.service_provider,
        alreadyProcessed: o.already_processed ?? false,
      })),
      totalAmount: payload.totalAmount,
      itemCount: cartItems.length,
    },
    'Checkout accepted. Fulfillment in progress.',
  )
}
