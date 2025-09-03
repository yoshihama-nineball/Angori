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

// Googleログイン用の関数
export async function googleLogin(): Promise<ApiResponse> {
  return new Promise((resolve) => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
    
    // ポップアップウィンドウを開く
    const popup = window.open(
      `${API_BASE}/api/v1/users/auth/google_oauth2`,
      'google-oauth',
      'width=500,height=600,scrollbars=yes,resizable=yes'
    )

    if (!popup) {
      resolve({
        errors: ['ポップアップがブロックされました。ポップアップを許可してください。'],
        success: '',
      })
      return
    }

    // ポップアップの監視
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed)
        
        // ポップアップが閉じられた場合の処理
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')
        const success = urlParams.get('success')
        const error = urlParams.get('error')

        if (success === 'true' && token) {
          // トークンをクッキーに保存
          document.cookie = `auth_token=Bearer ${token}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=strict`
          
          resolve({
            errors: [],
            success: 'Googleログインが完了しました！ダッシュボードにリダイレクトします...',
          })
        } else {
          let errorMessage = 'Googleログインに失敗しました。'
          
          switch (error) {
            case 'login_failed':
              errorMessage = 'ログインに失敗しました。再度お試しください。'
              break
            case 'oauth_failed':
              errorMessage = 'Google認証に失敗しました。'
              break
            case 'server_error':
              errorMessage = 'サーバーエラーが発生しました。しばらく時間をおいて再度お試しください。'
              break
          }
          
          resolve({
            errors: [errorMessage],
            success: '',
          })
        }
      }
    }, 1000)

    // メッセージ受信の監視
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin && 
          event.origin !== API_BASE) {
        return
      }

      if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        clearInterval(checkClosed)
        popup.close()
        window.removeEventListener('message', handleMessage)
        
        if (event.data.token) {
          document.cookie = `auth_token=Bearer ${event.data.token}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=strict`
        }
        
        resolve({
          errors: [],
          success: 'Googleログインが完了しました！ダッシュボードにリダイレクトします...',
        })
      } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
        clearInterval(checkClosed)
        popup.close()
        window.removeEventListener('message', handleMessage)
        
        resolve({
          errors: [event.data.error || 'Googleログインに失敗しました。'],
          success: '',
        })
      }
    }

    window.addEventListener('message', handleMessage)

    // タイムアウト処理
    setTimeout(() => {
      if (!popup.closed) {
        popup.close()
        clearInterval(checkClosed)
        window.removeEventListener('message', handleMessage)
        resolve({
          errors: ['ログインがタイムアウトしました。再度お試しください。'],
          success: '',
        })
      }
    }, 30000)
  })
}