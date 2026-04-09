import { apiResponse } from '#server/utils/api-response'
import { updateVirtualAccountStatus } from '#server/utils/update-virtual-account'
import { z } from 'zod'

const updateVaSchema = z.object({
  virtualAccountNo: z.string().min(1, 'virtualAccountNo is required'),
  status: z.enum(['Enabled', 'Disabled']),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { virtualAccountNo, status } = updateVaSchema.parse(body)

    const result = await updateVirtualAccountStatus(event, { virtualAccountNo, status })

    return result
  }
  catch (error: any) {
    console.error('VA Update Route Error:', error)

    if (error.name === 'ZodError') {
      return apiResponse.error(error.errors[0].message, 400, 'VALIDATION_ERROR')
    }

    return apiResponse.error(
      error.message || 'Failed to update virtual account',
      error.statusCode || 500,
    )
  }
})
