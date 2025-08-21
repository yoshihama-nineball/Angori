import { z } from 'zod'

// AngerLog型の定義
export const AngerLogSchema = z.object({
  id: z.number(),
  user_id: z.number().optional(), // 任意にする
  occurred_at: z.string(),
  location: z.string().optional(),
  situation_description: z.string(),
  trigger_words: z.string().optional(),
  // emotions_felt は record か array かを柔軟に対応
  emotions_felt: z
    .union([
      z.record(z.string(), z.boolean()), // オブジェクト形式
      z.array(z.string()), // 配列形式
      z.null(),
    ])
    .optional(),
  anger_level: z.number().min(1).max(10),
  // perception は null を許可
  perception: z.string().nullable(),
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
  location: z.string().max(30, '場所は30文字以内で入力してください').optional(),
  situation_description: z
    .string()
    .min(1)
    .max(200, '状況説明は200文字以内で入力してください'),
  trigger_words: z
    .string()
    .max(30, 'トリガーは30文字以内で入力してください')
    .optional(),
  emotions_felt: z.record(z.string(), z.boolean()).optional(),
  anger_level: z.number().min(1).max(10),
  perception: z
    .string()
    .min(1)
    .max(200, '出来事の捉え方は200文字以内で入力してください'),
  reflection: z
    .string()
    .max(200, '振り返りは200文字以内で入力してください')
    .optional(),
})

export type CreateAngerLogData = z.infer<typeof CreateAngerLogSchema>
export type AngerLogsResponse = z.infer<typeof AngerLogsAPIResponseSchema>
