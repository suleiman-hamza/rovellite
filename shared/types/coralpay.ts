// CoralPay VAS API Types
// Fully typed interfaces for CoralPay ISO 8583 response codes,
// API request/response payloads, and domain models.
//

// ISO 8583 Response Codes

/** CoralPay ISO 8583 response codes */
export type CoralPayResponseCode = '00' | '09' | '68' | '06' | '25' | '96'

/** Human-readable meaning for each response code */
export const CORALPAY_RESPONSE_CODES = {
  '00': 'SUCCESS',
  '09': 'PENDING',
  '68': 'PENDING',
  '06': 'FAILED',
  '25': 'CUSTOMER_NOT_FOUND',
  '96': 'SYSTEM_ERROR',
} as const

export type CoralPayResponseStatus = typeof CORALPAY_RESPONSE_CODES[CoralPayResponseCode]

/** Whether a response code indicates a pending/retriable state */
export function isPendingCode(code: string): boolean {
  return code === '09' || code === '68'
}

/** Whether a response code indicates a terminal failure */
export function isFailureCode(code: string): boolean {
  return code === '06' || code === '25' || code === '96'
}

/** Whether a response code indicates success */
export function isSuccessCode(code: string): boolean {
  return code === '00'
}

// Base API Response

/** Common envelope for all CoralPay API responses */
export interface CoralPayBaseResponse<T = unknown> {
  error: boolean
  status: string
  message: string
  responseCode: string
  responseData: T
}

// Biller Types

/** A single biller in CoralPay's biller catalog */
export interface CoralPayBiller {
  id: number
  name: string
  slug: string
  groupId: number
  skipValidation: boolean
  handleWithProductCode: boolean
  isRestricted: boolean
  hideInstitution: boolean
  sendSms: boolean
  images?: string
}

/** Response from /api/billers/group/{id} or /api/billers/group/slug/{slug} */
export type CoralPayBillerResponse = CoralPayBaseResponse<CoralPayBiller[]>

// Package Types

/** A biller package/plan in CoralPay */
export interface CoralPayPackage {
  id: number
  name: string
  slug: string
  amount: number | null
  billerId: number
  hasPending: boolean
  sequenceNumber: number
}

/** Response from /api/packages/biller/{id} or /api/packages/biller/slug/{slug} */
export type CoralPayPackageResponse = CoralPayBaseResponse<CoralPayPackage[]>

// Customer Lookup

/** Payload for customer-lookup POST request */
export interface CoralPayCustomerLookupPayload {
  customerId: string | number
  billerSlug: string
  productName?: string
}

/** Customer details from lookup response */
export interface CoralPayCustomerData {
  billerName: string
  customer: {
    firstName: string
    lastName: string
    customerName: string
    accountNumber: string
    customerType: string
    arrearsBalance: number
    address: string
    phoneNumber: string
    emailAddress: string
  }
  paid: boolean
  statusCode: string
  minPayableAmount: number
  customerMessage?: string
}

/** Response from /api/transactions/customer-lookup */
export type CoralPayCustomerLookupResponse = CoralPayBaseResponse<CoralPayCustomerData>

// Process Payment

/** Payload for process-payment POST request */
export interface CoralPayProcessPaymentPayload {
  paymentReference: string
  customerId: string | number
  packageSlug: string
  channel: 'WEB' | 'MOBILE' | 'USSD' | 'POS'
  amount: number
  customerName: string
  phoneNumber: string
  email: string
}

/** Transaction data from a successful payment response */
export interface CoralPayTransactionData {
  transactionId?: string
  statusCode?: string
  token?: string
  rechargeToken?: string
  customerMessage?: string
  [key: string]: unknown
}

/** Response from /api/transactions/process-payment */
export type CoralPayProcessPaymentResponse = CoralPayBaseResponse<CoralPayTransactionData>

// Payment Lookup

/** Query parameters for payment-lookup GET request */
export interface CoralPayPaymentLookupQuery {
  paymentReference?: string
  transactionId?: string
}

/** Response from /api/transactions/payment-lookup */
export type CoralPayPaymentLookupResponse = CoralPayBaseResponse<CoralPayTransactionData>

// Biller DB Model

/** Represents a row in the billers table */
export interface BillerRow {
  id: string
  coralpay_biller_id: number | null
  name: string
  slug: string
  group_slug: string
  category: string
  skip_validation: boolean
  handle_with_product_code: boolean
  is_restricted: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

/** Category values used in the billers table */
export type BillerCategory
  = | 'ELECTRICITY'
    | 'PAYTV'
    | 'AIRTIME'
    | 'DATA'
    | 'BETTING'
    | 'EDUCATION'
    | 'TRANSPORT'
