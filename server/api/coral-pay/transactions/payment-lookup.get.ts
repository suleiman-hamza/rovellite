import type { BillerResponse } from '#shared/types/biller-types'
import Buffer from 'node:buffer'

export default defineEventHandler(async (event) => {
  const { CORALPAY_USERNAME, CORALPAY_PASSWORD } = useRuntimeConfig()
  const credentials = Buffer.Buffer.from(`${CORALPAY_USERNAME}:${CORALPAY_PASSWORD}`).toString('base64')

  const query = getQuery(event)
  const paymentReference = query.paymentReference
  const transactionId = query.transactionId

  // Build query string dynamically
  const params = new URLSearchParams()
  if (paymentReference)
    params.append('paymentReference', String(paymentReference))
  if (transactionId)
    params.append('transactionId', String(transactionId))

  // Proxy request to CoralPay Sandbox payment-lookup
  const response = await $fetch<BillerResponse>(`https://sandbox1.coralpay.com/coralpay-vas/api/transactions/payment-lookup?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'text/plain',
    },
  })

  return response
})
