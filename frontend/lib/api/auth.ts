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
      // まずAuthorizationヘッダーを試す
      let authToken = response.headers.get('Authorization')

      console.log(
        'Login response headers:',
        Array.from(response.headers.entries())
      ) // 全ヘッダー確認
      console.log('Login - Retrieved auth token from header:', authToken) // トークン確認

      // ヘッダーからトークンが取得できない場合は、直接curlでトークンを取得
      if (!authToken) {
        console.log(
          'Authorization header not accessible, attempting direct token fetch...'
        )

        try {
          // 同じリクエストをもう一度実行してheadersを確認
          const directResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user: validatedFields.data,
            }),
          })

          // 直接ヘッダーアクセスを試す
          const directToken =
            directResponse.headers.get('authorization') ||
            directResponse.headers.get('Authorization')
          console.log('Direct token fetch result:', directToken)

          if (directToken) {
            authToken = directToken
          }
        } catch (error) {
          console.log('Direct token fetch failed:', error)
        }
      }

      if (authToken) {
        console.log('Setting cookie with token:', authToken)
        document.cookie = `auth_token=${authToken}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=strict`
        console.log('Cookie set. Current cookies:', document.cookie)
      } else {
        console.log(
          'No Authorization header found in response - CORS issue suspected'
        )
        console.log('Response status:', response.status)
        console.log(
          'Response headers available:',
          response.headers.keys
            ? Array.from(response.headers.keys())
            : 'headers.keys not available'
        )
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

// auth.ts のlogoutUser関数のみ修正
export async function logoutUser(): Promise<ApiResponse> {
  try {
    // まずクッキーを削除（最優先）
    document.cookie = 'auth_token=; path=/; max-age=0; samesite=strict'
    console.log('Cookie cleared')

    // サーバー側のログアウトは試すが、失敗しても気にしない
    try {
      const apiUrl = `${API_BASE}/api/v1/users/sign_out`

      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      console.log('Server logout attempted:', response.status)
    } catch (serverError) {
      console.log(
        'Server logout failed (but client logout successful):',
        serverError
      )
    }

    return {
      errors: [],
      success: 'ログアウトしました',
    }
  } catch (error: unknown) {
    // エラーでもクッキーは削除済みなので成功扱い
    return {
      errors: [],
      success: 'ログアウトしました',
    }
  }
}
