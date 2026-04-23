/** Base PalmPay Response Structure */
export interface PalmPayBaseResponse {
  respCode: string
  respMsg: string
  status?: boolean
}

/** Data returned when creating or querying a Virtual Account on PalmPay */
export interface VirtualAccountData {
  virtualAccountNo: string
  virtualAccountName: string
  customerName: string
  email: string
  identityType: string
  licenseNumber: string
  status: string
  accountReference?: string | null
  appId?: string
}

/** Response from PalmPay Create Endpoint */
export interface VirtualAccountCreateResponse extends PalmPayBaseResponse {
  data: VirtualAccountData
}

/** Response from PalmPay Query Endpoint (/queryOne) */
export interface VirtualAccountQueryResponse extends PalmPayBaseResponse {
  data: VirtualAccountData
  status: boolean
}

/** Standardized Response returned to Frontend from /api/virtual-account/[userId] */
export interface VirtualAccountResponse {
  success: boolean
  message: string
  data: VirtualAccountWithProfile
  timestamp: string
}

/** Generic fallback response */
export interface PalmPayResponse extends PalmPayBaseResponse {
  data?: Record<string, unknown>
}

// ─── Request Payload Types ───────────────────────────────────────────

/** Payload for creating a virtual account */
export interface VirtualAccountCreatePayload {
  customerName: string
  email: string
  virtualAccountName: string
  identityType: string
  licenseNumber: string
}

/** Payload for updating a virtual account status */
export interface VirtualAccountUpdatePayload {
  virtualAccountNo: string
  status: 'Enabled' | 'Disabled'
}

/** Payload for querying a single virtual account */
export interface VirtualAccountQueryPayload {
  virtualAccountNo: string
}

/** Virtual Account joined with User Profile - Used in frontend responses */
export interface VirtualAccountWithProfile {
  id: string
  user_id: string
  provider: string
  virtual_account_no: string
  virtual_account_name: string
  status: string
  app_id?: string
  raw_response?: any
  created_at: string
  updated_at?: string

  profiles: {
    full_name: string
    email: string
    phone?: string | null
    avatar_url?: string | null
  }

  palmPayFresh?: VirtualAccountData // Latest live data from PalmPay
}
