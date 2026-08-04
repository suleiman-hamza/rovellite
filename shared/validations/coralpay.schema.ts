import { z } from 'zod'

// CoralPay ISO 8583 Response Codes
// Strict Zod validation for all recognized CoralPay response codes.

/** Valid ISO 8583 response codes from CoralPay */
export const coralPayResponseCodeSchema = z.enum(['00', '09', '68', '06', '25', '96'])

// Base Response Envelope

/** Validates the common envelope shape for all CoralPay API responses */
export const coralPayBaseResponseSchema = z.object({
  error: z.boolean(),
  status: z.string(),
  message: z.string(),
  responseCode: z.string(),
  responseData: z.unknown(),
})

// Biller Schemas
export const coralPayBillerSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  groupId: z.number().optional(),
  skipValidation: z.boolean().optional().default(false),
  handleWithProductCode: z.boolean().optional().default(false),
  isRestricted: z.boolean().optional().default(false),
  hideInstitution: z.boolean().optional().default(false),
  sendSms: z.boolean().optional().default(false),
  images: z.string().optional(),
})

export const coralPayBillerResponseSchema = coralPayBaseResponseSchema.extend({
  responseData: z.array(coralPayBillerSchema),
})

// Package Schemas
export const coralPayPackageSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  amount: z.number().nullable(),
  billerId: z.number(),
  hasPending: z.boolean().optional().default(false),
  sequenceNumber: z.number().optional().default(0),
})

export const coralPayPackageResponseSchema = coralPayBaseResponseSchema.extend({
  responseData: z.array(coralPayPackageSchema),
})

// Customer Lookup Schemas
export const coralPayCustomerLookupPayloadSchema = z.object({
  customerId: z.union([z.string().min(1), z.number()]),
  billerSlug: z.string().min(1, 'Biller slug is required'),
  productName: z.string().optional(),
})

export const coralPayCustomerDataSchema = z.object({
  billerName: z.string(),
  customer: z.object({
    firstName: z.string(),
    lastName: z.string(),
    customerName: z.string(),
    accountNumber: z.string(),
    customerType: z.string(),
    arrearsBalance: z.number(),
    address: z.string(),
    phoneNumber: z.string(),
    emailAddress: z.string(),
  }),
  paid: z.boolean(),
  statusCode: z.string(),
  minPayableAmount: z.number(),
  customerMessage: z.string().optional(),
})

export const coralPayCustomerLookupResponseSchema = coralPayBaseResponseSchema.extend({
  responseData: coralPayCustomerDataSchema,
})

// Process Payment Schemas
export const coralPayProcessPaymentPayloadSchema = z.object({
  paymentReference: z.string().min(1, 'Payment reference is required'),
  customerId: z.union([z.string().min(1), z.number()]),
  packageSlug: z.string().min(1, 'Package slug is required'),
  channel: z.enum(['WEB', 'MOBILE', 'USSD', 'POS']).default('WEB'),
  amount: z.number().positive('Amount must be greater than zero'),
  customerName: z.string().min(1, 'Customer name is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  email: z.email('Valid email is required'),
})

export const coralPayTransactionDataSchema = z.looseObject({
  transactionId: z.string().optional(),
  statusCode: z.string().optional(),
  token: z.string().optional(),
  rechargeToken: z.string().optional(),
  customerMessage: z.string().optional(),
})

export const coralPayProcessPaymentResponseSchema = coralPayBaseResponseSchema.extend({
  responseData: coralPayTransactionDataSchema,
})

// Payment Lookup Schemas
export const coralPayPaymentLookupQuerySchema = z.object({
  paymentReference: z.string().optional(),
  transactionId: z.string().optional(),
}).refine(
  data => !!data.paymentReference || !!data.transactionId,
  { message: 'Either paymentReference or transactionId is required' },
)

export const coralPayPaymentLookupResponseSchema = coralPayBaseResponseSchema.extend({
  responseData: coralPayTransactionDataSchema,
})

// Inferred Types
export type CoralPayResponseCodeInput = z.input<typeof coralPayResponseCodeSchema>
export type CoralPayCustomerLookupPayloadInput = z.input<typeof coralPayCustomerLookupPayloadSchema>
export type CoralPayProcessPaymentPayloadInput = z.input<typeof coralPayProcessPaymentPayloadSchema>
export type CoralPayPaymentLookupQueryInput = z.input<typeof coralPayPaymentLookupQuerySchema>
