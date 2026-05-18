import { z } from 'zod'

/**
 * PalmPay webhook payload schema — matches the FLAT structure PalmPay actually sends.
 *
 * Sample real payload from PalmPay:
 * {
 *   orderNo, payerAccountNo, orderStatus, payerBankName, updateTime,
 *   sessionId, virtualAccountName, reference, orderAmount, createdTime,
 *   currency, payerAccountName, virtualAccountNo, appId, sign
 * }
 */
export const palmpayWebhookSchema = z.object({
  orderNo: z.string().optional().default(''),
  payerAccountNo: z.string().optional().default(''),
  orderStatus: z.union([z.string(), z.number()]).optional(),
  payerBankName: z.string().optional().default(''),
  updateTime: z.number().optional(),
  sessionId: z.string().optional().default(''),
  virtualAccountName: z.string().optional().default(''),
  reference: z.string().optional().default(''),
  orderAmount: z.union([z.string(), z.number()]).transform(val => Number(val)),
  createdTime: z.number().optional(),
  currency: z.string().optional().default('NGN'),
  payerAccountName: z.string().optional().default(''),
  virtualAccountNo: z.string().min(1, 'virtualAccountNo is required'),
  appId: z.string().optional().default(''),
  sign: z.string().optional().default(''),
}).transform(payload => ({
  /** Normalized fields used by processVirtualAccountCredit */
  virtualAccountNo: payload.virtualAccountNo,
  amount: payload.orderAmount,
  reference: payload.reference || payload.orderNo || `txn_${Date.now()}`,
  description: payload.payerAccountName
    ? `Credit from ${payload.payerAccountName} (${payload.payerBankName})`
    : 'Credit from Virtual Account',
  /** Full raw payload for metadata storage */
  rawPayload: payload,
}))
