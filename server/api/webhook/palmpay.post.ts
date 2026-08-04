import { apiResponse } from '#server/utils/api-response'
import { handleUtilityError } from '#server/utils/error-handler'
import { verifyPalmpaySignature } from '#server/utils/palmpay/sign'
import { palmpayWebhookSchema } from '#server/utils/palmpay/webhook-schema'
import { createAdminSupabaseClient } from '#server/utils/supabase'
import { processVirtualAccountCredit } from '#server/utils/virtual-account/process-credit'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const config = useRuntimeConfig()
    const { palmpayPublicKey } = config

    if (!palmpayPublicKey) {
      return apiResponse.error('Server configuration error: PalmPay public key missing', 500)
    }

    // Log raw body in development for debugging actual PalmPay payload shape
    // if (process.env.NODE_ENV === 'development' || process.env.NITRO_ENV === 'development') {
    //   console.warn('[PalmPay Webhook] Raw body:', JSON.stringify(body, null, 2))
    // }

    // Signature Verification (uses public key + body.sign field)
    const signatureCheck = verifyPalmpaySignature(event, body, palmpayPublicKey)

    if (!signatureCheck.isValid) {
      // console.warn('[PalmPay Signature] ❌ Verification failed')
      return apiResponse.error(signatureCheck.error ?? 'Invalid signature', 401)
    }

    // console.warn('[PalmPay Signature] ✅ Signature verified successfully')

    // validate payload
    const validated = palmpayWebhookSchema.parse(body)
    const { virtualAccountNo, amount, reference, description, rawPayload } = validated

    // console.warn(`[PalmPay Webhook] Processing credit → VA: ${virtualAccountNo}, Amount: ${amount}, Ref: ${reference}`)

    const adminSupabase = createAdminSupabaseClient()

    const result = await processVirtualAccountCredit(adminSupabase, {
      virtualAccountNo,
      amount,
      reference,
      description,
      metadata: rawPayload,
    })

    if (!result.success) {
      return apiResponse.error(result.message, result.statusCode || 500)
    }

    // console.warn(`[PalmPay Webhook] ✅ Success → Ref: ${reference}, Amount: ${amount}`)

    return apiResponse.success(
      { reference, amount },
      'SUCCESS',
    )
  }
  catch (error: any) {
    return handleUtilityError(error, 'Failed to process webhook')
  }
})
