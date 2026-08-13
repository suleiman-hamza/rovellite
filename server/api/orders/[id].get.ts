import { defineEventHandler, getRouterParam } from 'h3'
import { z } from 'zod'
import { apiResponse } from '#server/utils/api-response'
import { verifyAuthToken } from '#server/utils/auth-verifier'
import { handleUtilityError } from '#server/utils/error-handler'
import { createAdminSupabaseClient } from '#server/utils/supabase'

const orderIdSchema = z.uuid('Invalid order ID format')

export default defineEventHandler(async (event) => {
  try {
    const idParam = getRouterParam(event, 'id')
    const orderId = orderIdSchema.parse(idParam)

    // Authenticate user via session context or Bearer token
    const userId
      = event.context.user?.uid
        || (await verifyAuthToken(event)).decodedToken.uid

    if (!userId) {
      return apiResponse.error('Authentication is required to view order status', 401)
    }

    const adminSupabase = createAdminSupabaseClient()

    const { data: order, error: fetchError } = await adminSupabase
      .from('orders')
      .select(`
        id,
        user_id,
        plan_id,
        idempotency_key,
        target_identifier,
        amount,
        status,
        vendor_tx_id,
        fulfillment_token,
        error_message,
        created_at,
        updated_at,
        subscription_plans (
          name,
          service_provider
        )
      `)
      .eq('id', orderId)
      .eq('user_id', userId)
      .single()

    if (fetchError || !order) {
      return apiResponse.error('Order not found', 404)
    }

    const planDetails = (order.subscription_plans as any) || {}

    const result = {
      orderId: order.id,
      userId: order.user_id,
      planId: order.plan_id,
      planName: planDetails.name || null,
      serviceProvider: planDetails.service_provider || null,
      targetIdentifier: order.target_identifier,
      amount: Number(order.amount),
      status: order.status,
      vendorTxId: order.vendor_tx_id,
      fulfillmentToken: order.fulfillment_token,
      errorMessage: order.error_message,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
    }

    return apiResponse.success(result, 'Order status retrieved successfully')
  }
  catch (error: any) {
    console.error('[orders/[id]] Error:', error.message)
    return handleUtilityError(error, 'Failed to fetch order status')
  }
})
