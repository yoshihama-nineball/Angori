'use server'

import { z } from 'zod'
import { cookies } from 'next/headers'

// Docker環境に対応した設定
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://backend:5000'

// デバッグ用ログ
console.log(
  '🐛 Debug - process.env.NEXT_PUBLIC_API_URL:',
  process.env.NEXT_PUBLIC_API_URL
)
console.log('🐛 Debug - API_BASE:', API_BASE)

// 型定義をシンプルに
type ActionStateType = {
  errors: string[]
  success: string
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
  prevState: ActionStateType,
  formData: FormData
): Promise<ActionStateType> {
  try {
    console.log('🔍 Register attempt started')
    console.log('📊 API_BASE:', API_BASE)

    const registerData = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      password_confirmation: formData.get('password_confirmation'),
    }

    console.log('📊 Register data:', registerData)

    // バリデーション
    const validatedFields = RegisterSchema.safeParse(registerData)
    if (!validatedFields.success) {
      const errors = validatedFields.error.issues.map((issue) => issue.message)
      console.log('❌ Validation failed:', errors)
      return {
        errors,
        success: '',
      }
    }

    // 正しいURL構築 - API_BASEにapi/v1を含めない
    const apiUrl = `${API_BASE}/api/v1/users`
    console.log('📡 Calling API:', apiUrl)

    // API呼び出し
    const response = await fetch(apiUrl, {
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
        const cookieStore = await cookies()
        cookieStore.set('auth_token', authToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7, // 7日間
        })
      }
      return {
        errors: [],
        success: '🎉 登録が完了しました！ダッシュボードにリダイレクトします...',
      }
    }

    // エラーレスポンスの処理
    console.log('❌ Registration failed:', data.message)
    const errorMessages = []

    if (data.message) {
      errorMessages.push(data.message)
    }

    if (data.errors) {
      if (Array.isArray(data.errors)) {
        errorMessages.push(...data.errors)
      } else if (typeof data.errors === 'object') {
        Object.values(data.errors).forEach((errorArray: any) => {
          if (Array.isArray(errorArray)) {
            errorMessages.push(...errorArray)
          }
        })
      }
    }

    return {
      errors: errorMessages.length > 0 ? errorMessages : ['登録に失敗しました'],
      success: '',
    }
  } catch (error: any) {
    console.error('❌ Registration error details:', error)
    console.error('❌ Error message:', error?.message)
    console.error('❌ Error stack:', error?.stack)

    return {
      errors: [
        `サーバーエラーが発生しました: ${error?.message || 'Unknown error'}`,
      ],
      success: '',
    }
  }
}

export async function loginUser(
  prevState: ActionStateType,
  formData: FormData
): Promise<ActionStateType> {
  try {
    console.log('🔍 Login attempt started')

    const loginData = {
      email: formData.get('email'),
      password: formData.get('password'),
    }

    // バリデーション
    const validatedFields = LoginSchema.safeParse(loginData)
    if (!validatedFields.success) {
      const errors = validatedFields.error.issues.map((issue) => issue.message)
      console.log('❌ Validation failed:', errors)
      return {
        errors,
        success: '',
      }
    }

    console.log('✅ Validation passed, sending to API...')

    // 正しいURL構築
    const apiUrl = `${API_BASE}/api/v1/users/sign_in`
    console.log('📡 Full API URL:', apiUrl)

    // API呼び出し
    const response = await fetch(apiUrl, {
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
      console.log('🎉 Login successful!')

      // JWTトークンがあれば保存
      const authToken = response.headers.get('Authorization')
      if (authToken) {
        const cookieStore = await cookies()
        cookieStore.set('auth_token', authToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7, // 7日間
        })
      }

      return {
        errors: [],
        success: '🎉 ログインしました！ダッシュボードにリダイレクトします...',
      }
    }

    // エラーレスポンスの処理
    console.log('❌ Login failed:', data.message)
    return {
      errors: [data.message || 'ログインに失敗しました'],
      success: '',
    }
  } catch (error: any) {
    console.error('❌ Login error details:', error)
    console.error('❌ Error message:', error?.message)

    return {
      errors: [
        `サーバーエラーが発生しました: ${error?.message || 'Unknown error'}`,
      ],
      success: '',
    }
  }
}
