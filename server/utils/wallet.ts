import { apiResponse } from '#server/utils/api-response'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const userIdSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
})

export async function createRovelsubUserWallet(userId: string) {
  try {
    const config = useRuntimeConfig()
    const adminSupabase = createClient(
      config.public.supabaseUrl,
      config.supabaseServiceRoleKey,
    )

    const { userId: validatedUserId } = userIdSchema.parse({ userId })

    // Check if wallet already exists
    const { data: existing } = await adminSupabase
      .from('wallets')
      .select('id, balance, status')
      .eq('user_id', validatedUserId)
      .single()

    if (existing) {
      return apiResponse.success(existing, 'Wallet already exists')
    }

    // Create new wallet
    const { data, error } = await adminSupabase
      .from('wallets')
      .insert({
        user_id: validatedUserId,
        balance: 0,
        currency: 'NGN',
        status: 'Active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Wallet creation error:', error)
      return apiResponse.error('Failed to create wallet', 500)
    }

    return apiResponse.success(data, 'Wallet created successfully')
  }
  catch (error: any) {
    if (error.name === 'ZodError') {
      const message = error.errors?.[0]?.message || 'Validation error'
      return apiResponse.error(
        message || 'Validation error',
        400,
        'VALIDATION_ERROR',
      )
    }

    console.error('Create Wallet Error:', error)
    return apiResponse.error('Failed to create wallet', 500)
  }
}

export async function getRovelsubUserWallet(_event: any, userId: string) {
  try {
    const config = useRuntimeConfig()
    const adminSupabase = createClient(
      config.public.supabaseUrl,
      config.supabaseServiceRoleKey,
    )

    const { userId: validatedUserId } = userIdSchema.parse({ userId })

    const { data, error } = await adminSupabase
      .from('wallets')
      .select(`
        *,
        profiles(full_name, email, avatar_url)
      `)
      .eq('user_id', validatedUserId)
      .single()

    if (error || !data) {
      return apiResponse.error('Wallet not found', 404)
    }

    return apiResponse.success(data, 'Wallet retrieved successfully')
  }
  catch (error: any) {
    if (error.name === 'ZodError') {
      const message = error.errors?.[0]?.message || 'Validation error'
      return apiResponse.error(
        message || 'Validation error',
        400,
        'VALIDATION_ERROR',
      )
    }
    console.error('Get Wallet Error:', error)
    return apiResponse.error('Failed to fetch wallet', 500)
  }
}
