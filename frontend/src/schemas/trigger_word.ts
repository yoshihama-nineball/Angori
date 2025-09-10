import { z } from 'zod'

export const TriggerWordSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  name: z.string(),
  count: z.number().min(1),
  anger_level_avg: z.number().min(1.0).max(10.0),
  category: z.enum(['work', 'family', 'social', 'sensory', 'other']),
  last_triggered_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  // Rails側のメソッドも含める
  needs_attention: z.boolean(),
  frequency_level: z.string(),
  anger_severity: z.string(),
})

export const TriggerWordsAPIResponseSchema = z.object({
  trigger_words: z.array(TriggerWordSchema),
  total: z.number().optional(),
})

export const TriggerAnalysisSchema = z.object({
  top_triggers: z.array(TriggerWordSchema),
  categories: z.object({
    work: z.number(),
    family: z.number(),
    social: z.number(),
    sensory: z.number(),
    other: z.number(),
  }),
  avg_anger_level: z.number(),
})

// 型エクスポート
export type TriggerWord = z.infer<typeof TriggerWordSchema>
export type TriggerWordsResponse = z.infer<typeof TriggerWordsAPIResponseSchema>
export type TriggerAnalysis = z.infer<typeof TriggerAnalysisSchema>
