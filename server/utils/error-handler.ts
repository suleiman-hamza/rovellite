import type { ApiErrorResponse } from './api-response'
import { apiResponse } from './api-response'

// error handler
export function handleUtilityError(error: unknown, defaultMessage: string): ApiErrorResponse {
  if (error instanceof Error && error.name === 'ZodError') {
    const zodError = error as Error & { errors?: Array<{ message?: string }> }
    const message = zodError.errors?.[0]?.message || 'Validation error'
    return apiResponse.error(message, 400, 'VALIDATION_ERROR')
  }

  // Nuxt/H3 createError instances
  if (typeof error === 'object' && error !== null && 'statusCode' in error) {
    const httpError = error as { statusCode: number, statusMessage?: string, message?: string }
    return apiResponse.error(
      httpError.statusMessage || httpError.message || defaultMessage,
      httpError.statusCode,
    )
  }

  if (error instanceof Error) {
    return apiResponse.error(error.message || defaultMessage, 500)
  }

  return apiResponse.error(defaultMessage, 500)
}
