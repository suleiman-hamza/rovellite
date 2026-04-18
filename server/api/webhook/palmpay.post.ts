import { apiResponse } from '#server/utils/api-response'
import { verifyPalmpaySignature } from '#server/utils/palmpay-sign'
import { palmpayWebhookSchema } from '#server/utils/palmpay-webhook-schema'
import { processVirtualAccountCredit } from '#server/utils/process-virtual-account-credit'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const config = useRuntimeConfig()
    const { palmpayPrivateKey } = config

    if (!palmpayPrivateKey) {
      // console.error('PalmPay private key is not configured')
      return apiResponse.error('Server configuration error', 500)
    }

    // Signature Verification
    const signatureCheck = verifyPalmpaySignature(event, body, palmpayPrivateKey)

    if (!signatureCheck.isValid) {
      // console.error('[PalmPay Webhook] Invalid signature received')
      return apiResponse.error(signatureCheck.error ?? 'Invalid signature', 401)
    }

    // validate payload
    const validated = palmpayWebhookSchema.parse(body)
    const { data } = validated

    const virtualAccountNo = data.virtualAccountNo
    const amountNum = data.amount
    const reference = validated.reference
    const description = validated.description

    const result = await processVirtualAccountCredit({
      virtualAccountNo,
      amount: amountNum,
      reference,
      description,
      metadata: data,
    })

    if (!result.success) {
      // console.error(`[PalmPay Webhook] Processing failed for reference: ${reference} - ${result.message}`)
      return apiResponse.error(result.message, result.statusCode)
    }

    return apiResponse.success(
      { reference, amount: amountNum },
      'SUCCESS',
    )
  }
  catch {
    // console.error('PalmPay Webhook Error:', error)
    return apiResponse.error('Internal server error processing webhook', 500)
  }
})
