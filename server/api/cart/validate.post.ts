import type { PlanMetadata } from '#server/utils/plan-helpers'
import { createError, defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import { apiResponse } from '#server/utils/api-response'
import { verifyAuthToken } from '#server/utils/auth-verifier'
import { handleUtilityError } from '#server/utils/error-handler'
import {
  extractBillerInfo,
  isVariableAmountPlan,
  resolveBillerSlug,
  safePrice,
} from '#server/utils/plan-helpers'
import { CACHE_TTL, cacheKeys, getOrSet } from '#server/utils/redis-cache'
import { createAdminSupabaseClient } from '#server/utils/supabase'

// Schema

const cartValidationSchema = z.object({
  subscriptionPlanId: z.string().uuid({ message: 'Invalid subscription plan ID format' }),
  targetIdentifier: z.string().min(1, { error: 'Target identifier is required (e.g. phone number)' }),
  amount: z
    .number()
    .min(50, { error: 'Subscription amount must be at least 50 NGN' })
    .optional(),
})

// Constants

/** 20 minutes — matches CACHE_TTL.CART_VALIDATION */
const CART_EXPIRY_MS = 20 * 60 * 1000

// Response Type

// NOTE: metadata is intentionally excluded — internal vendor config must not reach the client
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
  expiresAt: string // computed fresh — NOT cached (see handler)
}

// Cached shape excludes expiresAt — it's derived fresh per response
type CachedCartData = Omit<CartValidationResult, 'expiresAt'>

// DB Helper

/**
 * Fetches and validates a subscription plan.
 * Throws 500 on DB error, 404 if not found, 400 if inactive.
 */
async function fetchValidPlan(
  adminSupabase: ReturnType<typeof createAdminSupabaseClient>,
  planId: string,
) {
  const { data: plan, error: planError } = await adminSupabase
    .from('subscription_plans')
    .select('id, name, price, service_provider, is_active, metadata, biller_id, billers(slug)')
    .eq('id', planId)
    .single()

  if (planError) {
    console.error('[cart-validation] DB Error fetching plan:', planError.message)
    throw createError({ statusCode: 500, message: 'Failed to retrieve subscription plan' })
  }

  if (!plan) {
    throw createError({ statusCode: 404, message: 'Subscription plan not found' })
  }

  if (!plan.is_active) {
    throw createError({ statusCode: 400, message: 'This subscription plan is currently unavailable' })
  }

  return plan
}

// Pricing Helper

/**
 * Resolves the validated price for fixed and variable plans.
 * Throws 400 if variable plan is missing a user-supplied amount.
 */
function resolvePrice(rawPrice: number, isVariable: boolean, amount: number | undefined): number {
  if (!isVariable)
    return rawPrice

  if (amount === undefined || amount === null) {
    throw createError({
      statusCode: 400,
      message: 'An amount is required for this variable-price subscription plan (minimum 50 NGN)',
    })
  }

  // Sanitize floating point to 2 decimal places
  return Math.round(amount * 100) / 100
}

// Handler

export default defineEventHandler(async (event) => {
  try {
    // Authenticate user via session context or Bearer token
    const userId
      = event.context.user?.uid
        || (await verifyAuthToken(event)).decodedToken.uid

    if (!userId) {
      return apiResponse.error('Authentication is required for cart validation', 401)
    }

    const body = await readBody(event)
    const { subscriptionPlanId, targetIdentifier, amount } = cartValidationSchema.parse(body)

    const cacheKey = cacheKeys.cartValidation(subscriptionPlanId, targetIdentifier, amount)

    // Cache the computed plan data — but NOT expiresAt (it must be fresh per response)
    const cached = await getOrSet<CachedCartData>(
      cacheKey,
      async () => {
        const adminSupabase = createAdminSupabaseClient()
        const plan = await fetchValidPlan(adminSupabase, subscriptionPlanId)

        const metadata = (plan.metadata ?? {}) as PlanMetadata
        const billerInfo = extractBillerInfo(plan.billers as any)
        const billerSlug = resolveBillerSlug(billerInfo, metadata)
        const rawPrice = safePrice(plan.price)
        const isVariableAmount = isVariableAmountPlan(rawPrice, metadata)
        const validatedPrice = resolvePrice(rawPrice, isVariableAmount, amount)

        const taxFees = 0 // Digital subscriptions carry zero tax
        const totalAmount = validatedPrice + taxFees

        return {
          planId: plan.id,
          planName: plan.name,
          serviceProvider: plan.service_provider,
          billerSlug,
          isVariableAmount,
          validatedPrice,
          taxFees,
          totalAmount,
          targetIdentifier,
          // metadata deliberately excluded — internal vendor config not sent to client
        }
      },
      CACHE_TTL.CART_VALIDATION,
    )

    // expiresAt computed fresh — NOT from cache (avoids stale expiry timestamp)
    const result: CartValidationResult = {
      ...cached,
      expiresAt: new Date(Date.now() + CART_EXPIRY_MS).toISOString(),
    }

    return apiResponse.success(result, 'Cart validated successfully')
  }
  catch (error: any) {
    return handleUtilityError(error, 'Failed to validate cart')
  }
})
