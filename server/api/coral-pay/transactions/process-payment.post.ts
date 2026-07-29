import type { BillerResponse } from '#shared/types/biller-types'
import Buffer from 'node:buffer'

export default defineEventHandler(async (event) => {
  const { CORALPAY_USERNAME, CORALPAY_PASSWORD } = useRuntimeConfig()

  if (!CORALPAY_USERNAME || !CORALPAY_PASSWORD) {
    throw createError({
      statusCode: 500,
      message: 'CoralPay credentials not configured',
    })
  }

  const credentials = Buffer.Buffer.from(`${CORALPAY_USERNAME}:${CORALPAY_PASSWORD}`).toString('base64')

  const payload = await readBody(event)

  // Log incoming payload for debugging
  console.warn('🔍 [CoralPay Proxy] Incoming payload:', JSON.stringify(payload, null, 2))

  try {
    const response = await $fetch<BillerResponse>(
      'https://sandbox1.coralpay.com/coralpay-vas/api/transactions/process-payment',
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: payload,
        timeout: 30000, // Increased timeout
        retry: 1,
        retryDelay: 800,
      },
    )

    console.warn('✅ [CoralPay Proxy] Success:', response)
    return response
  }
  catch (error: any) {
    const errorDetails = {
      status: error.response?.status || error.statusCode,
      statusText: error.response?.statusText,
      message: error.message,
      data: error.response?._data || error.data, // ← This is crucial
      headers: error.response?.headers,
      url: 'https://sandbox1.coralpay.com/coralpay-vas/api/transactions/process-payment',
      payload, // Log what we sent
      timestamp: new Date().toISOString(),
    }

    console.error('❌ [CoralPay Proxy] Full Error Details:', JSON.stringify(errorDetails, null, 2))

    // Re-throw with better context
    throw createError({
      statusCode: error.response?.status || 502,
      message: `CoralPay Error ${error.response?.status || ''}: ${error.message}`,
      data: errorDetails.data,
    })
  }
})
