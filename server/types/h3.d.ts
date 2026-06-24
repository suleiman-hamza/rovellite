import type admin from 'firebase-admin'
import type { UserRole } from '~~/types/supabase'

declare module 'h3' {
  interface H3EventContext {
    user?: admin.auth.DecodedIdToken & {
      role?: UserRole
    }
  }
}
export {}
