import type { SubscriptionPlanResponse, SubscriptionPlanRow } from '#server/utils/plan-helpers'
import { createError, defineEventHandler, getQuery } from 'h3'
import { z } from 'zod'
import { apiResponse } from '#server/utils/api-response'
import { handleUtilityError } from '#server/utils/error-handler'
import {

  transformPlan,
} from '#server/utils/plan-helpers'
import { CACHE_TTL, cacheKeys, getOrSet } from '#server/utils/redis-cache'
import { createAdminSupabaseClient } from '#server/utils/supabase'

// Query Schema

const subscriptionPlansQuerySchema = z.object({
  category: z.string().trim().optional(),
  biller: z.string().trim().optional(),
  service_provider: z.enum(['CORALPAY', 'SOCHITEL']).optional(),
})

type PlansQuery = z.infer<typeof subscriptionPlansQuerySchema>

// DB Helper
/**
 * Builds and executes the Supabase query with dynamic join type and filters.
 * Uses inner join only when filtering on biller fields — avoids NULL rows
 * being dropped unintentionally on a plain left join.
 */
async function fetchPlans(
  adminSupabase: ReturnType<typeof createAdminSupabaseClient>,
  query: PlansQuery,
): Promise<SubscriptionPlanRow[]> {
  const useInnerJoin = Boolean(query.category || query.biller)
  const selectClause = useInnerJoin
    ? 'id, name, slug, price, service_provider, is_active, metadata, biller_id, billers!inner(slug, category)'
    : 'id, name, slug, price, service_provider, is_active, metadata, biller_id, billers(slug, category)'

  let queryBuilder = adminSupabase
    .from('subscription_plans')
    .select(selectClause)
    .eq('is_active', true)

  if (query.service_provider) {
    queryBuilder = queryBuilder.eq('service_provider', query.service_provider)
  }

  if (query.category) {
    queryBuilder = queryBuilder.eq('billers.category', query.category)
  }

  if (query.biller) {
    const isUuid = z.string().uuid().safeParse(query.biller).success
    queryBuilder = isUuid
      ? queryBuilder.eq('biller_id', query.biller)
      : queryBuilder.eq('billers.slug', query.biller)
  }

  const { data: plans, error: fetchError } = await queryBuilder.order('name', { ascending: true })

  if (fetchError) {
    console.error('[subscription-plans] DB Error fetching plans:', fetchError.message)
    throw createError({ statusCode: 500, message: 'Failed to retrieve subscription plans' })
  }

  return (plans ?? []) as SubscriptionPlanRow[]
}

// Handler

export default defineEventHandler(async (event) => {
  try {
    const rawQuery = getQuery(event)
    const query = subscriptionPlansQuerySchema.parse(rawQuery)

    const cacheKey = cacheKeys.subscriptionPlans(
      `cat=${query.category || 'all'}:biller=${query.biller || 'all'}:sp=${query.service_provider || 'all'}`,
    )

    const plans = await getOrSet<SubscriptionPlanResponse[]>(
      cacheKey,
      async () => {
        const adminSupabase = createAdminSupabaseClient()
        const rows = await fetchPlans(adminSupabase, query)
        return rows.map(transformPlan) // single shared transform, not inline
      },
      CACHE_TTL.SUBSCRIPTION_PLANS,
    )

    return apiResponse.success(plans, 'Subscription plans retrieved successfully')
  }
  catch (error: any) {
    // console.error('[subscription-plans] Error:', error.message)
    return handleUtilityError(error, 'Failed to fetch subscription plans')
  }
})
