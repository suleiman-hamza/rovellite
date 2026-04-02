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

/** Typed Response for Virtual Account Creation */
export interface VirtualAccountCreateResponse extends PalmPayBaseResponse {
  data: VirtualAccountCreateData
}

/** Generic PalmPay Response (default fallback) */
export interface PalmPayResponse extends PalmPayBaseResponse {
  data?: any
  [key: string]: any
}
