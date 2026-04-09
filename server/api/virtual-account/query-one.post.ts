import { apiResponse, isSuccessResponse } from '#server/utils/api-response'
import { queryPalmPayVirtualAccount } from '#server/utils/query-virtual-account'
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
      return apiResponse.error(
        error.errors[0].message,
        400,
        'VALIDATION_ERROR',
      )
    }

    return apiResponse.error(
      error.message || 'Failed to query virtual account',
      error.statusCode || 500,
    )
  }
})
