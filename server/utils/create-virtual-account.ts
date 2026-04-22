import type { VirtualAccountCreateResponse } from '../../types/palmpay'
import type { Database } from '../../types/supabase-schema'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { VirtualAccountInsert } from '../../types/supabase'
import { apiResponse } from '#server/utils/api-response'
import { palmPayRequest } from '#server/utils/palmpay-client'
import { handleUtilityError } from '#server/utils/utils-error-handler'

export async function createVirtualAccount(supabase: SupabaseClient<Database>, input: { userId: string }) {
  const { userId } = input

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'userId is required',
    })
  }

  try {
    // Fetch user data from users table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('user_id', userId)
      .single()

    if (profileError || !profile) {
      return apiResponse.error('User profile not found', 404)
    }

    // Check if user already has a virtual account (duplicate prevention)
    const { data: existing } = await supabase
      .from('virtual_accounts')
      .select('virtual_account_no')
      .eq('user_id', userId)
      .maybeSingle()

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

    const vaInsert: VirtualAccountInsert = {
      user_id: userId,
      provider: 'palmpay',
      virtual_account_no: vaData.virtualAccountNo,
      virtual_account_name: vaData.virtualAccountName,
      status: vaData.status,
      app_id: vaData.appId || '',
      raw_response: vaData as any,
    }

    // Save to db
    const { error: dbError } = await supabase
      .from('virtual_accounts')
      .insert(vaInsert)

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
    return handleUtilityError(error, 'Internal error while creating virtual account')
  }
}
