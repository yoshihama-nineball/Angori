import { z } from 'zod'
import { BadgeAPIResponseSchema } from './badge'

export const UserBadgeAPIResponseSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  badge_id: z.number(),
  earned_at: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  badge: BadgeAPIResponseSchema.optional(),
})

export const UserBadgesAPIResponseSchema = z.object({
  user_badges: z.array(UserBadgeAPIResponseSchema),
  total: z.number().optional(),
})

// 型エクスポート
export type UserBadge = z.infer<typeof UserBadgeAPIResponseSchema>
export type UserBadgesResponse = z.infer<typeof UserBadgesAPIResponseSchema>
