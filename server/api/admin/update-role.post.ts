import type { Database } from '~~/types/supabase-schema'
import { getAuth } from 'firebase-admin/auth'
import { defineEventHandler, readBody } from 'h3'
import { apiResponse } from '#server/utils/api-response'
import { handleUtilityError } from '#server/utils/error-handler'
import { createAdminSupabaseClient } from '#server/utils/supabase'

type UserRole = Database['public']['Enums']['user_role']

export default defineEventHandler(async (event) => {
  // Parse the target user and the new role from the request body
  const { targetUserId, newRole } = await readBody<{ targetUserId: string, newRole: UserRole }>(event)

  if (!targetUserId || !newRole) {
    return apiResponse.error('Invalid request: targetUserId and newRole are required.', 400)
  }

  try {
    const adminSupabase = createAdminSupabaseClient()

    // Update the Single Source of Truth (Supabase)
    const { error: dbError } = await adminSupabase
      .from('profiles')
      .update({ role: newRole })
      .eq('user_id', targetUserId)

    if (dbError)
      return apiResponse.error(`Database update failed: ${dbError.message}`, 500)

    // Update Firebase Custom Claims immediately
    const firebaseAuth = getAuth()
    await firebaseAuth.setCustomUserClaims(targetUserId, { role: newRole })

    // Revoke the target user's active sessions
    // This invalidates their current session cookie globally
    await firebaseAuth.revokeRefreshTokens(targetUserId)

    return apiResponse.success({ targetUserId, updatedRole: newRole }, `Successfully updated user role to ${newRole} and revoked active sessions.`,
    )
  }
  catch (error: any) {
    return handleUtilityError(error, 'Error updating user role')
  }
})
