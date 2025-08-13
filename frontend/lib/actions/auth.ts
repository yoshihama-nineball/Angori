'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// 型定義を追加
interface AuthState {
  success: boolean
  message: string
  errors?: Record<string, string[]>
  shouldRedirect?: boolean
}

// バリデーションスキーマ
const RegisterSchema = z
  .object({
    name: z
      .string()
      .min(1, 'ユーザー名を入力してください')
      .max(50, 'ユーザー名は50文字以内で入力してください'),
    email: z.string().email('有効なメールアドレスを入力してください'),
    password: z
      .string()
      .min(8, 'パスワードは8文字以上で入力してください')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'パスワードは大文字、小文字、数字を含む必要があります'
      ),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'パスワードが一致しません',
    path: ['password_confirmation'],
  })

const LoginSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードを入力してください'),
})

export async function registerUser(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  try {
    // デバッグ用ログ
    console.log('🔍 Register attempt started')
    console.log('FormData:', Object.fromEntries(formData))

    const validatedFields = RegisterSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      password_confirmation: formData.get('password_confirmation'),
    })

    if (!validatedFields.success) {
      console.log(
        '❌ Validation failed:',
        validatedFields.error.flatten().fieldErrors
      )
      return {
        success: false,
        message: 'バリデーションエラーが発生しました',
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    console.log('✅ Validation passed, sending to API...')

    const response = await fetch(`${API_BASE}/api/v1/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: validatedFields.data,
      }),
    })

    console.log('📡 API Response status:', response.status)
    const data = await response.json()
    console.log('📡 API Response data:', data)

    if (response.ok) {
      console.log('🎉 Registration successful!')
      // JWTトークンがあれば保存
      const authToken = response.headers.get('Authorization')
      if (authToken) {
        ;(await cookies()).set('auth_token', authToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7, // 7日間
        })
      }

      // 成功の場合は特別なフラグを立てて、クライアントサイドでリダイレクト
      return {
        success: true,
        message: '🎉 登録が完了しました！',
        shouldRedirect: true,
      }
    }

    console.log('❌ Registration failed:', data.message)
    return {
      success: false,
      message: data.message || '登録に失敗しました',
      errors: data.errors,
    }
  } catch (error) {
    console.error('Registration error:', error)
    return {
      success: false,
      message: 'サーバーエラーが発生しました',
    }
  }
}

export async function loginUser(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  try {
    const validatedFields = LoginSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    })

    if (!validatedFields.success) {
      return {
        success: false,
        message: 'バリデーションエラーが発生しました',
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }

    const response = await fetch(`${API_BASE}/api/v1/users/sign_in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: validatedFields.data,
      }),
    })

    const data = await response.json()

    if (response.ok) {
      // JWTトークンがあれば保存
      const authToken = response.headers.get('Authorization')
      if (authToken) {
        ;(await cookies()).set('auth_token', authToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7, // 7日間
        })
      }

      // 成功時はダッシュボードにリダイレクト
      redirect('/dashboard')
    }

    return {
      success: false,
      message: data.message || 'ログインに失敗しました',
    }
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      message: 'サーバーエラーが発生しました',
    }
  }
}

export async function logoutUser() {
  try {
    // クッキーを削除
    ;(
      await // クッキーを削除
      cookies()
    ).delete('auth_token')

    // ログインページにリダイレクト
    redirect('/auth/login')
  } catch (error) {
    console.error('Logout error:', error)
    return {
      success: false,
      message: 'ログアウトに失敗しました',
    }
  }
}
