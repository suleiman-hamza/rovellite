import { apiResponse, isSuccessResponse } from '#server/utils/api-response'
import { queryPalmPayVirtualAccount } from '#server/utils/virtual-account/query'
import { z } from 'zod'

const queryVaSchema = z.object({
  virtualAccountNo: z.string().min(1, 'virtualAccountNo is required'),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Validate input
    const { virtualAccountNo } = queryVaSchema.parse(body)

    // Query PalmPay
    const queryResult = await queryPalmPayVirtualAccount(virtualAccountNo)

    // Proper type narrowing
    if (!isSuccessResponse(queryResult)) {
      return queryResult // Return the error response directly
    }

    // Return standardized response
    return apiResponse.success(
      queryResult.data,
      'Virtual account details retrieved successfully',
    )
  }
  catch (error: any) {
    // console.error('VA Query Error:', error)

    if (error.name === 'ZodError') {
      const message = error.errors?.[0]?.message || 'Validation error'
      return apiResponse.error(message, 400, 'VALIDATION_ERROR',
      )
    }

    return apiResponse.error('Failed to query virtual account', 500)
  }
})
