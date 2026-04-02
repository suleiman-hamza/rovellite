import type { Response } from '#shared/types/biller-types'
import Buffer from 'node:buffer'

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug
  console.warn(slug)
  const { CORALPAY_USERNAME, CORALPAY_PASSWORD } = useRuntimeConfig()
  // console.log(CORALPAY_PASSWORD);
  const credentials = Buffer.Buffer.from(`${CORALPAY_USERNAME}:${CORALPAY_PASSWORD}`).toString('base64')

  const response: Response = await $fetch(`https://sandbox1.coralpay.com/coralpay-vas/api/billers/group/slug/${slug}`, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'text/plain',
    },
  })

  const filteredresponse = response.responseData.map((item) => {
    return {
      id: item.id,
      name: item.name,
      slug: item.slug,
    }
  })
  return filteredresponse
})
