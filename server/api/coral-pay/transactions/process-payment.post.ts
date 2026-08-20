import { apiResponse } from '#server/utils/api-response'
import { verifyAuthToken } from '#server/utils/auth-verifier'
import { processPayment } from '#server/utils/coralpay-service'
import { handleUtilityError } from '#server/utils/error-handler'
import { coralPayProcessPaymentPayloadSchema } from '#shared/validations/coralpay.schema'

export default defineEventHandler(async (event) => {
  try {
    const authUid
      = event.context.user?.uid
        || (await verifyAuthToken(event)).decodedToken.uid

    if (!authUid) {
      return apiResponse.error('Authentication is required to process payment', 401)
    }

    const body = await readBody(event)

    // Validate payload with Zod
    const payload = coralPayProcessPaymentPayloadSchema.parse(body)

    // console.warn('🔍 [CoralPay Proxy] Incoming payload:', JSON.stringify(payload, null, 2))

    // Delegate to service layer (handles auth + ISO 8583 response)
    const response = await processPayment(payload)

    // console.warn('✅ [CoralPay Proxy] Response:', {
    //   responseCode: response.responseCode,
    //   error: response.error,
    // })

    return response
  }
  catch (error: any) {
    // console.error('❌ [CoralPay Proxy] Error:', error.message)
    return handleUtilityError(error, 'Failed to process payment via CoralPay')
  }
})
