import type { ApiErrorResponse } from './api-response'
import { apiResponse } from './api-response'

// error handler
export function handleUtilityError(error: unknown, defaultMessage: string): ApiErrorResponse {
  if (error instanceof Error && error.name === 'ZodError') {
    const zodError = error as Error & { errors?: Array<{ message?: string }> }
    const message = zodError.errors?.[0]?.message || 'Validation error'
    return apiResponse.error(message, 400, 'VALIDATION_ERROR')
  }

  // Supabase error instances
  if (error instanceof Error && error.name === 'PostgrestError') {
    const supabaseError = error as Error & { code?: string, details?: string, hint?: string }
    const message = supabaseError.details || supabaseError.message || 'Database error'
    const statusCode = supabaseError.code === '23505' ? 409 : 500
    return apiResponse.error(message, statusCode)
  }

  // Catch firebase Auth errors
  if (error instanceof Error && error.name === 'AuthError') {
    const authError = error as Error & { code?: string, details?: string, hint?: string }
    const message = authError.details || authError.message || 'Authentication error'
    const statusCode = authError.code === '23505' ? 409 : 500
    return apiResponse.error(message, statusCode)
  }

  // Catch Firebase Admin SDK errors (e.g. auth/email-already-exists)
  if (error instanceof Error && 'code' in error && typeof (error as any).code === 'string') {
    const firebaseErrorCode = (error as any).code
    if (firebaseErrorCode === 'auth/email-already-exists' || firebaseErrorCode === 'auth/phone-number-already-exists') {
      return apiResponse.error('An account with this email or phone number already exists.', 409)
    }
  }

  // if (typeof error === 'object' && error !== null && 'code' in error) {
  //   const firebaseError = error as { code: string, message?: string }
  //   if (firebaseError.code === 'auth/id-token-expired' || firebaseError.code === 'auth/invalid-id-token') {
  //     return apiResponse.error('Invalid or expired token', 401)
  //   }
  // }

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
