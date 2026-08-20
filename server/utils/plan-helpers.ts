// Shared Plan Utilities
// Used by: subscription-plans.get.ts, cart-validation.post.ts
// Any route that touches subscription_plans + billers should import from here.

// Interfaces

export interface PlanMetadata {
  coralpay?: {
    packageSlug?: string
    billerSlug?: string
    isVariableAmount?: boolean
  }
  [key: string]: unknown
}

export interface BillerInfo {
  slug: string | null
  category?: string | null
}

export interface SubscriptionPlanRow {
  id: string
  name: string
  slug: string
  price: number | string | null
  service_provider: string
  is_active: boolean
  metadata: PlanMetadata | null
  biller_id: string | null
  billers: BillerInfo | BillerInfo[] | null
}

export interface SubscriptionPlanResponse {
  id: string
  name: string
  slug: string
  price: number
  isVariableAmount: boolean
  serviceProvider: string
  billerSlug: string | null
  // metadata intentionally excluded — internal vendor config not sent to client
}

// Helpers

/**
 * Safely extracts biller info from a Supabase join result.
 * Supabase can return the relation as an array or a single object
 * depending on the join type — this normalises both cases.
 */
export function extractBillerInfo(billers: BillerInfo | BillerInfo[] | null): BillerInfo | null {
  return Array.isArray(billers) ? (billers[0] ?? null) : billers
}

/**
 * Resolves the biller slug from join data, falling back to metadata.
 * CoralPay stores billerSlug in plan metadata as a secondary source.
 */
export function resolveBillerSlug(billerInfo: BillerInfo | null, metadata: PlanMetadata): string | null {
  return billerInfo?.slug || metadata?.coralpay?.billerSlug || null
}

/**
 * Determines if a plan uses variable (user-entered) pricing.
 * A price of 0 in the DB signals variable amount, as does the explicit metadata flag.
 */
export function isVariableAmountPlan(rawPrice: number, metadata: PlanMetadata): boolean {
  return rawPrice === 0 || Boolean(metadata?.coralpay?.isVariableAmount)
}

/**
 * Safely coerces a DB price value to a number.
 * Guards against NaN when price is null or a non-numeric string.
 */
export function safePrice(value: unknown): number {
  const n = Number(value)
  return Number.isNaN(n) ? 0 : n
}

/**
 * Transforms a raw DB subscription plan row into a clean client-facing shape.
 * Single source of truth for plan serialisation — used by listing and detail routes.
 */
export function transformPlan(plan: SubscriptionPlanRow): SubscriptionPlanResponse {
  const metadata = (plan.metadata ?? {}) as PlanMetadata
  const billerInfo = extractBillerInfo(plan.billers)
  const billerSlug = resolveBillerSlug(billerInfo, metadata)
  const price = safePrice(plan.price)
  const isVariableAmount = isVariableAmountPlan(price, metadata)

  return {
    id: plan.id,
    name: plan.name,
    slug: plan.slug,
    price,
    isVariableAmount,
    serviceProvider: plan.service_provider,
    billerSlug,
  }
}
