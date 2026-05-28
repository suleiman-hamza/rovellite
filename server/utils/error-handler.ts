import type { ApiErrorResponse, ApiValidationErrorItem } from './api-response'
import * as z from 'zod'
import { apiResponse } from './api-response'

function toErrorCode(issue: { code?: string }) {
  // map this however; this keeps it deterministic.
  // Examples: "invalid_type" -> "INVALID_TYPE"
  return (issue.code ?? 'custom').toUpperCase()
}

// error handler
export function handleUtilityError(
  error: unknown,
  defaultMessage: string,
): ApiErrorResponse {
  // Zod validation errors
  if (error instanceof z.ZodError || (error && typeof error === 'object' && 'name' in error && (error as any).name === 'ZodError')) {
    const zodError = error as { issues?: Array<{ message: string, path?: Array<string | number>, code?: string }> }
    const issues = zodError.issues || (error as any).errors || []

    const formattedErrors: ApiValidationErrorItem[] = issues.map((iss: any) => ({
      field: iss.path?.length ? iss.path.join('.') : 'root',
      message: iss.message || 'Validation error',
      code: toErrorCode(iss),
    }))

    // render validation error
    return apiResponse.validationError(formattedErrors)
  }

  // Supabase error instances
  if (error instanceof Error && error.name === 'PostgrestError') {
    const supabaseError = error as Error & {
      code?: string
      details?: string
      hint?: string
    }
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
    if (
      firebaseErrorCode === 'auth/email-already-exists'
      || firebaseErrorCode === 'auth/phone-number-already-exists'
    ) {
      return apiResponse.error(
        'An account with this email or phone number already exists.',
        409,
      )
    }
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
