import { apiResponse } from '#server/utils/api-response'
import { verifyAuthToken } from '#server/utils/auth-verifier'
import { paymentLookup } from '#server/utils/coralpay-service'
import { handleUtilityError } from '#server/utils/error-handler'

export default defineEventHandler(async (event) => {
  try {
    const authUid
      = event.context.user?.uid
        || (await verifyAuthToken(event)).decodedToken.uid

    if (!authUid) {
      return apiResponse.error('Authentication is required to perform payment lookup', 401)
    }

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
