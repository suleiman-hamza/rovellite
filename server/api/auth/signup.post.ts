import admin from 'firebase-admin'
import {
  defineEventHandler,
  readBody,
} from 'h3'
import { handleUtilityError } from '~~/server/utils/error-handler'
import { signupSchema } from '~~/shared/validations/auth'
import { apiResponse } from '#server/utils/api-response'
import { generateInviteCode } from '#server/utils/invite-code'
import { createAdminSupabaseClient } from '#server/utils/supabase'

export default defineEventHandler(async (event) => {
  try {
    const adminSupabase = createAdminSupabaseClient()

    // Read and validate body against shared schema
    const rawBody = await readBody(event)
    const body = signupSchema.parse(rawBody || {})

    // Generate the code
    const inviteCode = generateInviteCode(body.full_name)

    // Create User in Firebase
    const userRecord = await admin.auth().createUser({
      email: body.email,
      password: body.password,
      displayName: body.full_name,
      phoneNumber: body.phone, // Firebase expects phone to be in E.164 format (e.g. +1234567890)
    })

    // Create Profile and Wallet in Supabase
    const { data: profile, error: rpcError } = await adminSupabase.rpc('sync_profile_with_wallet', {
      p_user_id: userRecord.uid,
      p_email: userRecord.email!,
      p_full_name: body.full_name,
      p_avatar_url: undefined,
      p_phone: body.phone,
      p_bio: undefined,
      p_location: body.location,
      p_role: 'user',
      p_verified: false,
      p_used_invite_code: body.referralCode || null,
      p_invite_code: inviteCode,
      p_wallet_balance: 0,
      p_wallet_currency: 'NGN',
      p_wallet_status: 'active',
    })

    if (rpcError) {
      // Rollback Firebase user creation if DB fails
      await admin.auth().deleteUser(userRecord.uid)
      return apiResponse.error(rpcError.message, 500)
    }

    // Trigger Firebase's native verification email via REST API
    // Since Admin SDK doesn't send emails, sign in the user via REST to get an idToken, then send the email.
    try {
      const config = useRuntimeConfig()
      const apiKey = config.public.firebase.apiKey

      //  Sign in to get the idToken for the newly created user
      const signInRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: body.email,
          password: body.password,
          returnSecureToken: true,
        }),
      })
      const signInData = await signInRes.json()

      if (signInData.idToken) {
        // Send the verification email using the idToken
        await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requestType: 'VERIFY_EMAIL',
            idToken: signInData.idToken,
          }),
        })
      }
    }
    catch {
      // console.error('[signup] Failed to trigger verification email:', emailError)
      // Don't fail the whole request if the email sending fails, the user is still created.
      return apiResponse.error('User created successfully. Please verify your email to login.', 201)
    }

    return apiResponse.success({
      profile,
    }, 'Signup successful. Please check your email to verify your account.')
  }
  catch (error: any) {
    // console.error('[signup] Error:', error)
    return handleUtilityError(error, 'Failed to process signup')
  }
})
