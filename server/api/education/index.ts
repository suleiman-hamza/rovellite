import type { Biller } from '../../../shared/types/biller-types'

const educationLogos: Record<string, string> = {
  waec: '/images/education/waec.png',
  jamb: '/images/education/jamb.png',
}

export default defineEventHandler(async (_event) => {
  const id = 13 // biller group id for education

  try {
    const response = await $fetch<Biller[]>(`/api/coral-pay/biller-group-id/${id}`)
    const filterResponse = response.filter((item: Biller) => ['WAEC', 'JAMB'].includes(item.slug))
    return filterResponse.map((item: Biller) => ({
      ...item,
      logo: educationLogos[item.slug?.toLowerCase()] ?? '/images/education/Canva.png',
    }))
  }
  catch (error) {
    console.error('Error fetching biller group by ID:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch biller group',
      message: 'An error occurred while fetching the biller group. Please try again later.',
    })
  }
})
