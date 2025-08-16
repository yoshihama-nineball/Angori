export type QuestionType = 'text' | 'select' | 'emotion' | 'rating' | 'datetime'

export interface Message {
  id: string
  content: string
  sender: 'user' | 'gorilla'
  timestamp: Date
  questionType?: QuestionType
  options?: string[]
}

export interface QuestionData {
  id: string
  content: string
  type: QuestionType
  options?: string[]
  field: keyof AngerLogFormData // どのフィールドに対応するかを明示
}

// チャットで収集するデータ（CreateAngerLogSchemaに対応）
export interface AngerLogFormData {
  occurred_at: string // 発生日時
  location: string // 場所
  situation_description: string // 状況説明（事実）
  perception: string // 認知・解釈（situation_descriptionに含める）
  emotions_felt: Record<string, boolean> // 感情（JSONB形式）
  anger_level: number // 怒りレベル（1-10）
  trigger_words: string // トリガー
  reflection: string // 振り返り
}
