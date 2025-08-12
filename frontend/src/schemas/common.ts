import { z } from 'zod'

export const SuccessResponseSchema = z.object({
  message: z.string(),
  success: z.boolean().optional(),
})

export const ErrorResponseSchema = z.object({
  error: z.string().optional(),
  errors: z.array(z.string()).optional(),
  message: z.string().optional(),
})

export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  per_page: z.number().min(1).max(100).default(20),
  total: z.number().optional(),
})

// 型エクスポート
export type SuccessResponse = z.infer<typeof SuccessResponseSchema>
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>
export type Pagination = z.infer<typeof PaginationSchema>
