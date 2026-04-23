import type { VirtualAccountUpdatePayload } from '../../types/palmpay'
import type { Database } from '../../types/supabase-schema'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { VirtualAccountUpdate } from '../../types/supabase'
import { apiResponse } from '#server/utils/api-response'
import { palmPayRequest } from '#server/utils/palmpay-client'
import { handleUtilityError } from '~~/server/utils/error-handler'

export async function updateVirtualAccountStatus(supabase: SupabaseClient<Database>, input: {
  virtualAccountNo: string
  status: 'Enabled' | 'Disabled'
}) {
  const { virtualAccountNo, status } = input

  try {
    // Check if virtual account exists
    const { data: existing, error: checkError } = await supabase
      .from('virtual_accounts')
      .select('user_id, status, raw_response')
      .eq('virtual_account_no', virtualAccountNo)
      .single()

    if (checkError || !existing) {
      return apiResponse.error('Virtual account not found', 404)
    }

    // Update on PalmPay — nonceStr/requestTime/version handled by palmPayRequest
    const payload: VirtualAccountUpdatePayload = {
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

    const vaUpdate: VirtualAccountUpdate = {
      status,
      raw_response: existing.raw_response as any, // Preserve existing raw_response or update if needed
      updated_at: new Date().toISOString(),
    }

    // Update database (only if PalmPay succeeded)
    const { error: dbError } = await supabase
      .from('virtual_accounts')
      .update(vaUpdate)
      .eq('virtual_account_no', virtualAccountNo)

    if (dbError) {
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
    return handleUtilityError(error, 'Failed to update virtual account status')
  }
}
