import type { VirtualAccountQueryResponse } from '../../types/palmpay'
import crypto from 'node:crypto'
import { apiResponse } from '#server/utils/api-response'
import { palmPayRequest } from '#server/utils/palmpay-client'
import { handleUtilityError } from '#server/utils/utils-error-handler'
import { z } from 'zod'

const querySchema = z.object({
  virtualAccountNo: z.string().min(1, 'virtualAccountNo is required'),
})

export async function queryPalmPayVirtualAccount(virtualAccountNo: string) {
  try {
    const { virtualAccountNo: validatedNo } = querySchema.parse({ virtualAccountNo })

    const timestamp = Date.now()
    const nonceStr = crypto.randomBytes(16).toString('hex')

    const payload = {
      requestTime: timestamp,
      version: 'V2.0',
      nonceStr,
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
