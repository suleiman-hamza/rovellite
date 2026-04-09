import crypto from 'node:crypto'
import { apiResponse } from '#server/utils/api-response'
import { palmPayRequest } from '#server/utils/palmpay-client'
import { createClient } from '@supabase/supabase-js'

export async function updateVirtualAccountStatus(event: any, input: {
  virtualAccountNo: string
  status: 'Enabled' | 'Disabled'
}) {
  const { virtualAccountNo, status } = input

  try {
    const config = useRuntimeConfig()

    const adminSupabase = createClient(
      config.public.supabaseUrl,
      config.supabaseServiceRoleKey,
    )

    // Check if virtual account exists
    const { data: existing, error: checkError } = await adminSupabase
      .from('virtual_accounts')
      .select('user_id, status, raw_response')
      .eq('virtual_account_no', virtualAccountNo)
      .single()

    if (checkError || !existing) {
      return apiResponse.error('Virtual account not found', 404)
    }

    // Update on PalmPay
    const timestamp = Date.now()
    const nonceStr = crypto.randomBytes(16).toString('hex')

    const payload = {
      requestTime: timestamp,
      version: 'V2.0',
      nonceStr,
      virtualAccountNo,
      status,
    }

    const response = await palmPayRequest(
      '/api/v2/virtual/account/label/update',
      payload,
    )

    if (response.respCode !== '00000000') {
      return apiResponse.error(
        response.respMsg || 'Failed to update status on PalmPay',
        400,
      )
    }

    // Update database (only if PalmPay succeeded)
    const { error: dbError } = await adminSupabase
      .from('virtual_accounts')
      .update({
        status,
        raw_response: existing.raw_response,
        updated_at: new Date().toISOString(),
      })
      .eq('virtual_account_no', virtualAccountNo)

    if (dbError) {
      // console.error('Supabase update error:', dbError)
      return apiResponse.error(
        'Updated on PalmPay but failed to update local database',
        500,
      )
    }

    return apiResponse.success({
      virtualAccountNo,
      newStatus: status,
    }, `Virtual account successfully updated to ${status}`)
  }
  catch (error: any) {
    // console.error('Update VA Status Error:', error)
    return apiResponse.error(
      error.message || 'Failed to update virtual account status',
      error.statusCode || 500,
    )
  }
}
