import type { Biller } from '../../../shared/types/biller-types'

const transportLogos: Record<string, string> = {
  lasg_cowry_card_wallet: '/images/transport/cowry.png',
  shuttlers: '/images/transport/shuttlers.png',
  karrygo: '/images/transport/karrygo.png',
  wakanow: '/images/transport/wakanow.png',
  anambra_comfort_line: '/images/transport/acl.png',
  tracas_nigeria: '/images/transport/tracas.png',
}

export default defineEventHandler(async (_event) => {
  const id = 5 // biller group id for transport and toll payment

  try {
    const response = await $fetch<Biller[]>(`/api/coral-pay/biller-group-id/${id}`)
    const filterResponse = response.filter((item: Biller) => ['LCC', 'LASG_COWRY_CARD_WALLET', 'TRIPS', 'SHUTTLERS', 'KARRYGO', 'WAKANOW', 'ANAMBRA_COMFORT_LINE', 'TRACAS_NIGERIA', 'good-ride', 'TOTAL'].includes(item.slug))
    return filterResponse.map((item: Biller) => ({
      ...item,
      logo: transportLogos[item.slug?.toLowerCase()] ?? '/images/transport/randomtp.png',
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
