import type { VirtualAccountCreateResponse } from '../../types/palmpay'
import { apiResponse } from '#server/utils/api-response'
import { palmPayRequest } from '#server/utils/palmpay-client'
import { createClient } from '@supabase/supabase-js'

export async function createVirtualAccount(event: any, input: { userId: string }) {
  const config = useRuntimeConfig()

  const adminSupabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceRoleKey,
  )

  const { userId } = input

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'userId is required',
    })
  }

  try {
    // Fetch user data from users table
    const { data: profile, error: profileError } = await adminSupabase
      .from('profiles')
      .select('full_name, email')
      .eq('user_id', userId)
      .single()

    if (profileError || !profile) {
      return apiResponse.error('User profile not found', 404)
    }

    // Check if user already has a virtual account (duplicate prevention)
    const { data: existing } = await adminSupabase
      .from('virtual_accounts')
      .select('virtual_account_no')
      .eq('user_id', userId)
      .single()

    if (existing) {
      return apiResponse.error(
        `User already has a virtual account: ${existing.virtual_account_no}`,
        409,
        'DUPLICATE_ACCOUNT',
      )
    }

    // PalmPay payload using user data
    const timestamp = Date.now()
    const palmpayPayload = {
      customerName: profile.full_name || 'Unknown User',
      email: profile.email || 'noemail@example.com',
      virtualAccountName: `RovelSubPoint-${profile.full_name || 'User'}-${timestamp}`,
      identityType: 'company',
      licenseNumber: 'dasd141234114123',
    }

    // Call PalmPay
    const response = await palmPayRequest<VirtualAccountCreateResponse>(
      '/api/v2/virtual/account/label/create',
      palmpayPayload,
    )

    if (response.respCode !== '00000000') {
      return apiResponse.error(
        response.respMsg || 'PalmPay virtual account creation failed',
        400,
      )
    }

    const vaData = response.data

    // Save to db
    const { error: dbError } = await adminSupabase
      .from('virtual_accounts')
      .insert({
        user_id: userId,
        provider: 'palmpay',
        virtual_account_no: vaData.virtualAccountNo,
        virtual_account_name: vaData.virtualAccountName,
        status: vaData.status,
        app_id: vaData.appId,
        raw_response: vaData,
      })

    if (dbError) {
      console.error('Supabase insert error:', dbError)
      return apiResponse.error('Failed to save virtual account in database', 500)
    }

    return apiResponse.success({
      virtualAccountNo: vaData.virtualAccountNo,
      virtualAccountName: vaData.virtualAccountName,
      status: vaData.status,
    }, 'Virtual Account created successfully')
  }
  catch (error: any) {
    // console.error('createVirtualAccount Error:', error)
    return apiResponse.error(
      error.message || 'Internal error while creating virtual account',
      500,
    )
  }
}
