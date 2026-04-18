import type { Response } from '#shared/types/biller-types'
import Buffer from 'node:buffer'

export default defineCachedEventHandler(async (event) => {
  const id = Number(event.context.params?.id)

  const { CORALPAY_USERNAME, CORALPAY_PASSWORD } = useRuntimeConfig()
  // console.log(CORALPAY_PASSWORD);
  const credentials = Buffer.Buffer.from(`${CORALPAY_USERNAME}:${CORALPAY_PASSWORD}`).toString('base64')

  // <Response> is used to type the response from the API, ensuring it matches the expected structure
  const bettingProvider = await $fetch<Response>(`https://sandbox1.coralpay.com/coralpay-vas/api/packages/biller/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'text/plain',
    },
  })

  const allBettingProviders = await $fetch('/api/betting')

  // filter the betting provider from the list of all providers to get the image and name
  const filter = allBettingProviders.find((provider) => {
    return provider.id === id
  })

  // returm the betting provider with the image and name from the filter
  return { bettinPlan: [...bettingProvider.responseData], image: filter?.images, name: filter?.name }
})
