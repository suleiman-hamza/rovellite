import type { PackagesResponse } from '#shared/types/biller-types'
import Buffer from 'node:buffer'

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug
  console.warn(slug)
  const { CORALPAY_USERNAME, CORALPAY_PASSWORD } = useRuntimeConfig()
  const credentials = Buffer.Buffer.from(`${CORALPAY_USERNAME}:${CORALPAY_PASSWORD}`).toString('base64')

  const response = await $fetch<PackagesResponse>(`https://sandbox1.coralpay.com/coralpay-vas/api/packages/biller/slug/${slug}`, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'text/plain',
    },
  })
  return response?.responseData
})
