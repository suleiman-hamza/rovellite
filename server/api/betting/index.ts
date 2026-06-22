import type { Biller } from '#shared/types/biller-types'

const logos: Record<string, string> = {
  'betking': '/images/betting/betking.png',
  'bet9ja': '/images/betting/bet9ja.png',
  'bangbet': '/images/betting/betbang.png',
  'betpawa': '/images/betting/betpawa.png',
  'sportybet': '/images/betting/sportybet.png',
  'livescorebet': '/images/betting/livescore.png',
  'footballcom': '/images/betting/football.com.png',
  'merrybet': '/images/betting/merrybet.png',
  '25lotto': '/images/betting/25lotto.png',
  '1xbet': '/images/betting/1xbet.png',
  'betbaba': '/images/betting/betbaba.png',
  'betway': '/images/betting/betway.png',
  'nairabet': '/images/betting/nairabet.png',
  'winners_golden_chance': '/images/betting/golden-chance-lotto.png',
  'accessbet': '/images/betting/accessbet.png',
  'cloudbet': '/images/betting/cloudbet.png',
  'betland': '/images/betting/betland.png',
  'greenlotto': '/images/betting/greenlotto.png',
  'hallabet': '/images/betting/hallbet.png',
  'eliestlotto': '/images/betting/elliestlotto.png',
  'western_lotto': '/images/betting/westernlotto.png',
  // 'allcitybet': '/images/betting/betking-sports.png',
  // paripesa: '/images/betting/paripesa.png',
  'ginjahbet': '/images/betting/ginjabet.png',
  'msport': '/images/betting/msport.png',
  'mlotto': '/images/betting/mlotto.png',
  'zoomlifestyle': '/images/betting/zoomlifestyle.png',
  'megamillion': '/images/betting/megamill.png',
  'surebet': '/images/betting/surebet.png',
}

export default defineEventHandler(async () => {
  const id = 7 // coralPay id for betting providers

  // in-server fetch to make internal requests to another handler
  // <Response> is used to type the response from the API, ensuring it matches the expected structure
  const bettingProviders = await $fetch<Biller[]>(`/api/coral-pay/biller-group-id/${id}`)

  // modify the response to work well with the ui by looping through and adding the image property to each provider based on the slug, using the logos mapping
  const final: Biller[] = (bettingProviders || []).map(provider => ({
    ...provider,
    images: logos[provider.slug?.toLowerCase()] || '/images/betting/default.png',
  }))

  // console.warn('Final Betting Providers with Images:', final)
  return final
})
