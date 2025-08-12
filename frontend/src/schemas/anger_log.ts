import { z } from 'zod'

export const CreateAngerLogSchema = z.object({
  anger_level: z.coerce
    .number({ message: '怒りレベルは数値で入力してください' })
    .int('怒りレベルは整数で入力してください')
    .min(1, '怒りレベルは1以上で入力してください')
    .max(10, '怒りレベルは10以下で入力してください'),
  occurred_at: z
    .string()
    .min(1, '発生日時は必須です')
    .refine((val) => !isNaN(Date.parse(val)), {
      message: '有効な日時を入力してください',
    }),
  situation_description: z
    .string()
    .min(1, '状況説明は必須です')
    .max(1000, '状況説明は1000文字以内で入力してください'),
  location: z
    .string()
    .max(100, '場所は100文字以内で入力してください')
    .optional()
    .or(z.literal('')), // 空文字も許可
  trigger_words: z.string().optional().or(z.literal('')), // 空文字も許可
  emotions_felt: z
    .record(z.string(), z.any()) // JSONB対応（key: string, value: any）
    .optional(),
})

export const UpdateAngerLogSchema = z.object({
  anger_level: z.coerce
    .number()
    .int('怒りレベルは整数で入力してください')
    .min(1, '怒りレベルは1以上で入力してください')
    .max(10, '怒りレベルは10以下で入力してください')
    .optional(),
  occurred_at: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: '有効な日時を入力してください',
    })
    .optional(),
  situation_description: z
    .string()
    .max(1000, '状況説明は1000文字以内で入力してください')
    .optional(),
  location: z
    .string()
    .max(100, '場所は100文字以内で入力してください')
    .optional()
    .or(z.literal('')),
  trigger_words: z.string().optional().or(z.literal('')),
  emotions_felt: z.record(z.string(), z.any()).optional(),
  reflection: z
    .string()
    .max(1000, '振り返りは1000文字以内で入力してください')
    .optional()
    .or(z.literal('')), // 空文字も許可
})

// TypeScript型定義のみ（Zodスキーマなし）
export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
}

export interface ChatSession {
  angerLogId: number
  messages: ChatMessage[]
  isCompleted: boolean
}

export interface ConsultationResult {
  angerLogId: number
  chatSummary: string
  finalAdvice: string
}

// OpenAI API呼び出し用
export const OpenAIChatRequestSchema = z.object({
  anger_log_id: z.number(),
  messages: z.array(
    z.object({
      role: z.enum(['system', 'user', 'assistant']),
      content: z.string(),
    })
  ),
})

// 検索・フィルター用スキーマ
export const AngerLogFilterSchema = z.object({
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  anger_level_min: z.coerce.number().min(1).max(10).optional(),
  anger_level_max: z.coerce.number().min(1).max(10).optional(),
  location: z.string().optional(),
  has_ai_advice: z.boolean().optional(),
  trigger_category: z
    .enum(['work', 'family', 'social', 'sensory', 'other'])
    .optional(),
})

// APIレスポンススキーマ（Rails実装に正確に対応）
export const AngerLogAPIResponseSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  anger_level: z.number().int().min(1).max(10),
  occurred_at: z.string(), // timestamp → ISO string
  location: z.string().nullable(),
  situation_description: z.string(),
  trigger_words: z.string().nullable(),
  emotions_felt: z.record(z.string(), z.any()).nullable(), // JSONB
  ai_advice: z.string().nullable(), // 最大2000文字
  reflection: z.string().nullable(), // 最大1000文字
  created_at: z.string(),
  updated_at: z.string(),
})

export const AngerLogsAPIResponseSchema = z.object({
  anger_logs: z.array(AngerLogAPIResponseSchema),
  total: z.number().optional(),
  page: z.number().optional(),
  per_page: z.number().optional(),
})

// AIアドバイス更新用（内部的に使用）
export const UpdateAiAdviceSchema = z.object({
  ai_advice: z.string().max(2000, 'AIアドバイスは2000文字以内です').optional(),
})

// 型エクスポート
export type CreateAngerLogData = z.infer<typeof CreateAngerLogSchema>
export type UpdateAngerLogData = z.infer<typeof UpdateAngerLogSchema>
export type AngerLog = z.infer<typeof AngerLogAPIResponseSchema>
export type AngerLogsResponse = z.infer<typeof AngerLogsAPIResponseSchema>
export type AngerLogFilter = z.infer<typeof AngerLogFilterSchema>
export type UpdateAiAdviceData = z.infer<typeof UpdateAiAdviceSchema>
