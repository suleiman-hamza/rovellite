import { apiResponse } from "./api-response"

// error handler
export function handleUtilityError(error: any, defaultMessage: string) {
    if (error?.name === 'ZodError') {
        const message = error.errors?.[0]?.message || 'Validation error'
        return apiResponse.error(message, 400, 'VALIDATION_ERROR')
    }
    if (error?.name === 'HttpError') {
        return apiResponse.error(error.message, error.statusCode, error.code)
    }
    return apiResponse.error(defaultMessage, 500)
}