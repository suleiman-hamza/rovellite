import type { BillerInsert, SubscriptionPlanInsert } from '~~/types/supabase'
import { z } from 'zod'
import { getBillersByGroupId, getPackagesByBillerSlug } from '#server/utils/coralpay-service'
import { createAdminSupabaseClient } from '#server/utils/supabase'
import { generateDeterministicUuid } from '#server/utils/uuid-utils'

// Zod Validation for Catalog Groups Configuration
const groupConfigSchema = z.object({
  id: z.number().int().positive('Group ID must be a positive integer'),
  slug: z.string().min(1, 'Group slug is required'),
  category: z.string().min(1, 'Category is required'),
})

const groupsToSyncConfigSchema = z.array(groupConfigSchema)

// Target Biller Groups to Sync
const GROUPS_TO_SYNC = [
  { id: 1, slug: 'ELECTRIC_DISCOS', category: 'electricity' },
  { id: 2, slug: 'PAY_TV', category: 'paytv' },
  // Add more groups later as needed:
  // { id: 3, slug: 'AIRTIME', category: 'airtime' },
  // { id: 4, slug: 'DATA', category: 'data' },
]

/**
 * Background Task: Syncs CoralPay billers + packages into local `billers`
 * and `subscription_plans` tables.
 *
 * - Idempotent (safe to run repeatedly)
 * - Uses deterministic UUID v5 so plan IDs never change across syncs
 */
export default defineTask({
  meta: {
    name: 'sync-coralpay-catalog',
    description: 'Pull billers and packages from CoralPay into the database',
  },
  async run() {
    const supabase = createAdminSupabaseClient()
    const startTime = Date.now()

    console.warn('[sync-coralpay] Starting catalog sync...')

    // Validate configuration
    const groups = groupsToSyncConfigSchema.parse(GROUPS_TO_SYNC)

    let totalBillers = 0
    let totalPackages = 0
    const errors: string[] = []

    for (const group of groups) {
      console.warn(`[sync-coralpay] Fetching billers for group ${group.slug} (id: ${group.id})...`)

      try {
        const billers = await getBillersByGroupId(group.id)

        if (!billers || billers.length === 0) {
          console.warn(`[sync-coralpay] No billers found for group ${group.slug}`)
          continue
        }

        for (const biller of billers) {
          const billerSlug = biller.slug.toLowerCase()

          // Stable deterministic UUID for the biller
          const billerId = generateDeterministicUuid(`coralpay:biller:${billerSlug}`)

          const billerPayload: BillerInsert = {
            id: billerId,
            coralpay_biller_id: biller.id,
            name: biller.name,
            slug: billerSlug,
            group_slug: group.slug,
            category: group.category,
            is_active: true,
            updated_at: new Date().toISOString(),
          }

          const { error: billerError } = await supabase
            .from('billers')
            .upsert(billerPayload, { onConflict: 'slug' })

          if (billerError) {
            const errMsg = `Failed to upsert biller "${billerSlug}": ${billerError.message}`
            console.error(`[sync-coralpay] ${errMsg}`)
            errors.push(errMsg)
            continue
          }

          totalBillers++

          // Packages
          try {
            const packages = await getPackagesByBillerSlug(biller.slug)

            if (!packages || packages.length === 0) {
              console.warn(`[sync-coralpay] No packages found for biller "${billerSlug}"`)
              continue
            }

            for (const pkg of packages) {
              const packageSlug = pkg.slug.toLowerCase()
              const amount = pkg.amount ?? 0
              const isVariableAmount = amount === 0

              // Safest deterministic namespace (includes both biller + package)
              const planId = generateDeterministicUuid(
                `coralpay:package:${billerSlug}:${packageSlug}`,
              )

              const planPayload: SubscriptionPlanInsert = {
                id: planId,
                name: pkg.name,
                slug: packageSlug, // useful for lookups
                price: amount,
                service_provider: 'CORALPAY',
                biller_id: billerId,
                is_active: true,
                metadata: {
                  coralpay: {
                    packageId: pkg.id,
                    packageSlug,
                    billerSlug,
                    billerId: biller.id,
                    isVariableAmount,
                  },
                },
                updated_at: new Date().toISOString(),
              }

              const { error: planError } = await supabase
                .from('subscription_plans')
                .upsert(planPayload, { onConflict: 'id' })

              if (planError) {
                const errMsg = `Failed to upsert plan "${packageSlug}": ${planError.message}`
                console.error(`[sync-coralpay] ${errMsg}`)
                errors.push(errMsg)
                continue
              }

              totalPackages++
            }
          }
          catch (pkgFetchErr: any) {
            const errMsg = `Error fetching packages for biller "${billerSlug}": ${pkgFetchErr.message}`
            console.error(`[sync-coralpay] ${errMsg}`)
            errors.push(errMsg)
          }
        }
      }
      catch (groupFetchErr: any) {
        const errMsg = `Error fetching biller group "${group.slug}": ${groupFetchErr.message}`
        console.error(`[sync-coralpay] ${errMsg}`)
        errors.push(errMsg)
      }
    }

    const durationMs = Date.now() - startTime
    console.warn(
      `[sync-coralpay] Catalog sync completed in ${durationMs}ms. `
      + `Synced ${totalBillers} billers and ${totalPackages} packages.`,
    )

    return {
      result: errors.length === 0 ? 'success' : 'partial_success',
      billersSynced: totalBillers,
      packagesSynced: totalPackages,
      durationMs,
      errors: errors.length > 0 ? errors : undefined,
    }
  },
})
