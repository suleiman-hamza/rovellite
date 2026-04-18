import { z } from 'zod'

export const palmpayWebhookSchema = z.object({
  data: z.object({
    virtualAccountNo: z.string().min(1, 'virtualAccountNo is required'),
    amount: z.union([z.string(), z.number()]).transform(val => Number(val)),
    reference: z.string().optional().default(''),
    transactionId: z.string().optional().default(''),
    narration: z.string().optional().default(''),
  }),
}).transform(payload => ({
  data: payload.data,
  reference: payload.data.reference || payload.data.transactionId || `txn_${Date.now()}`,
  description: payload.data.narration || 'Credit from Virtual Account',
}))
