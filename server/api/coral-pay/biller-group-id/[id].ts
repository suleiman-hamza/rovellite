import type { BillerResponse } from '@@/shared/types/biller-types'
import Buffer from 'node:buffer'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  console.warn(id)
  const { CORALPAY_USERNAME, CORALPAY_PASSWORD } = useRuntimeConfig()
  // console.log(CORALPAY_PASSWORD);
  const credentials = Buffer.Buffer.from(`${CORALPAY_USERNAME}:${CORALPAY_PASSWORD}`).toString('base64')

  try {
    const response = await $fetch<BillerResponse>(`https://sandbox1.coralpay.com/coralpay-vas/api/billers/group/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'text/plain',
      },
    })
    return response.responseData
  }
  catch (error) {
    console.error('Error fetching biller group by ID:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch biller group by ID',
    })
  }
})
