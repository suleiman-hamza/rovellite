import { getBillersByGroupId } from '#server/utils/coralpay-service'
import { handleUtilityError } from '#server/utils/error-handler'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  try {
    const billers = await getBillersByGroupId(id!)
    return billers
  }
  catch (error) {
    return handleUtilityError(error, 'Failed to fetch biller group by ID')
  }
})
