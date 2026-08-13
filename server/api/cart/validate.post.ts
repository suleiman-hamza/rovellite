import { defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import { apiResponse } from '#server/utils/api-response'
import { handleUtilityError } from '#server/utils/error-handler'
import { createAdminSupabaseClient } from '#server/utils/supabase'

// Validation Schema

const cartValidationSchema = z.object({
  subscriptionPlanId: z.uuid('Invalid subscription plan ID format'),
  targetIdentifier: z.string().min(1, 'Target identifier is required (e.g. phone number)'),
  amount: z.number().finite('Amount must be a valid number').min(50, 'Subscription amount must be at least 50 NGN').optional(),
})

// Cart Validation Expiry (20 minutes)

const CART_EXPIRY_MS = 20 * 60 * 1000

// Response Type

interface CartValidationResult {
  planId: string
  planName: string
  serviceProvider: string
  billerSlug: string | null
  isVariableAmount: boolean
  validatedPrice: number
  taxFees: number
  totalAmount: number
  targetIdentifier: string
  expiresAt: string
  metadata: Record<string, any> | null
}

// Handler

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { subscriptionPlanId, targetIdentifier, amount } = cartValidationSchema.parse(body)

    console.warn('[cart/validate] Validating cart for plan:', subscriptionPlanId)

    const adminSupabase = createAdminSupabaseClient()

    // Query the subscription plan joined with biller info
    const { data: plan, error: planError } = await adminSupabase
      .from('subscription_plans')
      .select('id, name, price, service_provider, is_active, metadata, biller_id, billers(slug)')
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

    const metadata = (plan.metadata || {}) as Record<string, any>
    const billerInfo = Array.isArray(plan.billers) ? plan.billers[0] : plan.billers
    const billerSlug = billerInfo?.slug || metadata?.coralpay?.billerSlug || null
    const rawPrice = Number(plan.price)
    const isVariableAmount = rawPrice === 0 || Boolean(metadata?.coralpay?.isVariableAmount)

    let validatedPrice = rawPrice

    if (isVariableAmount) {
      if (amount === undefined || amount === null) {
        return apiResponse.error(
          'An amount is required for this variable-price subscription plan (minimum 50 NGN)',
          400,
        )
      }
      // Sanitize floating point numbers to 2 decimal places
      validatedPrice = Math.round(amount * 100) / 100
    }

    const taxFees = 0 // Digital subscriptions carry zero tax
    const totalAmount = validatedPrice + taxFees
    const expiresAt = new Date(Date.now() + CART_EXPIRY_MS).toISOString()

    const result: CartValidationResult = {
      planId: plan.id,
      planName: plan.name,
      serviceProvider: plan.service_provider,
      billerSlug,
      isVariableAmount,
      validatedPrice,
      taxFees,
      totalAmount,
      targetIdentifier,
      expiresAt,
      metadata: plan.metadata as Record<string, any> | null,
    }

    console.warn('[cart/validate] Validation successful:', {
      plan: plan.name,
      price: validatedPrice,
      isVariableAmount,
      expiresAt,
    })

    return apiResponse.success(result, 'Cart validated successfully')
  }
  catch (error: any) {
    console.error('[cart/validate] Error:', error.message)
    return handleUtilityError(error, 'Failed to validate cart')
  }
})
