import {
  defineEventHandler,
  readBody,
} from 'h3'
import { handleUtilityError } from '~~/server/utils/error-handler'
import { forgotPasswordSchema } from '~~/shared/validations/auth'
import { apiResponse } from '#server/utils/api-response'

export default defineEventHandler(async (event) => {
  try {
    const rawBody = await readBody(event)
    const body = forgotPasswordSchema.parse(rawBody || {})

    const config = useRuntimeConfig()
    const apiKey = config.public.firebase.apiKey

    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestType: 'PASSWORD_RESET',
        email: body.email,
      }),
    })

    if (!res.ok) {
      const errorData = await res.json()
      // To prevent email enumeration, we return success even if the email is not found
      if (errorData.error?.message === 'EMAIL_NOT_FOUND') {
        return apiResponse.success(null, 'If your email is registered, a password reset link has been sent.')
      }
      throw new Error(errorData.error?.message || 'Failed to send password reset email')
    }

    return apiResponse.success(null, 'If your email is registered, a password reset link has been sent.')
  }
  catch (error: any) {
    return handleUtilityError(error, 'Failed to process forgot password request')
  }
})
