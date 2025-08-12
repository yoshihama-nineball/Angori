import { z } from 'zod'

export const CreateBadgeSchema = z.object({
  name: z
    .string()
    .min(1, 'バッジ名は必須です')
    .max(100, 'バッジ名は100文字以内で入力してください'),
  description: z
    .string()
    .min(1, '説明は必須です')
    .max(500, '説明は500文字以内で入力してください'),
  badge_type: z.enum(['milestone', 'achievement', 'special', 'rare'], {
    message:
      'バッジタイプは milestone, achievement, special, rare のいずれかを選択してください',
  }),
  points_reward: z.coerce
    .number()
    .min(1, 'ポイント報酬は1以上で入力してください')
    .max(999, 'ポイント報酬は999以下で入力してください'),
  requirements: z.record(z.string(), z.any()), // JSONB: key: string, value: any
})

export const BadgeAPIResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  icon_url: z.string().nullable(),
  badge_type: z.enum(['milestone', 'achievement', 'special', 'rare']),
  requirements: z.record(z.string(), z.any()).nullable(), // JSONB: key: string, value: any
  points_reward: z.number(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
})

export const BadgesAPIResponseSchema = z.object({
  badges: z.array(BadgeAPIResponseSchema),
  total: z.number().optional(),
})

// バッジ条件チェック用
export const BadgeRequirementSchema = z.object({
  badge_id: z.number(),
  user_id: z.number(),
})

// バッジ授与用
export const AwardBadgeSchema = z.object({
  user_id: z.number(),
  badge_id: z.number(),
})

// 型エクスポート
export type CreateBadgeData = z.infer<typeof CreateBadgeSchema>
export type Badge = z.infer<typeof BadgeAPIResponseSchema>
export type BadgesResponse = z.infer<typeof BadgesAPIResponseSchema>
export type BadgeRequirement = z.infer<typeof BadgeRequirementSchema>
export type AwardBadgeData = z.infer<typeof AwardBadgeSchema>
