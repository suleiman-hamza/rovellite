import { apiResponse } from '#server/utils/api-response'
import { verifyPalmpaySignature } from '#server/utils/palmpay-sign'
import { palmpayWebhookSchema } from '#server/utils/palmpay-webhook-schema'
import { processVirtualAccountCredit } from '#server/utils/process-virtual-account-credit'
import { createAdminSupabaseClient } from '#server/utils/supabase'
import { handleUtilityError } from '~~/server/utils/error-handler'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const config = useRuntimeConfig()
    const { palmpayPrivateKey } = config

    if (!palmpayPrivateKey) {
      return apiResponse.error('Server configuration error', 500)
    }

    // Signature Verification
    const signatureCheck = verifyPalmpaySignature(event, body, palmpayPrivateKey)

    if (!signatureCheck.isValid) {
      return apiResponse.error(signatureCheck.error ?? 'Invalid signature', 401)
    }

    // validate payload
    const validated = palmpayWebhookSchema.parse(body)
    const { data } = validated

    const virtualAccountNo = data.virtualAccountNo
    const amountNum = data.amount
    const reference = validated.reference
    const description = validated.description

    const adminSupabase = createAdminSupabaseClient()

    const result = await processVirtualAccountCredit(adminSupabase, {
      virtualAccountNo,
      amount: amountNum,
      reference,
      description,
      metadata: data,
    })

    if (!result.success) {
      return apiResponse.error(result.message, result.statusCode || 500)
    }

    return apiResponse.success(
      { reference, amount: amountNum },
      'SUCCESS',
    )
  }
  catch (error: any) {
    return handleUtilityError(error, 'Failed to process webhook')
  }
})
