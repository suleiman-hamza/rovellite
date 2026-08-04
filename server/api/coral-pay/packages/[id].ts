import { getPackagesByBillerId } from '#server/utils/coralpay-service'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  const packages = await getPackagesByBillerId(id!)
  return packages
})
