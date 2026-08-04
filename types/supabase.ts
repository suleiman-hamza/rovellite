import type { Enums, Json, Tables, TablesInsert, TablesUpdate } from './supabase-schema'

// TABLE ROW TYPES
//
// profiles table
export type Profile = Tables<'profiles'>
export type ProfileInsert = TablesInsert<'profiles'>
export type ProfileUpdate = TablesUpdate<'profiles'>
export type UserRole = Enums<'user_role'>
export type UserStatus = Enums<'user_status'>

// wallets table
export type WalletRow = Tables<'wallets'>
export type WalletInsert = TablesInsert<'wallets'>

// virtual accounts table
export type VirtualAccountRow = Tables<'virtual_accounts'>
export type VirtualAccountInsert = TablesInsert<'virtual_accounts'>
export type VirtualAccountUpdate = TablesUpdate<'virtual_accounts'>

// bvn verifications table
export type BvnVerificationRow = Tables<'bvn_verifications'>
export type BvnVerificationInsert = TablesInsert<'bvn_verifications'>
export type BvnVerificationUpdate = TablesUpdate<'bvn_verifications'>

// transactions table
export type TransactionRow = Tables<'transactions'>
export type TransactionInsert = TablesInsert<'transactions'>

// subscription plans table
export type SubscriptionPlanRow = Tables<'subscription_plans'>
export type SubscriptionPlanInsert = TablesInsert<'subscription_plans'>
export type SubscriptionPlanUpdate = TablesUpdate<'subscription_plans'>
export type ServiceProvider = Enums<'service_provider'>

// orders table
export type OrderRow = Tables<'orders'>
export type OrderInsert = TablesInsert<'orders'>
export type OrderUpdate = TablesUpdate<'orders'>
export type OrderStatus = Enums<'order_status'>

// billers table
export type BillerRow = Tables<'billers'>
export type BillerInsert = TablesInsert<'billers'>
export type BillerUpdate = TablesUpdate<'billers'>

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

// virtual account credit params
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
      bvn_verifications: {
        Row: BvnVerificationRow
        Insert: {
          id?: string
          user_id: string
          bvn_hash: string
          status?: string
          attempt_count?: number
          name_match_result?: string | null
          name_match_percentage?: string | null
          palmpay_response?: Record<string, any> | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          bvn_hash?: string
          status?: string
          attempt_count?: number
          name_match_result?: string | null
          name_match_percentage?: string | null
          palmpay_response?: Record<string, any> | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'bvn_verifications_user_id_fkey'
            columns: ['user_id']
            isOneToOne: true
            referencedRelation: 'profiles'
            referencedColumns: ['user_id']
          },
        ]
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
      subscription_plans: {
        Row: SubscriptionPlanRow
        Insert: {
          id?: string
          name: string
          price: number
          service_provider: ServiceProvider
          is_active?: boolean
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          service_provider?: ServiceProvider
          is_active?: boolean
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: OrderRow
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          idempotency_key: string
          target_identifier: string
          amount: number
          status?: OrderStatus
          vendor_request?: Json | null
          vendor_response?: Json | null
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string
          idempotency_key?: string
          target_identifier?: string
          amount?: number
          status?: OrderStatus
          vendor_request?: Json | null
          vendor_response?: Json | null
          error_message?: string | null
          created_at?: string
          updated_at?: string
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
      process_subscription_debit: {
        Args: {
          p_user_id: string
          p_plan_id: string
          p_idempotency_key: string
          p_target: string
        }
        Returns: Json
      }
      reverse_subscription_debit: {
        Args: {
          p_order_id: string
          p_user_id: string
          p_amount: number
          p_error_message: string
        }
        Returns: Json
      }
    }
  }
}
