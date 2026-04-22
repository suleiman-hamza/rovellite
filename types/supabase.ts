import type { Enums, Json, Tables, TablesInsert, TablesUpdate } from './supabase-schema'

export type Profile = Tables<'profiles'>
export type ProfileInsert = TablesInsert<'profiles'>
export type ProfileUpdate = TablesUpdate<'profiles'>
export type UserRole = Enums<'user_role'>

// TABLE ROW TYPES

export type WalletRow = Tables<'wallets'>
export type WalletInsert = TablesInsert<'wallets'>

export type VirtualAccountRow = Tables<'virtual_accounts'>
export type VirtualAccountInsert = TablesInsert<'virtual_accounts'>
export type VirtualAccountUpdate = TablesUpdate<'virtual_accounts'>

export type TransactionRow = Tables<'transactions'>
export type TransactionInsert = TablesInsert<'transactions'>

// RPC FUNCTION TYPES
export interface CreditWalletWithTransactionArgs {
  p_user_id: string
  p_wallet_id: string // uuid stored as string in JS
  p_amount: number
  p_virtual_account_no: string
  p_reference: string
  p_description: string
  p_metadata?: Json
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
        Insert: {
          id?: string
          user_id: string
          balance?: number
          currency?: string
          status?: 'Active' | 'Inactive' | 'Suspended'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          balance?: number
          currency?: string
          status?: 'Active' | 'Inactive' | 'Suspended'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      virtual_accounts: {
        Row: VirtualAccountRow
        Insert: {
          id?: string
          user_id: string
          virtual_account_no: string
          virtual_account_name?: string
          provider?: 'palmpay'
          status?: string
          app_id?: string
          raw_response?: Record<string, any>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          virtual_account_no?: string
          virtual_account_name?: string
          provider?: 'palmpay'
          status?: string
          app_id?: string
          raw_response?: Record<string, any>
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      transactions: {
        Row: TransactionRow
        Insert: {
          id?: string
          wallet_id: string
          user_id?: string
          type: 'credit' | 'debit' | 'refund'
          amount: number
          reference: string
          description?: string
          status?: 'success' | 'pending' | 'failed'
          virtual_account_no?: string
          metadata?: Record<string, any>
          created_at?: string
        }
        Update: {
          id?: string
          wallet_id?: string
          user_id?: string
          type?: 'credit' | 'debit' | 'refund'
          amount?: number
          reference?: string
          description?: string
          status?: 'success' | 'pending' | 'failed'
          virtual_account_no?: string
          metadata?: Record<string, any>
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }                    
    Enums: { [_ in never]: never }                   
    CompositeTypes: { [_ in never]: never }
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
