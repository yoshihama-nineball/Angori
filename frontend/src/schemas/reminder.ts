import { z } from 'zod'

export const CreateReminderSchema = z.object({
  title: z
    .string()
    .min(1, 'タイトルは必須です')
    .max(100, 'タイトルは100文字以内で入力してください'),
  message: z
    .string()
    .min(1, 'メッセージは必須です')
    .max(500, 'メッセージは500文字以内で入力してください'),
  reminder_category: z.enum(
    [
      'breathing',
      'meditation',
      'exercise',
      'relaxation',
      'mindfulness',
      'positive_thinking',
      'gratitude',
      'self_care',
      'music',
      'nature',
      'water_intake',
      'reflection',
      'daily_log',
      'consultation',
    ],
    {
      message: 'リマインダーカテゴリは指定された選択肢から選択してください',
    }
  ),
  schedule_time: z
    .string()
    .regex(
      /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
      '時刻は HH:MM 形式で入力してください'
    ),
  days_of_week: z.array(z.number().min(0).max(6)),
  is_active: z.boolean().default(true),
})

export const UpdateReminderSchema = CreateReminderSchema.partial()

export const ReminderAPIResponseSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  title: z.string(),
  message: z.string(),
  reminder_category: z
    .enum([
      'breathing',
      'meditation',
      'exercise',
      'relaxation',
      'mindfulness',
      'positive_thinking',
      'gratitude',
      'self_care',
      'music',
      'nature',
      'water_intake',
      'reflection',
      'daily_log',
      'consultation',
    ])
    .nullable(), // migration で null 許可に対応
  schedule_time: z.string(),
  days_of_week: z.array(z.number()),
  is_active: z.boolean(),
  last_sent_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
})

export const RemindersAPIResponseSchema = z.object({
  reminders: z.array(ReminderAPIResponseSchema),
  total: z.number().optional(),
})

// リマインダー効果測定用
export const ReminderEffectivenessSchema = z.object({
  reminder_id: z.number(),
  effectiveness_rating: z.number().min(1).max(5),
  user_feedback: z.string().max(200).optional(),
})

// 型エクスポート
export type CreateReminderData = z.infer<typeof CreateReminderSchema>
export type UpdateReminderData = z.infer<typeof UpdateReminderSchema>
export type Reminder = z.infer<typeof ReminderAPIResponseSchema>
export type RemindersResponse = z.infer<typeof RemindersAPIResponseSchema>
export type ReminderEffectivenessData = z.infer<
  typeof ReminderEffectivenessSchema
>
