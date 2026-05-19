import type { Database } from '../../types/supabase-schema'
import { createClient } from '@supabase/supabase-js'
import WebSocket from 'ws'

export function createAdminSupabaseClient() {
  const config = useRuntimeConfig()

  return createClient<Database>(
    config.public.supabaseUrl,
    config.supabaseServiceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      realtime: {
        transport: WebSocket as any,
      },
    },
  )
}
