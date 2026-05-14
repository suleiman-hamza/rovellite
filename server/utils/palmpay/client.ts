import type {
  PalmPayResponse,
} from '../../../types/palmpay'
import crypto from 'node:crypto'
import { generatePalmPaySignature } from './sign'

// ─── Custom Error for non-retryable PalmPay client errors ────────────
class PalmPayClientError extends Error {
  statusCode: number
  palmPayCode?: string

  constructor(message: string, statusCode: number, palmPayCode?: string) {
    super(message)
    this.name = 'PalmPayClientError'
    this.statusCode = statusCode
    this.palmPayCode = palmPayCode
  }
}

// ─── Custom Error for retryable PalmPay server errors ────────────────
class PalmPayServerError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.name = 'PalmPayServerError'
    this.statusCode = statusCode
  }
}

interface RequestOptions {
  retries?: number
  timeoutMs?: number
  idempotencyKey?: string
}

/**
 * PalmPay API request utility
 * @param endpoint - PalmPay endpoints (e.g. '/api/v2/virtual/account/create')
 * @param body - Request payload (typed per endpoint)
 */

export async function palmPayRequest<T = PalmPayResponse>(
  endpoint: string,
  body: Record<string, any>,
  options: RequestOptions = {},
): Promise<T> {
  const config = useRuntimeConfig()
  const { palmpayPrivateKey, palmpayAppId, palmpayBaseUrl } = config

  if (!palmpayPrivateKey || !palmpayAppId) {
    throw createError({
      statusCode: 500,
      statusMessage: 'PalmPay configuration is missing in .env',
    })
  }

  // ─── Idempotent request envelope (frozen ONCE, reused across retries) ───
  const retries = options.retries ?? 3
  const timeoutMs = options.timeoutMs ?? 10000
  const idempotencyKey = options.idempotencyKey ?? crypto.randomUUID()

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
  //     respCode: '00000000',
  //     respMsg: 'success',
  //     data: {
  //       responseId: crypto.randomUUID(),
  //     },
  //   } as T
  // }

  let attempt = 0
  let lastError: Error | null = null
  let wasTimeout = false

  while (attempt <= retries) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), timeoutMs)

      const startTime = Date.now()

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
      const duration = Date.now() - startTime
      const data = await res.json()

      // Structured logging — NEVER log body, signature, or keys
      console.warn(JSON.stringify({
        level: 'info',
        service: 'palmpay-client',
        event: 'api_response',
        endpoint,
        httpStatus: res.status,
        palmPayCode: data?.respCode,
        durationMs: duration,
        attempt,
        maxRetries: retries,
        idempotencyKey,
      }))

      if (res.ok)
        return data as T

      // DON'T RETRY ON CLIENT ERRORS (4xx) — these are hard failures
      if (res.status >= 400 && res.status < 500) {
        throw new PalmPayClientError(
          `PalmPay Client Error: ${data?.respMsg || data?.message || res.statusText}`,
          res.status,
          data?.respCode,
        )
      }

      // SERVER ERRORS (5xx) — retryable
      throw new PalmPayServerError(
        `PalmPay Server Error ${res.status}: ${data?.respMsg || res.statusText}`,
        res.status,
      )
    }
    catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error))
      attempt++
      lastError = err

      // Track if this was a timeout (for Middle State logic)
      if (err.name === 'AbortError') {
        wasTimeout = true
      }

      const isRetryable
        = err.name === 'AbortError' // Our timeout fired
          || err.name === 'PalmPayServerError' // 5xx from PalmPay
          || err.name === 'TypeError' // Network-level fetch failures
          || err.name === 'FetchError' // Node fetch variants
          || (err as any).code === 'ECONNRESET'
          || (err as any).code === 'ECONNREFUSED'
          || (err as any).code === 'ENOTFOUND'

      const isLastAttempt = attempt > retries

      // Structured error logging
      console.error(JSON.stringify({
        level: 'error',
        service: 'palmpay-client',
        event: 'api_error',
        endpoint,
        attempt,
        maxRetries: retries,
        idempotencyKey,
        errorName: err.name,
        errorMessage: err.message,
        isRetryable,
        isLastAttempt,
      }))

      // Hard failure — don't retry
      if (!isRetryable) {
        if (err instanceof PalmPayClientError) {
          throw createError({
            statusCode: err.statusCode,
            statusMessage: err.message,
          })
        }
        throw createError({
          statusCode: 502,
          statusMessage: err.message || 'PalmPay request failed',
        })
      }

      // Last attempt exhausted
      if (isLastAttempt) {
        break
      }

      // Exponential Backoff with Jitter (Standard for Fintech)
      const delay = (2 ** attempt * 500) + (Math.random() * 100)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  // ─── All retries exhausted ─────────────────────────────────────────
  // If timed out, the request status on PalmPay is UNKNOWN.
  // We must NOT treat this as a definitive failure for mutating endpoints.
  if (wasTimeout) {
    console.warn(JSON.stringify({
      level: 'warn',
      service: 'palmpay-client',
      event: 'timeout_exhaustion',
      endpoint,
      idempotencyKey,
      message: 'All retries exhausted due to timeout. PalmPay status is UNKNOWN.',
    }))
  }

  throw createError({
    statusCode: 504,
    statusMessage: wasTimeout
      ? `PalmPay request timed out after ${retries + 1} attempts. Status unknown — verify via query endpoint. IdempotencyKey: ${idempotencyKey}`
      : lastError?.message || 'PalmPay request failed after all retries',
  })
}
