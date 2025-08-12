import { z } from 'zod'

export const CreateContactMessageSchema = z.object({
  name: z
    .string()
    .min(1, 'お名前は必須です')
    .max(100, 'お名前は100文字以内で入力してください'),
  email: z
    .string()
    .min(1, 'メールアドレスは必須です')
    .email('有効なメールアドレスを入力してください'),
  subject: z
    .string()
    .min(1, '件名は必須です')
    .max(200, '件名は200文字以内で入力してください'),
  message: z
    .string()
    .min(1, 'メッセージは必須です')
    .max(2000, 'メッセージは2000文字以内で入力してください'),
  category: z.enum(
    [
      'general',
      'general_inquiry',
      'bug_report',
      'feature_request',
      'support',
      'feedback',
    ],
    {
      message: 'カテゴリは指定された選択肢から選択してください',
    }
  ),
})

export const ContactMessageAPIResponseSchema = z.object({
  id: z.number(),
  user_id: z.number().nullable(),
  email: z.string().email(),
  name: z.string(),
  category: z
    .enum([
      'general',
      'general_inquiry',
      'bug_report',
      'feature_request',
      'support',
      'feedback',
    ])
    .nullable(), // migration で null 許可
  subject: z.string(),
  message: z.string(),
  status: z.enum(['pending', 'in_progress', 'resolved', 'closed']),
  admin_reply: z.string().nullable(),
  replied_at: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
})

export const ContactMessagesAPIResponseSchema = z.object({
  contact_messages: z.array(ContactMessageAPIResponseSchema),
  total: z.number().optional(),
})

// 管理画面用フィルター
export const ContactMessageFilterSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'resolved', 'closed']).optional(),
  category: z
    .enum([
      'general',
      'general_inquiry',
      'bug_report',
      'feature_request',
      'support',
      'feedback',
    ])
    .optional(),
  search_query: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
})

// 管理者返信用
export const AdminReplySchema = z.object({
  contact_message_id: z.number(),
  admin_reply: z
    .string()
    .min(1, '返信内容は必須です')
    .max(3000, '返信内容は3000文字以内で入力してください'),
})

// 型エクスポート
export type CreateContactMessageData = z.infer<
  typeof CreateContactMessageSchema
>
export type ContactMessage = z.infer<typeof ContactMessageAPIResponseSchema>
export type ContactMessagesResponse = z.infer<
  typeof ContactMessagesAPIResponseSchema
>
export type ContactMessageFilter = z.infer<typeof ContactMessageFilterSchema>
export type AdminReplyData = z.infer<typeof AdminReplySchema>
