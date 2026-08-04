import { paymentLookup } from '#server/utils/coralpay-service'
import { handleUtilityError } from '#server/utils/error-handler'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)

    // Delegate to service layer (handles auth + Zod validation)
    const response = await paymentLookup({
      paymentReference: query.paymentReference ? String(query.paymentReference) : undefined,
      transactionId: query.transactionId ? String(query.transactionId) : undefined,
    })

    return response
  }
  catch (error) {
    return handleUtilityError(error, 'Failed to look up payment status')
  }
})
