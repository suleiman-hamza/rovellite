import admin from 'firebase-admin'
import {
  defineEventHandler,
  setCookie,
} from 'h3'
import { verifyAuthToken } from '~~/server/utils/auth-verifier'
import { handleUtilityError } from '~~/server/utils/error-handler'
import { apiResponse } from '#server/utils/api-response'
import { createAdminSupabaseClient } from '#server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const adminSupabase = createAdminSupabaseClient()

    // Verify Firebase ID Token with checkRevoked = true
    const { decodedToken, idToken } = await verifyAuthToken(event, true)

    // Ensure email is verified in the token
    if (!decodedToken.email_verified) {
      return apiResponse.error('Email is still not verified. Please check your inbox.', 403)
    }

    // Update Supabase profile verified status
    const { data: profile, error: updateError } = await adminSupabase
      .from('profiles')
      .update({ verified: true })
      .eq('user_id', decodedToken.uid)
      .select('*')
      .single()

    if (updateError || !profile) {
      return apiResponse.error('Failed to update verification status or user not found.', 500)
    }

    // Generate Firebase Session Cookie (14 days)
    const expiresIn = 60 * 60 * 24 * 14 * 1000
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn })

    setCookie(event, '__session', sessionCookie, {
      httpOnly: true,
      secure: !import.meta.dev, // False in local dev, true in production
      sameSite: 'strict',
      maxAge: expiresIn / 1000,
      path: '/',
    })

    return apiResponse.success({
      profile,
    }, 'Email verified and logged in successfully.')
  }
  catch (error: any) {
    console.error('[verify] Error:', error)
    return handleUtilityError(error, 'Failed to process verification')
  }
})
