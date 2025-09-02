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

export const getAuthToken = (): string | null => {
  if (typeof document === 'undefined') return null

  const cookies = document.cookie.split(';')

  const authCookie = cookies.find((cookie) =>
    cookie.trim().startsWith('auth_token=')
  )

  if (authCookie) {
    const token = authCookie.split('=')[1]

    if (token && token.startsWith('Bearer ')) {
      return token
    } else {
      return `Bearer ${token}`
    }
  }
  return null
}

export async function registerUser(data: RegisterData): Promise<ApiResponse> {
  try {
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

    const responseText = await response.text()

    let apiData
    try {
      apiData = JSON.parse(responseText)
    } catch {
      // プレーンテキストのエラーメッセージを処理
      if (!response.ok && responseText.trim()) {
        if (response.status === 422) {
          return {
            errors: ['入力内容に問題があります。各項目をご確認ください。'],
            success: '',
          }
        }

        return {
          errors: [
            '登録処理中にエラーが発生しました。しばらく時間をおいて再度お試しください。',
          ],
          success: '',
        }
      }

      if (
        responseText.includes('<html') ||
        responseText.includes('<!DOCTYPE')
      ) {
        return {
          errors: [
            'サーバーエラーが発生しました。管理者にお問い合わせください。',
          ],
          success: '',
        }
      }

      return {
        errors: [
          'サーバーエラーが発生しました。しばらく時間をおいて再度お試しください。',
        ],
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
        success: '🎉 登録が完了しました！ダッシュボードにリダイレクトします...',
      }
    }

    // エラーレスポンスの処理を改善
    const errorMessages: string[] = []

    if (apiData.message) {
      errorMessages.push(apiData.message)
    }

    if (apiData.errors) {
      if (Array.isArray(apiData.errors)) {
        errorMessages.push(...apiData.errors)
      } else if (typeof apiData.errors === 'object') {
        Object.entries(apiData.errors).forEach(([field, fieldErrors]) => {
          if (Array.isArray(fieldErrors)) {
            const fieldName = getFieldNameInJapanese(field)
            fieldErrors.forEach((error: string) => {
              errorMessages.push(`${fieldName}: ${error}`)
            })
          }
        })
      }
    }

    if (response.status === 422) {
      return {
        errors:
          errorMessages.length > 0
            ? errorMessages
            : ['入力内容に問題があります。各項目をご確認ください。'],
        success: '',
      }
    }

    if (response.status === 409) {
      return {
        errors: ['このメールアドレスは既に登録されています。'],
        success: '',
      }
    }

    return {
      errors:
        errorMessages.length > 0
          ? errorMessages
          : ['登録に失敗しました。しばらく時間をおいて再度お試しください。'],
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
      // プレーンテキストのエラーメッセージを処理
      if (response.status === 401 && responseText.trim()) {
        let errorMessage = responseText.trim()

        // 英語のメッセージを日本語に変換
        if (errorMessage === 'Invalid Email or password.') {
          errorMessage = 'メールアドレスまたはパスワードが正しくありません'
        }

        return {
          errors: [errorMessage],
          success: '',
        }
      }

      if (
        responseText.includes('<html') ||
        responseText.includes('<!DOCTYPE')
      ) {
        return {
          errors: [
            'サーバーエラーが発生しました。管理者にお問い合わせください。',
          ],
          success: '',
        }
      }

      return {
        errors: [
          'サーバーエラーが発生しました。しばらく時間をおいて再度お試しください。',
        ],
        success: '',
      }
    }

    if (response.ok) {
      let authToken = response.headers.get('Authorization')

      if (!authToken) {
        try {
          const directResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user: validatedFields.data,
            }),
          })

          const directToken =
            directResponse.headers.get('authorization') ||
            directResponse.headers.get('Authorization')

          if (directToken) {
            authToken = directToken
          }
        } catch {}
      }

      if (authToken) {
        document.cookie = `auth_token=${authToken}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=strict`
      }
      return {
        errors: [],
        success: '🎉 ログインしました！ダッシュボードにリダイレクトします...',
      }
    }

    if (response.status === 401) {
      return {
        errors: [
          apiData.message || 'メールアドレスまたはパスワードが正しくありません',
        ],
        success: '',
      }
    }

    return {
      errors: [
        apiData.message ||
          'ログイン情報が正しくありません。入力内容をご確認ください。',
      ],
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

// フィールド名を日本語に変換するヘルパー関数
function getFieldNameInJapanese(field: string): string {
  const fieldMap: { [key: string]: string } = {
    email: 'メールアドレス',
    password: 'パスワード',
    password_confirmation: 'パスワード(確認)',
    name: 'ユーザー名',
  }

  return fieldMap[field] || field
}

export async function logoutUser(): Promise<ApiResponse> {
  try {
    document.cookie = 'auth_token=; path=/; max-age=0; samesite=strict'

    return {
      errors: [],
      success: 'ログアウトしました',
    }
  } catch {
    return {
      errors: [],
      success: 'ログアウトしました',
    }
  }
}
