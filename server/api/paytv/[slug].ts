import type { BillerResponse } from '#shared/types/biller-types'
import Buffer from 'node:buffer'

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug
  console.warn(slug) // remove this in prod
  const { CORALPAY_USERNAME, CORALPAY_PASSWORD } = useRuntimeConfig()
  const credentials = Buffer.Buffer.from(`${CORALPAY_USERNAME}:${CORALPAY_PASSWORD}`).toString('base64')

  try {
    const data = await $fetch<BillerResponse>(`https://sandbox1.coralpay.com/coralpay-vas/api/packages/biller/slug/${slug}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'text/plain',
      },
    })

    const allPaytv = await $fetch('/api/paytv')

    // filter the paytv from the list of all paytv to get the image and name
    const filter = allPaytv.find((paytv) => {
      return paytv.slug === slug
    })
    return { paytvResponse: [...data.responseData], image: filter?.image, name: filter?.name }
  }
  catch (error) {
    console.error('Error fetching TV decoder plans:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch TV decoder plans',
    })
  }
})
