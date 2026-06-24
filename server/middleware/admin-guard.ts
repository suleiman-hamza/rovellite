import { defineEventHandler } from 'h3'
import { apiResponse } from '#server/utils/api-response'

export default defineEventHandler((event) => {
  // Only guard routes starting with /api/admin/
  if (event.path.startsWith('/api/admin/')) {
    const requester = event.context.user
    if (!requester || requester.role !== 'admin') {
      return apiResponse.error('You do not have permission to perform this action.', 403)
    }
  }
})
