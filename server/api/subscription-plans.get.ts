import { defineEventHandler, getQuery } from 'h3'
import { z } from 'zod'
import { apiResponse } from '#server/utils/api-response'
import { handleUtilityError } from '#server/utils/error-handler'
import { createAdminSupabaseClient } from '#server/utils/supabase'

// Query Filter Validation Schema

const subscriptionPlansQuerySchema = z.object({
  category: z.string().trim().optional(),
  biller: z.string().trim().optional(),
  service_provider: z.enum(['CORALPAY', 'SOCHITEL']).optional(),
})

export default defineEventHandler(async (event) => {
  try {
    const rawQuery = getQuery(event)
    const query = subscriptionPlansQuerySchema.parse(rawQuery)

    const adminSupabase = createAdminSupabaseClient()

    // Determine whether to use an inner join for filtering on biller fields
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
      const isUuid = z.uuid().safeParse(query.biller).success
      if (isUuid) {
        queryBuilder = queryBuilder.eq('biller_id', query.biller)
      }
      else {
        queryBuilder = queryBuilder.eq('billers.slug', query.biller)
      }
    }

    const { data: plans, error: fetchError } = await queryBuilder.order('name', { ascending: true })

    if (fetchError) {
      console.error('[subscription-plans] DB Error fetching plans:', fetchError.message)
      return apiResponse.error('Failed to retrieve subscription plans', 500)
    }

    // Transform raw DB rows into clean client-facing response payload
    const transformedPlans = (plans || []).map((plan: any) => {
      const billerInfo = Array.isArray(plan.billers) ? plan.billers[0] : plan.billers
      const metadata = (plan.metadata || {}) as Record<string, any>

      const price = Number(plan.price)
      const isVariableAmount = price === 0 || Boolean(metadata?.coralpay?.isVariableAmount)
      const billerSlug = billerInfo?.slug || metadata?.coralpay?.billerSlug || null

      return {
        id: plan.id,
        name: plan.name,
        slug: plan.slug,
        price,
        isVariableAmount,
        serviceProvider: plan.service_provider,
        billerSlug,
        metadata: plan.metadata,
      }
    })

    return apiResponse.success(transformedPlans, 'Subscription plans retrieved successfully')
  }
  catch (error: any) {
    console.error('[subscription-plans] Error:', error.message)
    return handleUtilityError(error, 'Failed to fetch subscription plans')
  }
})
