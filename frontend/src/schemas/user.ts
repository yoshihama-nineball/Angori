import { z } from 'zod'

export const RegisterSchema = z
  .object({
    email: z
      .string()
      .min(1, 'メールアドレスは必須です')
      .email('有効なメールアドレスを入力してください'),
    name: z
      .string()
      .min(1, 'ユーザー名は必須です')
      .max(50, 'ユーザー名は50文字以内で入力してください'),
    password: z
      .string()
      .min(8, 'パスワードは8文字以上で入力してください')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'パスワードは少なくとも1つの大文字、小文字、数字を含む必要があります'
      ),
    password_confirmation: z.string().min(1, 'パスワード(確認)は必須です'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'パスワードが一致しません',
    path: ['password_confirmation'],
  })

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, 'メールアドレスは必須です')
    .email('有効なメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードは必須です'),
})

export const UserAPIResponseSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  google_image_url: z.string().optional(),
})

// 型エクスポート
export type RegisterFormValues = z.infer<typeof RegisterSchema>
export type LoginFormValues = z.infer<typeof LoginSchema>
export type User = z.infer<typeof UserAPIResponseSchema>
