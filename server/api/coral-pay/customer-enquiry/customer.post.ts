import { customerLookup } from '#server/utils/coralpay-service'
import { handleUtilityError } from '#server/utils/error-handler'
import { coralPayCustomerLookupPayloadSchema } from '#shared/validations/coralpay.schema'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Validate payload with Zod
    const payload = coralPayCustomerLookupPayloadSchema.parse(body)

    // Delegate to service layer (handles caching + auth)
    const response = await customerLookup(payload)
    return response
  }
  catch (error) {
    return handleUtilityError(error, 'Failed to perform customer lookup')
  }
})
