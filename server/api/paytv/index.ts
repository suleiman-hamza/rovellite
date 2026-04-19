// import type { Biller } from '#shared/types/biller-types'

const payTvLogos: Record<string, string> = {
  dstv: '/images/paytv/dstv.png',
  gotv: '/images/paytv/gotv.png',
  startimes: '/images/paytv/startimes.png',
  showmax: '/images/paytv/showmax.png',
}

export default defineEventHandler(async () => {
  const group = 'PAY_TV'

  try {
    const response = await $fetch(`/api/coral-pay/biller-group-slug/${group}`)
    const filterBillers = response.filter(item => ['DSTV', 'GOTV', 'STARTIMES', 'SHOWMAX'].includes(item.slug))
    const payTvBillers = filterBillers.map((item) => {
      return {
        ...item,
        image: payTvLogos[item.slug?.toLowerCase()],
      }
    })

    return payTvBillers
  }
  catch (error) {
    console.error('Error fetching pay TV billers:', error)
    throw createError({ statusCode: 500, message: 'Failed to fetch pay TV billers' })
  }
})
