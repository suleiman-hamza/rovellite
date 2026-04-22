import type {
  PalmPayResponse,
} from '../../types/palmpay'
import crypto from 'node:crypto'
import { generatePalmPaySignature } from './palmpay-sign'
import { apiResponse } from '#server/utils/api-response'

type RequestOptions = {
  retries?: number
  timeoutMs?: number
  idempotencyKey?: string
}

/**
 * PalmPay API request utility
 * @param endpoint - PalmPay endpoints (e.g. '/api/v2/virtual/account/create')
 * @param body - Request payload
 */

export async function palmPayRequest<T = PalmPayResponse>(
  endpoint: string,
  body: Record<string, any>,
  options: RequestOptions = {}
): Promise<T> {
  const config = useRuntimeConfig()
  const { palmpayPrivateKey, palmpayAppId, palmpayBaseUrl } = config

  if (!palmpayPrivateKey || !palmpayAppId) {
    throw apiResponse.error('PalmPay configuration is missing in .env', 500)
  }

  // config
  const retries = options.retries ?? 3
  const timeoutMs = options.timeoutMs ?? 10000
  const idempotencyKey =
    options.idempotencyKey ?? crypto.randomUUID()

  const requestTime = Date.now()
  const nonceStr = crypto.randomBytes(16).toString('hex')

  const fullBody = {
    ...body,
    requestTime,
    nonceStr,
    version: 'V2.0',
  }

  const signature = generatePalmPaySignature(fullBody, palmpayPrivateKey)

  const url = `${palmpayBaseUrl}${endpoint}`

  // dev-mode bypass
  // if (process.env.NODE_ENV === 'development' || process.env.NITRO_ENV === 'development') {
  //   console.warn('[DEV MODE] Bypassing PalmPay API request!')
  //   return {
  //     code: '000000',
  //     message: 'success',
  //     data: {
  //       responseId: crypto.randomUUID(),
  //     },
  //   } as T
  // }

  let attempt = 0

  while (attempt <= retries) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), timeoutMs)

      // const startTime = Date.now()

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${palmpayAppId}`,
          'Signature': signature,
          'Content-Type': 'application/json',
          'countryCode': 'NG',
          'Idempotency-Key': idempotencyKey, // important
        },
        body: JSON.stringify(fullBody),
        signal: controller.signal,
      })

      clearTimeout(timeout)
      // const duration = Date.now() - startTime
      const data = await res.json()

      // logging (structured)
      // console.info('[PalmPay Request]', {
      //   endpoint,
      //   status: res.status,
      //   duration,
      //   attempt,
      //   idempotencyKey,
      // })

      if (res.ok) return data as T

      // DON'T RETRY ON CLIENT ERRORS (4xx)
      if (res.status >= 400 && res.status < 500) {
        throw apiResponse.error(`PalmPay Client Error: ${data.message || res.status}`, res.status)
      }

      // SERVER ERRORS (5xx)
      throw apiResponse.error(`Server Error ${res.status}`)

    } catch (error: any) {
      attempt++

      const isRetryable = error.name === 'AbortError' || error.message.includes('Server Error')
      const isLastAttempt = attempt > retries

      // console.error('[PalmPay Error]', {
      //   endpoint,
      //   attempt,
      //   retries,
      //   idempotencyKey,
      //   error: error?.message,
      // })

      if (!isRetryable || isLastAttempt) {
        throw apiResponse.error(error.message || 'PalmPay request failed', 502)
      }

      // Exponential Backoff with Jitter (Standard for Fintech)
      const delay = (2 ** attempt * 500) + (Math.random() * 100)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  // fallback (should never hit)
  throw apiResponse.error('Unexpected PalmPay failure', 500)
}
