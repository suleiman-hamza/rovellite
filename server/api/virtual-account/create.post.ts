import { apiResponse } from '#server/utils/api-response'
import { createVirtualAccount } from '#server/utils/create-virtual-account'
import { z } from 'zod'

const createVaSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    console.warn('Create VA Request Body:', body)

    // Validate with Zod
    const { userId } = createVaSchema.parse(body)

    const result = await createVirtualAccount(event, { userId })

    return result
  }
  catch (error: any) {
    console.error('VA Creation Error:', error)

    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      return apiResponse.error(
        error.errors[0].message,
        400,
        'VALIDATION_ERROR',
      )
    }

    return apiResponse.error(
      error.message || 'Failed to create virtual account',
      error.statusCode || 500,
    )
  }
})
