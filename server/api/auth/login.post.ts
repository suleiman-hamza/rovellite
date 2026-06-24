import type { Database } from '~~/types/supabase-schema'
import { getAuth } from 'firebase-admin/auth'
import { defineEventHandler } from 'h3'
import { verifyAuthToken } from '~~/server/utils/auth-verifier'
import { handleUtilityError } from '~~/server/utils/error-handler'
import { createAndSetFirebaseSessionCookie } from '~~/server/utils/session'
import { apiResponse } from '#server/utils/api-response'
import { createAdminSupabaseClient } from '#server/utils/supabase'

type UserRole = Database['public']['Enums']['user_role']

export default defineEventHandler(async (event) => {
  try {
    const adminSupabase = createAdminSupabaseClient()

    // Verify Firebase ID Token
    const { decodedToken, idToken } = await verifyAuthToken(event)

    // Ensure email is verified
    if (!decodedToken.email_verified) {
      return apiResponse.error('Email not verified. Please verify your email to log in.', 403)
    }

    // Check if user profile exists
    const { data: profile, error: profileError } = await adminSupabase
      .from('profiles')
      .select('*')
      .eq('user_id', decodedToken.uid)
      .single()

    if (profileError || !profile) {
      return apiResponse.error('User profile not found. Please sign up first.', 404)
    }

    // Auto-sync verification status for cross-device flows
    // If the token says verified, but DB is false (e.g., verified on phone, logging in on desktop)
    if (!profile.verified && decodedToken.email_verified) {
      const { error: syncError } = await adminSupabase
        .from('profiles')
        .update({ verified: true })
        .eq('user_id', decodedToken.uid)

      if (!syncError) {
        profile.verified = true
      }
    }

    // Sync Supabase Role to Firebase Custom Claims
    const currentClaimRole = decodedToken.role as UserRole | undefined
    const actualDbRole: UserRole = profile.role
    let claimsUpdated: boolean = false

    if (currentClaimRole !== actualDbRole) {
      // Inject the database role into the Firebase JWT
      await getAuth().setCustomUserClaims(decodedToken.uid, { role: actualDbRole })
      claimsUpdated = true
    }

    // Generate/mint and set Firebase Session Cookie
    await createAndSetFirebaseSessionCookie(event, idToken)

    return apiResponse.success({
      profile,
      role: actualDbRole,
      claimsUpdated,
    }, 'Login successful')
  }
  catch (error: any) {
    return handleUtilityError(error, 'Failed to log in')
  }
})
