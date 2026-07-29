import { defineEventHandler } from 'h3'
import { z } from 'zod'
import { apiResponse } from '~~/server/utils/api-response'
import { handleUtilityError } from '~~/server/utils/error-handler'
import { createAdminSupabaseClient } from '#server/utils/supabase'

// Validation Schema

const cartValidationSchema = z.object({
  subscriptionPlanId: z.uuid('Invalid subscription plan ID format'),
  targetIdentifier: z.string().min(1, 'Target identifier is required (e.g. phone number)'),
})

// Cart Validation Expiry (20 minutes)

const CART_EXPIRY_MS = 20 * 60 * 1000

// Response Type

interface CartValidationResult {
  planId: string
  planName: string
  serviceProvider: string
  validatedPrice: number
  taxFees: number
  totalAmount: number
  targetIdentifier: string
  expiresAt: string
}

// Handler

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { subscriptionPlanId, targetIdentifier } = cartValidationSchema.parse(body)

    console.warn('[cart/validate] Validating cart for plan:', subscriptionPlanId)

    const adminSupabase = createAdminSupabaseClient()

    // Query the subscription plan from the database
    const { data: plan, error: planError } = await adminSupabase
      .from('subscription_plans')
      .select('id, name, price, service_provider, is_active')
      .eq('id', subscriptionPlanId)
      .single()

    if (planError) {
      console.error('[cart/validate] DB error fetching plan:', planError.message)
      return apiResponse.error('Failed to retrieve subscription plan', 500)
    }

    if (!plan) {
      console.warn('[cart/validate] Plan not found:', subscriptionPlanId)
      return apiResponse.error('Subscription plan not found', 404)
    }

    if (!plan.is_active) {
      console.warn('[cart/validate] Plan is inactive:', plan.name)
      return apiResponse.error('This subscription plan is currently unavailable', 400)
    }

    // Build the validated cart payload
    const validatedPrice = Number(plan.price)
    const taxFees = 0 // Digital subscriptions carry zero tax
    const totalAmount = validatedPrice + taxFees
    const expiresAt = new Date(Date.now() + CART_EXPIRY_MS).toISOString()

    const result: CartValidationResult = {
      planId: plan.id,
      planName: plan.name,
      serviceProvider: plan.service_provider,
      validatedPrice,
      taxFees,
      totalAmount,
      targetIdentifier,
      expiresAt,
    }

    console.warn('[cart/validate] Validation successful:', {
      plan: plan.name,
      price: validatedPrice,
      expiresAt,
    })

    return apiResponse.success(result, 'Cart validated successfully')
  }
  catch (error: any) {
    console.error('[cart/validate] Error:', error.message)
    return handleUtilityError(error, 'Failed to validate cart')
  }
})
