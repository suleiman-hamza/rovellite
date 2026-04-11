// import type { AirtimeResponse } from "~/shared/types/biller-types";
interface LogoEntry { src: string, accent?: string }
const BillerLogos: Record<string, LogoEntry> = {
  'mtn_nigeria': { src: '/images/data/mtn.png' },
  'glo_nigeria': { src: '/images/data/glo.png' },
  '9mobile_nigeria': { src: '/images/data/9mobile.png' },
  'airtel_nigeria': { src: '/images/data/airtel.png' },
  'smile': { src: '/images/data/smile.png' },
  'spectranet': { src: '/images/data/spectranet.png' },
  'swift_networks': { src: '/images/data/swift.png' },
  'ipnx': { src: '/images/data/ipnx.png' },
  'vdt': { src: '/images/data/vdt.png' },
} as const

export default defineCachedEventHandler(async () => {
  // airtime and data group slug
  const group = 'AIRTIME_AND_DATA'
  // fetch all billers in the group, then filter for the ones we want to display
  const data = await $fetch(`/api/coral-pay/biller-group-slug/${group}`)
  const selected = data?.filter(item => ['MTN_NIGERIA', 'SMILE', 'SPECTRANET', 'VDT', 'GLO_NIGERIA', 'AIRTEL_NIGERIA', '9MOBILE_NIGERIA', 'IPNX', 'SWIFT_NETWORKS'].includes(item.slug))
  const enriched = selected.map(item => ({
    ...item,
    image: BillerLogos[item.slug?.toLowerCase()]?.src ?? '/images/electricity/Canva.png',
    // accent: BillerLogos[item.slug?.toLowerCase()]?.accent ?? null,
  }))
  return enriched
})
