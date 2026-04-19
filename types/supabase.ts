import type { SupabaseClient } from '@supabase/supabase-js'
import { useRuntimeConfig } from '#imports'
import { createClient } from '@supabase/supabase-js'

export interface Profile {
  user_id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at?: string
  updated_at?: string
  phone?: string
  bio?: string
  location?: string
  role?: UserRole
}

export type UserRole = 'user' | 'admin'

// export enum UserRole {
//   USER = 'user',
//   ADMIN = 'admin',
// }

export type ProfileInsert = Omit<Profile, 'created_at' | 'updated_at'> & {
  email: string
}

export type ProfileUpdate = Partial<ProfileInsert>

// TABLE ROW TYPES

export interface WalletRow {
  id: string
  user_id: string
  balance: number
  currency: string
  status: 'Active' | 'Inactive' | 'Suspended'
  created_at: string
  updated_at: string
}

export interface VirtualAccountRow {
  id: string
  user_id: string
  virtual_account_no: string
  virtual_account_name?: string
  provider: 'palmpay'
  status: string
  app_id?: string
  raw_response?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface TransactionRow {
  id: string
  wallet_id: string
  user_id?: string
  type: 'credit' | 'debit' | 'refund'
  amount: number
  reference: string
  description?: string
  status: 'success' | 'pending' | 'failed'
  virtual_account_no?: string
  metadata?: Record<string, any>
  created_at: string
}

// RPC FUNCTION TYPES

export interface CreditWalletWithTransactionArgs {
  p_user_id: string
  p_wallet_id: string // uuid stored as string in JS
  p_amount: number
  p_virtual_account_no: string
  p_reference: string
  p_description: string
  p_metadata?: Record<string, any> | null
}

export interface VirtualAccountCreditParams {
  virtualAccountNo: string
  amount: number
  reference: string
  description: string
  metadata?: any
}

// result of the virtual account credit
export type VirtualAccountCreditResult
  = | { success: true, message: string }
    | { success: false, message: string, statusCode: number, code?: string }

// JOINED TYPES
export interface VirtualAccountWithWallet extends VirtualAccountRow {
  wallets: WalletRow
}

//  DATABASE TYPE
export interface Database {
  public: {
    Tables: {
      wallets: {
        Row: WalletRow
        Insert: Omit<WalletRow, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<WalletRow, 'id' | 'created_at'>>
      }
      virtual_accounts: {
        Row: VirtualAccountRow
        Insert: Omit<VirtualAccountRow, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<VirtualAccountRow, 'id' | 'created_at'>>
      }
      transactions: {
        Row: TransactionRow
        Insert: Omit<TransactionRow, 'id' | 'created_at'>
        Update: Partial<Omit<TransactionRow, 'id' | 'created_at'>>
      }
    }
    Functions: {
      credit_wallet_with_transaction: {
        Args: CreditWalletWithTransactionArgs
        Returns: void
      }
      increment_balance: {
        Args: {
          p_user_id: string
          p_amount: number
        }
        Returns: number | null
      }
    }
  }
}

// ADMIN CLIENT HELPER

export function createAdminSupabaseClient(): SupabaseClient<Database> {
  const config = useRuntimeConfig()

  return createClient<Database>(
    config.public.supabaseUrl,
    config.supabaseServiceRoleKey,
  )
}
