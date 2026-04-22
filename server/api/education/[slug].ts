import type { BillerResponse } from '#shared/types/biller-types'
import Buffer from 'node:buffer'

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug
  console.warn(slug) // remove this in prod
  const { CORALPAY_USERNAME, CORALPAY_PASSWORD } = useRuntimeConfig()
  const credentials = Buffer.Buffer.from(`${CORALPAY_USERNAME}:${CORALPAY_PASSWORD}`).toString('base64')

  const response = await $fetch<BillerResponse>(`https://sandbox1.coralpay.com/coralpay-vas/api/packages/biller/slug/${slug}`, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'text/plain',
    },
  })

  const educationPlatforms = await $fetch('/api/education')

  // filter the education platform from the list of all platforms to get the image and name
  const filter = educationPlatforms.find((platform) => {
    return platform.slug === slug
  })
  return { platformResponse: [...response.responseData], image: filter?.logo, name: filter?.name }
})
