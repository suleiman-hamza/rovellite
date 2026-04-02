import type { PackagesResponse } from '#shared/types/biller-types' // types from shared types, ensuring consistent typing across the application
import Buffer from 'node:buffer'

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug // extract slug from the URL parameters, which identifies the specific biller for which packages are being requested
  console.warn(slug)
  const { CORALPAY_USERNAME, CORALPAY_PASSWORD } = useRuntimeConfig()
  const credentials = Buffer.Buffer.from(`${CORALPAY_USERNAME}:${CORALPAY_PASSWORD}`).toString('base64') // create a base64-encoded string for basic authentication using CoralPay credentials from runtime configuration

  const response: PackagesResponse = await $fetch(`https://sandbox1.coralpay.com/coralpay-vas/api/packages/biller/slug/${slug}`, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'text/plain',
    },
  })
  return response.responseData
})
