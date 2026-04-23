import type { VirtualAccountQueryPayload, VirtualAccountQueryResponse } from '../../types/palmpay'
import { apiResponse } from '#server/utils/api-response'
import { palmPayRequest } from '#server/utils/palmpay-client'
import { z } from 'zod'
import { handleUtilityError } from '~~/server/utils/error-handler'

const querySchema = z.object({
  virtualAccountNo: z.string().min(1, 'virtualAccountNo is required'),
})

export async function queryPalmPayVirtualAccount(virtualAccountNo: string) {
  try {
    const { virtualAccountNo: validatedNo } = querySchema.parse({ virtualAccountNo })

    // nonceStr/requestTime/version handled by palmPayRequest
    const payload: VirtualAccountQueryPayload = {
      virtualAccountNo: validatedNo,
    }

    const response = await palmPayRequest<VirtualAccountQueryResponse>(
      '/api/v2/virtual/account/label/queryOne',
      payload,
    )

    if (response.respCode !== '00000000') {
      return apiResponse.error(
        response.respMsg || 'Failed to query virtual account from PalmPay',
        400,
      )
    }

    return apiResponse.success(response.data, 'Virtual account queried successfully')
  }
  catch (error: any) {
    return handleUtilityError(error, 'Failed to query virtual account from PalmPay')
  }
}
