import type { Package, PackagesResponse } from '#shared/types/biller-types'
import Buffer from 'node:buffer'

export default defineEventHandler(async (event) => {
  const slug = (event.context.params?.slug)

  const { CORALPAY_USERNAME, CORALPAY_PASSWORD } = useRuntimeConfig()
  const credentials = Buffer.Buffer.from(`${CORALPAY_USERNAME}:${CORALPAY_PASSWORD}`).toString('base64')

  // <Response> is used to type the response from the API, ensuring it matches the expected structure
  const airtimeProvider = await $fetch<PackagesResponse>(`https://sandbox1.coralpay.com/coralpay-vas/api/packages/biller/slug/${slug}`, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'text/plain',
    },
  })

  const airtimeBiller = await $fetch('/api/airtime')

  // filter the airtime provider from the list of all providers to get the image and name
  const filter = airtimeBiller.find((provider) => {
    return provider.slug === slug
  })
  const firstNullAmount = airtimeProvider.responseData.find(item => item.amount === null) as Package
  // returm the airtime provider with the image and name from the filter
  return { airtimeplan: [firstNullAmount], image: filter?.image, name: filter?.name }
})
