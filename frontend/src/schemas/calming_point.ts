import { z } from 'zod'

export const CalmingPointAPIResponseSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  total_points: z.number().min(0),
  current_level: z.number().min(1),
  streak_days: z.number().min(0),
  last_action_date: z.string().nullable(),
  level_achievements: z.record(z.string(), z.string()).nullable(), // JSONB: key: string, value: string
  milestone_flags: z.record(z.string(), z.boolean()).nullable(), // JSONB: key: string, value: boolean
  created_at: z.string(),
  updated_at: z.string(),
})

export const LevelInfoSchema = z.object({
  level: z.number(),
  name: z.string(),
  emoji: z.string(),
  required_points: z.number(),
  next_level_points: z.number().optional(),
})

// レベルアップ報酬用（ゲーミフィケーション）
export const LevelUpRewardSchema = z.object({
  old_level: z.number(),
  new_level: z.number(),
  points_gained: z.number(),
  reward_message: z.string(),
  unlocked_features: z.array(z.string()).optional(),
})

// ポイント獲得イベント用
export const PointEventSchema = z.object({
  event_type: z.enum([
    'anger_log_created',
    'consultation_completed',
    'streak_bonus',
    'milestone_achieved',
  ]),
  points_gained: z.number(),
  description: z.string(),
})

// 型エクスポート
export type CalmingPoint = z.infer<typeof CalmingPointAPIResponseSchema>
export type LevelInfo = z.infer<typeof LevelInfoSchema>
export type LevelUpReward = z.infer<typeof LevelUpRewardSchema>
export type PointEvent = z.infer<typeof PointEventSchema>
