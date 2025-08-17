import { LoginSchema, RegisterSchema } from '@/schemas/user'

// 型定義
export type ApiResponse = {
  errors: string[]
  success: string
}

export type RegisterData = {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export type LoginData = {
  email: string
  password: string
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export async function registerUser(data: RegisterData): Promise<ApiResponse> {
  try {
    // バリデーション
    const validatedFields = RegisterSchema.safeParse(data)
    if (!validatedFields.success) {
      const errors = validatedFields.error.issues.map((issue) => issue.message)
      return {
        errors,
        success: '',
      }
    }

    const apiUrl = `${API_BASE}/api/v1/users`

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: validatedFields.data,
      }),
    })

    // レスポンステキストを先に取得
    const responseText = await response.text()

    let apiData
    try {
      apiData = JSON.parse(responseText)
    } catch {
      return {
        errors: [
          'サーバーからの応答が正しくありません（HTML エラーページが返されました）',
        ],
        success: '',
      }
    }

    if (response.ok) {
      // JWTトークンを確認・保存
      const authToken = response.headers.get('Authorization')

      if (authToken) {
        // HttpOnlyクッキーとして保存（セキュア）
        document.cookie = `auth_token=${authToken}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=strict`
      } else {
      }

      return {
        errors: [],
        success: '🎉 登録が完了しました！ダッシュボードにリダイレクトします...',
      }
    }

    // エラーレスポンスの処理
    const errorMessages = []

    if (apiData.message) {
      errorMessages.push(apiData.message)
    }

    if (apiData.errors) {
      if (Array.isArray(apiData.errors)) {
        errorMessages.push(...apiData.errors)
      } else if (typeof apiData.errors === 'object') {
        Object.values(apiData.errors).forEach((errorArray: unknown) => {
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
  } catch (error: unknown) {
    return {
      errors: [
        `ネットワークエラーが発生しました: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ],
      success: '',
    }
  }
}

export async function loginUser(data: LoginData): Promise<ApiResponse> {
  try {
    const validatedFields = LoginSchema.safeParse(data)
    if (!validatedFields.success) {
      const errors = validatedFields.error.issues.map((issue) => issue.message)
      return {
        errors,
        success: '',
      }
    }

    const apiUrl = `${API_BASE}/api/v1/users/sign_in`

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: validatedFields.data,
      }),
    })

    const responseText = await response.text()
    let apiData
    try {
      apiData = JSON.parse(responseText)
    } catch {
      return {
        errors: ['サーバーからの応答が正しくありません'],
        success: '',
      }
    }

    if (response.ok) {
      const authToken = response.headers.get('Authorization')
      if (authToken) {
        document.cookie = `auth_token=${authToken}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=strict`
      }

      return {
        errors: [],
        success: '🎉 ログインしました！ダッシュボードにリダイレクトします...',
      }
    }

    return {
      errors: [apiData.message || 'ログインに失敗しました'],
      success: '',
    }
  } catch (error: unknown) {
    return {
      errors: [
        `ネットワークエラーが発生しました: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ],
      success: '',
    }
  }
}

// auth.ts に追加
export async function logoutUser(): Promise<ApiResponse> {
  try {
    const apiUrl = `${API_BASE}/api/v1/users/sign_out`

    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // クッキーを削除
    document.cookie = 'auth_token=; path=/; max-age=0; samesite=strict'

    if (response.ok) {
      return {
        errors: [],
        success: 'ログアウトしました',
      }
    }

    return {
      errors: ['ログアウトに失敗しました'],
      success: '',
    }
  } catch (error: unknown) {
    // エラーでもクッキーは削除
    document.cookie = 'auth_token=; path=/; max-age=0; samesite=strict'

    return {
      errors: [
        `ネットワークエラーが発生しました: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ],
      success: '',
    }
  }
}
