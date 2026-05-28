import type { SupabaseClient } from '@supabase/supabase-js'
import type { BvnVerifyPayload, BvnVerifyResponse } from '../../../types/palmpay'
import type { Database } from '../../../types/supabase-schema'
import crypto from 'node:crypto'
import { apiResponse } from '../api-response'
import { handleUtilityError } from '../error-handler'
import { palmPayRequest } from '../palmpay/client'

const MAX_BVN_ATTEMPTS = 2

export async function verifyBvn(
  supabase: SupabaseClient<Database>,
  input: { userId: string, bvn: string },
) {
  const { userId, bvn } = input

  try {
    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('user_id', userId)
      .single()

    if (profileError || !profile) {
      return apiResponse.error('User profile not found', 404)
    }

    // Hash the BVN (SHA-256)
    const bvnHash = crypto.createHash('sha256').update(bvn).digest('hex')

    // Check bvn_verifications table
    const { data: existingVerification } = await supabase
      .from('bvn_verifications')
      .select('status, attempt_count')
      .eq('user_id', userId)
      .single()

    if (existingVerification) {
      if (existingVerification.status === 'verified') {
        return apiResponse.success(null, 'BVN is already verified for this user')
      }

      if ((existingVerification.attempt_count || 0) >= MAX_BVN_ATTEMPTS) {
        return apiResponse.error(
          'Maximum BVN verification attempts exceeded. Please contact support.',
          403,
          'MAX_ATTEMPTS_EXCEEDED',
        )
      }
    }

    // Split full_name into firstName and lastName for EaseID
    const nameParts = profile.full_name.trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.length > 1 ? (nameParts.at(-1) ?? '') : ''
    const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : ''

    const payload: BvnVerifyPayload = {
      bvn,
      firstName,
      lastName,
      middleName,
    }

    // Call EaseID via palmPayRequest
    const config = useRuntimeConfig()
    const easeidBaseUrl = config.easeidBaseUrl as string

    const response = await palmPayRequest<BvnVerifyResponse>(
      '/api/validator-service/open/bvn/verify',
      payload,
      {
        baseUrl: easeidBaseUrl,
        version: 'V1.1',
      },
    )

    let newStatus: Database['public']['Enums']['bvn_verification_status'] = 'failed'
    let failureReason: string | null = null
    let incrementAttempt = true

    if (response.respCode === '00000000' && response.data) {
      if (response.data.nameMatchRlt === 'Exactly Match' || response.data.nameMatchRlt === 'Partial Match') {
        newStatus = 'verified'
      }
      else {
        newStatus = 'name_mismatch'
        failureReason = 'Name mismatch'
      }
    }
    else {
      // It's a PalmPay/EaseID API error
      const respMsgLower = (response.respMsg || '').toLowerCase()

      if (response.respCode === 'OPEN_GW_000023' || respMsgLower.includes('balance') || respMsgLower.includes('insufficient')) {
        newStatus = 'service_error'
        failureReason = response.respMsg || 'Insufficient merchant balance'
        incrementAttempt = false // Don't punish the user for our balance issue
      }
      else if (respMsgLower.includes('invalid') || respMsgLower.includes('not found')) {
        newStatus = 'bvn_invalid'
        failureReason = response.respMsg || 'Invalid BVN provided'
      }
      else {
        newStatus = 'service_error'
        failureReason = response.respMsg || 'Unknown service error'
        incrementAttempt = false // General service errors shouldn't count against user attempts
      }
    }

    const newAttemptCount = (existingVerification?.attempt_count || 0) + (incrementAttempt ? 1 : 0)

    // Upsert result
    const { error: upsertError } = await supabase.from('bvn_verifications').upsert(
      {
        user_id: userId,
        bvn_hash: bvnHash,
        status: newStatus,
        attempt_count: newAttemptCount,
        name_match_result: response.data?.nameMatchRlt || null,
        name_match_percentage: response.data?.namesMatchPercentage || null,
        palmpay_response: response as any,
        failure_reason: failureReason,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    )

    console.warn(newStatus)
    console.error(upsertError)

    if (upsertError) {
      return apiResponse.error('Failed to update verification status', 500)
    }

    if (newStatus === 'service_error') {
      return apiResponse.error(
        `BVN service temporarily unavailable: ${failureReason}`,
        503,
        'SERVICE_UNAVAILABLE',
      )
    }
    else if (newStatus === 'bvn_invalid') {
      return apiResponse.error(
        `The BVN provided is invalid (${failureReason}). You have ${MAX_BVN_ATTEMPTS - newAttemptCount} attempts remaining.`,
        400,
        'BVN_INVALID',
      )
    }
    else if (newStatus !== 'verified') {
      return apiResponse.error(
        `BVN verification failed. Name match result: ${response.data?.nameMatchRlt || 'No Match'}. You have ${MAX_BVN_ATTEMPTS - newAttemptCount} attempts remaining.`,
        400,
        'VERIFICATION_FAILED',
      )
    }

    return apiResponse.success(
      {
        nameMatchRlt: response.data?.nameMatchRlt,
        namesMatchPercentage: response.data?.namesMatchPercentage,
      },
      'BVN verified successfully',
    )
    // console.warn('Success')
  }
  catch (error: any) {
    console.error('Error')
    return handleUtilityError(error, 'Failed to verify BVN')
  }
}
