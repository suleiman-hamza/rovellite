import type {
  PalmPayResponse,
} from '../../types/palmpay'
import crypto from 'node:crypto'
import { generatePalmPaySignature } from './palmpay-sign'

/**
 * PalmPay API request utility
 * @param endpoint - PalmPay endpoints (e.g. '/api/v2/virtual/account/label/create')
 * @param body - Request payload
 */

export async function palmPayRequest<T = PalmPayResponse>(
  endpoint: string,
  body: Record<string, any>,
): Promise<T> {
  const config = useRuntimeConfig()

  const { palmpayPrivateKey, palmpayAppId, palmpayBaseUrl } = config

  if (!palmpayPrivateKey || !palmpayAppId) {
    throw createError({
      statusCode: 500,
      statusMessage: 'PalmPay configuration is missing in .env',
    })
  }

  const requestTime = Date.now()
  const nonceStr = crypto.randomBytes(16).toString('hex')

  const fullBody = {
    ...body,
    requestTime,
    nonceStr,
    version: 'V2.0',
  }

  const signature = generatePalmPaySignature(fullBody, palmpayPrivateKey)

  return await $fetch(`${palmpayBaseUrl}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${palmpayAppId}`,
      'Signature': signature,
      'Content-Type': 'application/json',
      'countryCode': 'NG',
    },
    body: fullBody,
  })
}
