import type { PackagesResponse } from '#shared/types/biller-types'
import Buffer from 'node:buffer'
import { handleUtilityError } from '#server/utils/error-handler'

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug
  const { CORALPAY_USERNAME, CORALPAY_PASSWORD } = useRuntimeConfig()
  const credentials = Buffer.Buffer.from(`${CORALPAY_USERNAME}:${CORALPAY_PASSWORD}`).toString('base64')

  try {
    const data = await $fetch<PackagesResponse>(`https://sandbox1.coralpay.com/coralpay-vas/api/packages/biller/slug/${slug}`, {
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
  catch (error: any) {
    handleUtilityError(error, 'Failed to fetch TV decoder plans')
  }
})
