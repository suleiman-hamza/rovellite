// CoralPay VAS Service Layer
// Single source of truth for all CoralPay REST interactions.
// Encapsulates: authentication, HTTP transport, response validation,
// caching, and ISO 8583 response code interpretation.
//
// API route handlers delegate here — they never construct raw
// CoralPay requests themselves.

import type {
  CoralPayBaseResponse,
  CoralPayBiller,
  CoralPayCustomerData,
  CoralPayCustomerLookupPayload,
  CoralPayPackage,
  CoralPayProcessPaymentPayload,
  CoralPayTransactionData,
} from '#shared/types/coralpay'
import Buffer from 'node:buffer'
import { isFailureCode, isPendingCode, isSuccessCode } from '#shared/types/coralpay'
import {
  coralPayCustomerLookupPayloadSchema,
  coralPayPaymentLookupQuerySchema,
  coralPayProcessPaymentPayloadSchema,
} from '#shared/validations/coralpay.schema'
import { CACHE_TTL, cacheKeys, getOrSet } from './redis-cache'

// Configuration

function getCoralPayConfig() {
  const { CORALPAY_USERNAME, CORALPAY_PASSWORD } = useRuntimeConfig()

  if (!CORALPAY_USERNAME || !CORALPAY_PASSWORD) {
    throw createError({
      statusCode: 500,
      message: 'CoralPay credentials not configured',
    })
  }

  return {
    baseUrl: 'https://sandbox1.coralpay.com/coralpay-vas/api',
    credentials: Buffer.Buffer.from(`${CORALPAY_USERNAME}:${CORALPAY_PASSWORD}`).toString('base64'),
  }
}

// Internal HTTP Helper

async function coralPayFetch<T>(
  path: string,
  options: {
    method?: 'GET' | 'POST'
    body?: unknown
    timeout?: number
  } = {},
): Promise<CoralPayBaseResponse<T>> {
  const { baseUrl, credentials } = getCoralPayConfig()
  const { method = 'GET', body, timeout = 15000 } = options

  const contentType = method === 'POST' ? 'application/json' : 'text/plain'

  const response = await $fetch<CoralPayBaseResponse<T>>(`${baseUrl}${path}`, {
    method,
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': contentType,
      'Accept': 'application/json',
    },
    body: body ?? undefined,
    timeout,
  })

  return response
}

// Biller Group Methods

/**
 * Fetch billers by CoralPay group ID.
 * Cached in Redis for CACHE_TTL.BILLER_GROUP seconds.
 */
export async function getBillersByGroupId(id: number | string): Promise<CoralPayBiller[]> {
  return getOrSet(
    cacheKeys.billerGroupById(id),
    async () => {
      const response = await coralPayFetch<CoralPayBiller[]>(`/billers/group/${id}`)

      if (response.error === true) {
        throw createError({ statusCode: 502, message: response.message || 'Failed to fetch biller group' })
      }

      return response.responseData
    },
    CACHE_TTL.BILLER_GROUP,
  )
}

/**
 * Fetch billers by CoralPay group slug.
 * Cached in Redis for CACHE_TTL.BILLER_GROUP seconds.
 * Returns filtered array of { id, name, slug } to match existing contract.
 */
export async function getBillersByGroupSlug(slug: string): Promise<Pick<CoralPayBiller, 'id' | 'name' | 'slug'>[]> {
  return getOrSet(
    cacheKeys.billerGroupBySlug(slug),
    async () => {
      const response = await coralPayFetch<CoralPayBiller[]>(`/billers/group/slug/${slug}`)

      return response.responseData.map(item => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
      }))
    },
    CACHE_TTL.BILLER_GROUP,
  )
}

// Package Methods

/**
 * Fetch packages for a biller by numeric ID.
 * Cached in Redis for CACHE_TTL.PACKAGES seconds.
 */
export async function getPackagesByBillerId(id: number | string): Promise<CoralPayPackage[]> {
  return getOrSet(
    cacheKeys.packagesById(id),
    async () => {
      const response = await coralPayFetch<CoralPayPackage[]>(`/packages/biller/${id}`)
      return response.responseData
    },
    CACHE_TTL.PACKAGES,
  )
}

/**
 * Fetch packages for a biller by slug.
 * Cached in Redis for CACHE_TTL.PACKAGES seconds.
 */
export async function getPackagesByBillerSlug(slug: string): Promise<CoralPayPackage[]> {
  return getOrSet(
    cacheKeys.packagesBySlug(slug),
    async () => {
      const response = await coralPayFetch<CoralPayPackage[]>(`/packages/biller/slug/${slug}`)
      return response.responseData
    },
    CACHE_TTL.PACKAGES,
  )
}

//  Customer Lookup

/**
 * Perform customer lookup/validation with CoralPay.
 * Cached in Redis for CACHE_TTL.CUSTOMER_LOOKUP seconds.
 */
export async function customerLookup(
  payload: CoralPayCustomerLookupPayload,
): Promise<CoralPayBaseResponse<CoralPayCustomerData>> {
  // Validate payload
  const validated = coralPayCustomerLookupPayloadSchema.parse(payload)

  // Check cache first
  const cacheKey = cacheKeys.customerLookup(validated.billerSlug, String(validated.customerId))

  return getOrSet(
    cacheKey,
    async () => {
      const response = await coralPayFetch<CoralPayCustomerData>(
        '/transactions/customer-lookup',
        { method: 'POST', body: validated },
      )
      return response
    },
    CACHE_TTL.CUSTOMER_LOOKUP,
  )
}

// Process Payment

/**
 * Submit a payment to CoralPay.
 * NOT cached — every call is a financial transaction.
 */
export async function processPayment(
  payload: CoralPayProcessPaymentPayload,
): Promise<CoralPayBaseResponse<CoralPayTransactionData>> {
  // Validate payload
  const validated = coralPayProcessPaymentPayloadSchema.parse(payload)

  console.warn('[coralpay-service] Processing payment:', {
    paymentReference: validated.paymentReference,
    packageSlug: validated.packageSlug,
    amount: validated.amount,
  })

  const response = await coralPayFetch<CoralPayTransactionData>(
    '/transactions/process-payment',
    { method: 'POST', body: validated, timeout: 30000 },
  )

  console.warn('[coralpay-service] Payment response:', {
    responseCode: response.responseCode,
    error: response.error,
    message: response.message,
  })

  return response
}

// Payment Lookup

/**
 * Look up a payment status by reference or transaction ID.
 * NOT cached — used for polling pending transactions.
 */
export async function paymentLookup(query: {
  paymentReference?: string
  transactionId?: string
}): Promise<CoralPayBaseResponse<CoralPayTransactionData>> {
  // Validate query
  const validated = coralPayPaymentLookupQuerySchema.parse(query)

  const params = new URLSearchParams()
  if (validated.paymentReference)
    params.append('paymentReference', validated.paymentReference)
  if (validated.transactionId)
    params.append('transactionId', validated.transactionId)

  return coralPayFetch<CoralPayTransactionData>(
    `/transactions/payment-lookup?${params.toString()}`,
  )
}

// ISO 8583 Response Interpretation

/**
 * Interpret a CoralPay response and determine the appropriate action.
 * Used by the fulfillment task to decide: complete, poll, or rollback.
 */
export function interpretResponse(response: CoralPayBaseResponse<CoralPayTransactionData>): {
  action: 'COMPLETE' | 'POLL' | 'FAIL'
  code: string
  message: string
  customerMessage?: string
  transactionId?: string
  token?: string
} {
  const code = response.responseCode || response.responseData?.statusCode || ''
  const customerMessage = response.responseData?.customerMessage || response.message
  const transactionId = response.responseData?.transactionId
  const token = response.responseData?.token || response.responseData?.rechargeToken

  if (isSuccessCode(code) && response.error === false) {
    return { action: 'COMPLETE', code, message: response.message, customerMessage, transactionId, token }
  }

  if (isPendingCode(code)) {
    return { action: 'POLL', code, message: response.message, customerMessage, transactionId, token }
  }

  if (isFailureCode(code)) {
    return { action: 'FAIL', code, message: customerMessage || response.message, customerMessage, transactionId, token }
  }

  // Unknown code — treat as failure
  return {
    action: 'FAIL',
    code,
    message: customerMessage || response.message || `Unknown response code: ${code}`,
    customerMessage,
    transactionId,
    token,
  }
}
