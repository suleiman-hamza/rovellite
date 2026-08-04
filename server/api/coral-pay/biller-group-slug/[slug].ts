import { getBillersByGroupSlug } from '#server/utils/coralpay-service'

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug

  const billers = await getBillersByGroupSlug(slug!)
  return billers
})
