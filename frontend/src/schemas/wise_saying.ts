// src/schemas/wiseSaying.ts
import { z } from 'zod'

export const CreateWiseSayingSchema = z.object({
  content: z
    .string()
    .min(1, '内容は必須です')
    .max(500, '内容は500文字以内で入力してください'),
  author: z
    .string()
    .min(1, '作者は必須です')
    .max(100, '作者は100文字以内で入力してください'),
  category: z.enum(
    [
      'anger_management',
      'mindfulness',
      'self_acceptance',
      'self_care',
      'breathing_techniques',
      'motivation',
      'wisdom',
      'general',
    ],
    {
      message: 'カテゴリは指定された選択肢から選択してください',
    }
  ),
  anger_level_range: z.enum(['all', 'low', 'medium', 'high'], {
    message:
      '怒りレベル範囲は all, low, medium, high のいずれかを選択してください',
  }),
})

export const WiseSayingAPIResponseSchema = z.object({
  id: z.number(),
  content: z.string(),
  author: z.string().nullable(), // migration で null 許可
  category: z
    .enum([
      'anger_management',
      'mindfulness',
      'self_acceptance',
      'self_care',
      'breathing_techniques',
      'motivation',
      'wisdom',
      'general',
    ])
    .nullable(), // migration で null 許可
  anger_level_range: z.enum(['all', 'low', 'medium', 'high']).nullable(), // migration で null 許可
  is_active: z.boolean().default(true),
  display_count: z.number().default(0),
  created_at: z.string(),
  updated_at: z.string(),
})

export const WiseSayingsAPIResponseSchema = z.object({
  wise_sayings: z.array(WiseSayingAPIResponseSchema),
  total: z.number().optional(),
})

// 格言検索用
export const WiseSayingFilterSchema = z.object({
  category: z
    .enum([
      'anger_management',
      'mindfulness',
      'self_acceptance',
      'self_care',
      'breathing_techniques',
      'motivation',
      'wisdom',
      'general',
    ])
    .optional(),
  anger_level_range: z.enum(['all', 'low', 'medium', 'high']).optional(),
  search_query: z.string().optional(),
})

// 型エクスポート
export type CreateWiseSayingData = z.infer<typeof CreateWiseSayingSchema>
export type WiseSaying = z.infer<typeof WiseSayingAPIResponseSchema>
export type WiseSayingsResponse = z.infer<typeof WiseSayingsAPIResponseSchema>
export type WiseSayingFilter = z.infer<typeof WiseSayingFilterSchema>
