import { z } from 'zod'

// AngerLog型の定義
export const AngerLogSchema = z.object({
  id: z.number(),
  user_id: z.number().optional(), // 任意にする
  occurred_at: z.string(),
  location: z.string().optional(),
  situation_description: z.string(),
  trigger_words: z.string().optional(),
  emotions_felt: z.record(z.string(), z.boolean()).optional(),
  anger_level: z.number().min(1).max(10),
  perception: z.string(),
  ai_advice: z.string().optional(),
  reflection: z.string().optional().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type AngerLog = z.infer<typeof AngerLogSchema>

// API レスポンス用のスキーマ
export const AngerLogAPIResponseSchema = AngerLogSchema

// 複数のAngerLog用
export const AngerLogsAPIResponseSchema = z.object({
  anger_logs: z.array(AngerLogSchema),
  pagination: z
    .object({
      total: z.number(),
      page: z.number(),
      per_page: z.number(),
      total_pages: z.number(),
    })
    .optional(),
})

// 作成用データの型
export const CreateAngerLogSchema = z.object({
  occurred_at: z.string(),
  location: z.string().optional(),
  situation_description: z.string().min(1),
  trigger_words: z.string().optional(),
  emotions_felt: z.record(z.string(), z.boolean()).optional(),
  anger_level: z.number().min(1).max(10),
  perception: z.string().min(1),
  reflection: z.string().optional(),
})

export type CreateAngerLogData = z.infer<typeof CreateAngerLogSchema>
export type AngerLogsResponse = z.infer<typeof AngerLogsAPIResponseSchema>
