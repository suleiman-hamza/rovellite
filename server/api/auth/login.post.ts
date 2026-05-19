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
    }, 'Login successful')
  }
  catch (error: any) {
    return handleUtilityError(error, 'Failed to log in')
  }
})
