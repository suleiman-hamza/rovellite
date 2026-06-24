import { z } from 'zod'

export const paginationSchema = z.object({
  limit: z.coerce.number().int().nonnegative().max(100).default(50),
  offset: z.coerce.number().int().nonnegative().default(0),
})

export type PaginationParams = z.infer<typeof paginationSchema>
