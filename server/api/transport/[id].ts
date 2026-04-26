import type { BillerResponse } from '#shared/types/biller-types'
import Buffer from 'node:buffer'

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id)

  console.warn(id) // remove this in prod
  const { CORALPAY_USERNAME, CORALPAY_PASSWORD } = useRuntimeConfig()
  const credentials = Buffer.Buffer.from(`${CORALPAY_USERNAME}:${CORALPAY_PASSWORD}`).toString('base64')

  const response = await $fetch<BillerResponse>(`https://sandbox1.coralpay.com/coralpay-vas/api/packages/biller/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'text/plain',
    },
  })

  const educationPlatforms = await $fetch('/api/transport')

  // filter the education platform from the list of all platforms to get the image and name
  const filter = educationPlatforms.find((platform) => {
    return platform.id === id
  })
  return { platformResponse: [...response.responseData], image: filter?.logo, name: filter?.name }
})
