export type Json
  = | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '12.2.12 (cd3cf9e)'
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      bvn_verifications: {
        Row: {
          attempt_count: number
          bvn_hash: string
          created_at: string | null
          failure_reason: string | null
          id: string
          name_match_percentage: string | null
          name_match_result: string | null
          palmpay_response: Json | null
          status: Database['public']['Enums']['bvn_verification_status']
          updated_at: string | null
          user_id: string
        }
        Insert: {
          attempt_count?: number
          bvn_hash: string
          created_at?: string | null
          failure_reason?: string | null
          id?: string
          name_match_percentage?: string | null
          name_match_result?: string | null
          palmpay_response?: Json | null
          status?: Database['public']['Enums']['bvn_verification_status']
          updated_at?: string | null
          user_id: string
        }
        Update: {
          attempt_count?: number
          bvn_hash?: string
          created_at?: string | null
          failure_reason?: string | null
          id?: string
          name_match_percentage?: string | null
          name_match_result?: string | null
          palmpay_response?: Json | null
          status?: Database['public']['Enums']['bvn_verification_status']
          updated_at?: string | null
          user_id?: string
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
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string
          full_name: string
          invite_code: string
          location: string
          phone: string
          referred_by: string | null
          role: Database['public']['Enums']['user_role']
          status: Database['public']['Enums']['user_status']
          updated_at: string
          user_id: string
          verified: boolean
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email: string
          full_name: string
          invite_code: string
          location: string
          phone: string
          referred_by?: string | null
          role?: Database['public']['Enums']['user_role']
          status?: Database['public']['Enums']['user_status']
          updated_at?: string
          user_id: string
          verified?: boolean
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          full_name?: string
          invite_code?: string
          location?: string
          phone?: string
          referred_by?: string | null
          role?: Database['public']['Enums']['user_role']
          status?: Database['public']['Enums']['user_status']
          updated_at?: string
          user_id?: string
          verified?: boolean
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          inviter_user_id: string
          referred_user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          inviter_user_id: string
          referred_user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          inviter_user_id?: string
          referred_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'referrals_inviter_user_id_fkey'
            columns: ['inviter_user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['user_id']
          },
          {
            foreignKeyName: 'referrals_referred_user_id_fkey'
            columns: ['referred_user_id']
            isOneToOne: true
            referencedRelation: 'profiles'
            referencedColumns: ['user_id']
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          metadata: Json
          reference: string
          status: string
          type: string
          user_id: string
          virtual_account_no: string
          wallet_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          metadata: Json
          reference: string
          status?: string
          type: string
          user_id: string
          virtual_account_no: string
          wallet_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json
          reference?: string
          status?: string
          type?: string
          user_id?: string
          virtual_account_no?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'fk_wallet_user_match'
            columns: ['wallet_id', 'user_id']
            isOneToOne: false
            referencedRelation: 'wallets'
            referencedColumns: ['id', 'user_id']
          },
          {
            foreignKeyName: 'transactions_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['user_id']
          },
          {
            foreignKeyName: 'transactions_wallet_id_fkey'
            columns: ['wallet_id']
            isOneToOne: false
            referencedRelation: 'wallets'
            referencedColumns: ['id']
          },
        ]
      }
      virtual_accounts: {
        Row: {
          app_id: string
          created_at: string
          id: string
          provider: string
          raw_response: Json
          status: string
          updated_at: string
          user_id: string
          virtual_account_name: string
          virtual_account_no: string
        }
        Insert: {
          app_id: string
          created_at?: string
          id?: string
          provider?: string
          raw_response: Json
          status: string
          updated_at?: string
          user_id: string
          virtual_account_name: string
          virtual_account_no: string
        }
        Update: {
          app_id?: string
          created_at?: string
          id?: string
          provider?: string
          raw_response?: Json
          status?: string
          updated_at?: string
          user_id?: string
          virtual_account_name?: string
          virtual_account_no?: string
        }
        Relationships: [
          {
            foreignKeyName: 'fk_virtual_accounts_user_id'
            columns: ['user_id']
            isOneToOne: true
            referencedRelation: 'profiles'
            referencedColumns: ['user_id']
          },
        ]
      }
      wallets: {
        Row: {
          balance: number
          created_at: string
          currency: string
          id: string
          status: Database['public']['Enums']['user_status']
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          status?: Database['public']['Enums']['user_status']
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          status?: Database['public']['Enums']['user_status']
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'wallets_user_id_fkey'
            columns: ['user_id']
            isOneToOne: true
            referencedRelation: 'profiles'
            referencedColumns: ['user_id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      credit_wallet_with_transaction: {
        Args: {
          p_amount: number
          p_description: string
          p_metadata?: Json
          p_reference: string
          p_user_id: string
          p_virtual_account_no: string
          p_wallet_id: string
        }
        Returns: undefined
      }
      get_referral_lineage: { Args: { p_inviter: string }, Returns: Json }
      increment_balance: {
        Args: { p_amount: number, p_user_id: string }
        Returns: number
      }
      introspect_user_tables: { Args: never, Returns: Json }
      sync_profile_with_wallet:
        | {
          Args: {
            p_avatar_url?: string
            p_bio?: string
            p_email: string
            p_full_name: string
            p_invite_code?: string
            p_location?: string
            p_phone?: string
            p_profile_status?: Database['public']['Enums']['user_status']
            p_referral_lineage?: Json
            p_referred_by?: string
            p_role?: Database['public']['Enums']['user_role']
            p_user_id: string
            p_verified?: boolean
            p_wallet_balance?: number
            p_wallet_currency?: string
            p_wallet_status?: Database['public']['Enums']['user_status']
          }
          Returns: {
            avatar_url: string | null
            bio: string | null
            created_at: string
            email: string
            full_name: string
            invite_code: string
            location: string
            phone: string
            referred_by: string | null
            role: Database['public']['Enums']['user_role']
            status: Database['public']['Enums']['user_status']
            updated_at: string
            user_id: string
            verified: boolean
          }
          SetofOptions: {
            from: '*'
            to: 'profiles'
            isOneToOne: true
            isSetofReturn: false
          }
        }
        | {
          Args: {
            p_avatar_url?: string
            p_bio?: string
            p_email: string
            p_full_name: string
            p_location?: string
            p_phone?: string
            p_profile_status?: Database['public']['Enums']['user_status']
            p_referred_by?: string
            p_role?: Database['public']['Enums']['user_role']
            p_user_id: string
            p_verified?: boolean
            p_wallet_balance?: number
            p_wallet_currency?: string
            p_wallet_status?: Database['public']['Enums']['user_status']
          }
          Returns: {
            avatar_url: string | null
            bio: string | null
            created_at: string
            email: string
            full_name: string
            invite_code: string
            location: string
            phone: string
            referred_by: string | null
            role: Database['public']['Enums']['user_role']
            status: Database['public']['Enums']['user_status']
            updated_at: string
            user_id: string
            verified: boolean
          }
          SetofOptions: {
            from: '*'
            to: 'profiles'
            isOneToOne: true
            isSetofReturn: false
          }
        }
        | {
          Args: {
            p_avatar_url?: string
            p_bio?: string
            p_email: string
            p_full_name: string
            p_invite_code?: string
            p_location?: string
            p_phone?: string
            p_profile_status?: Database['public']['Enums']['user_status']
            p_role?: Database['public']['Enums']['user_role']
            p_used_invite_code?: string
            p_user_id: string
            p_verified?: boolean
            p_wallet_balance?: number
            p_wallet_currency?: string
            p_wallet_status?: Database['public']['Enums']['user_status']
          }
          Returns: {
            avatar_url: string | null
            bio: string | null
            created_at: string
            email: string
            full_name: string
            invite_code: string
            location: string
            phone: string
            referred_by: string | null
            role: Database['public']['Enums']['user_role']
            status: Database['public']['Enums']['user_status']
            updated_at: string
            user_id: string
            verified: boolean
          }
          SetofOptions: {
            from: '*'
            to: 'profiles'
            isOneToOne: true
            isSetofReturn: false
          }
        }
    }
    Enums: {
      bvn_verification_status:
        | 'pending'
        | 'processing'
        | 'verified'
        | 'name_mismatch'
        | 'bvn_invalid'
        | 'service_error'
        | 'failed'
      user_role: 'user' | 'admin'
      user_status: 'active' | 'suspended' | 'blocked'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
      & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    & DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
      ? R
      : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables']
    & DefaultSchema['Views'])
    ? (DefaultSchema['Tables']
      & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
        ? R
        : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema['Tables']
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
    Insert: infer I
  }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I
    }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema['Tables']
  | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
    Update: infer U
  }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U
    }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema['Enums']
  | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema['CompositeTypes']
  | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      bvn_verification_status: [
        'pending',
        'processing',
        'verified',
        'name_mismatch',
        'bvn_invalid',
        'service_error',
        'failed',
      ],
      user_role: ['user', 'admin'],
      user_status: ['active', 'suspended', 'blocked'],
    },
  },
} as const
