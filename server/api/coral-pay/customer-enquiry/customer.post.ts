import type { BillerResponse } from '#shared/types/biller-types'
import Buffer from 'node:buffer'

export default defineEventHandler(async (event) => {
  const { CORALPAY_USERNAME, CORALPAY_PASSWORD } = useRuntimeConfig()
  const credentials = Buffer.Buffer.from(`${CORALPAY_USERNAME}:${CORALPAY_PASSWORD}`).toString('base64')

  const payload = await readBody(event)
  // const payload = { customerId: 10277062245, billerSlug: 'DSTV', productName: 'COMPACT' }
  const response = await $fetch<BillerResponse>('https://sandbox1.coralpay.com/coralpay-vas/api/transactions/customer-lookup', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
    body: payload,
  })
  return response
})
