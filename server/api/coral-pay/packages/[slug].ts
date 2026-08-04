import { getPackagesByBillerSlug } from '#server/utils/coralpay-service'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  const packages = await getPackagesByBillerSlug(slug!)
  return packages
})
