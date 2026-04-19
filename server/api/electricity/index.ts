import type { Biller } from '~~/shared/types/biller-types'

const electricDiscoLogos: Record<string, string> = {
  ekedc: '/images/electricity/ekedc.png',
  eedc: '/images/electricity/eedc.png',
  aedc: '/images/electricity/aedc.png',
  ikedc: '/images/electricity/ikedc.png',
  ibedc: '/images/electricity/ibedc.png',
  kedco: '/images/electricity/kedco.png',
  kaedco: '/images/electricity/kaedco.png',
  jedc: '/images/electricity/jedc.png',
  aple: '/images/electricity/apl.png',
  bedc: '/images/electricity/bedc.png',
  yedc: '/images/electricity/yedc.png',
  phedc: '/images/electricity/phed.png',
}

// type Biller = {
//   id: number
//   name: string
//   slug: string
//   logo?: string
// }

export default defineCachedEventHandler(async () => {
  const group = 'ELECTRIC_DISCO'
  const data = await $fetch<Biller[]>(`/api/coral-pay/biller-group-slug/${group}`)
  const selected = data?.filter((item: Biller) => ['EKEDC', 'EEDC', 'AEDC', 'IKEDC', 'IBEDC', 'KEDCO', 'KAEDCO', 'JEDC', 'APLE', 'BEDC', 'YEDC', 'PHEDC'].includes(item.slug))
  const enriched = selected.map((item: Biller) => ({
    ...item,
    logo: electricDiscoLogos[item.slug?.toLowerCase()] ?? '/images/electricity/Canva.png',
  }))
  return enriched
})
