/** Base PalmPay Response Structure */
export interface PalmPayBaseResponse {
  respCode: string
  respMsg: string
  status?: boolean
}

/** Specific Virtual Account Creation Data */
export interface VirtualAccountCreateData {
  virtualAccountNo: string
  virtualAccountName: string
  customerName: string
  email: string
  identityType: string
  licenseNumber: string
  status: string
  accountReference?: string | null
  appId?: string
  [key: string]: any
}

export interface VirtualAccountQueryResponse {
  respCode: string
  respMsg: string
  data: {
    virtualAccountName: string
    virtualAccountNo: string
    identityType: string
    email: string
    licenseNumber: string
    customerName: string
    status: string
    accountReference: string | null
    appId: string
  }
  status: boolean
}

// i need this export on the frontend after querying the virtual account [userId] endpoint
export interface VirtualAccountResponse {
  success: boolean
  message: string
  data: {
    id: string
    user_id: string
    provider: string
    virtual_account_no: string
    virtual_account_name: string
    status: string
    app_id: string
    raw_response: VirtualAccountQueryResponse['data']
    created_at: string
    profiles: {
      email: string
      phone: string | null
      full_name: string
      avatar_url: string | null
    }
    palmPayFresh: VirtualAccountCreateData
  }
  timestamp: string
}

/** Typed Response for Virtual Account Creation */
export interface VirtualAccountCreateResponse extends PalmPayBaseResponse {
  data: VirtualAccountCreateData
}

/** Generic PalmPay Response (default fallback) */
export interface PalmPayResponse extends PalmPayBaseResponse {
  data?: any
  [key: string]: any
}
