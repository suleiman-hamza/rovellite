import { apiResponse } from '#server/utils/api-response'
import { createVirtualAccount } from '#server/utils/create-virtual-account'
import { z } from 'zod'

const createVaSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Validate with Zod
    const { userId } = createVaSchema.parse(body)

    const result = await createVirtualAccount(event, { userId })

    return result
  }
  catch (error: any) {
    // console.error('VA Creation Error:', error)

    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      const message = error.errors?.[0]?.message || 'Validation error'
      return apiResponse.error(
        message,
        400,
        'VALIDATION_ERROR',
      )
    }

    return apiResponse.error(
      'Failed to create virtual account',
      500,
    )
  }
})
