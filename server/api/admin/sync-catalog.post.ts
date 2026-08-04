import { defineEventHandler } from 'h3'
import { apiResponse } from '#server/utils/api-response'
import { handleUtilityError } from '#server/utils/error-handler'

/**
 * Admin API Endpoint: Manually trigger CoralPay catalog sync task.
 * Automatically guarded by `server/middleware/admin-guard.ts` (requires admin role).
 */
export default defineEventHandler(async () => {
  try {
    console.warn('[admin/sync-catalog] Manual catalog sync triggered by admin user.')

    // Execute Nitro background task
    const syncResult = await runTask('sync-coralpay-catalog')

    return apiResponse.success(
      syncResult,
      'CoralPay catalog sync task completed successfully.',
    )
  }
  catch (error: any) {
    console.error('[admin/sync-catalog] Error executing catalog sync task:', error.message)
    return handleUtilityError(error, 'Failed to execute CoralPay catalog sync task')
  }
})
