const electricDiscoLogos: Record<string, string> = {
  ekedc: '/images/electricity/Eko Electric.svg',
  eedc: '/images/electricity/Enugu Electric.svg',
  aedc: '/images/electricity/Abj Electric Company.svg',
  ikedc: '/images/electricity/Ikeja Electric.svg',
  ibedc: '/images/electricity/Ibadan Electric.svg',
  kedco: '/images/electricity/Kano Electric.svg',
  kaedco: '/images/electricity/Kaduna Electricity.svg',
  jedc: '/images/electricity/Jos Electric.svg',
  aple: '/images/electricity/Apl Electric Company.svg',
  bedc: '/images/electricity/Benin Electric.svg',
  yedc: '/images/electricity/Yola Electric.svg',
  phedc: '/images/electricity/Port-Harcourt Electric.svg',
}

// type Biller = {
//   id: number
//   name: string
//   slug: string
//   logo?: string
// }

export default defineEventHandler(async () => {
  const group = 'ELECTRIC_DISCO'
  const data = await $fetch(`/api/coral-pay/biller-group-slug/${group}`)
  const selected = data?.filter(item => ['EKEDC', 'EEDC', 'AEDC', 'IKEDC', 'IBEDC', 'KEDCO', 'KAEDCO', 'JEDC', 'APLE', 'BEDC', 'BH_ELECTRIC', 'YOLA', 'YEDC', 'PHEDC'].includes(item.slug))
  const enriched = selected.map(item => ({
    ...item,
    logo: electricDiscoLogos[item.slug?.toLowerCase()] ?? '/images/electricity/Canva.png',
  }))
  return enriched
})
