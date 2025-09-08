import {
  AngerLog,
  AngerLogAPIResponseSchema,
  AngerLogsAPIResponseSchema,
  AngerLogSchema,
  AngerLogsResponse,
  CreateAngerLogData,
  CreateAngerLogSchema,
} from '@/schemas/anger_log'

// 型定義
export type AngerLogApiResponse = {
  errors: string[]
  success: string
  angerLog?: AngerLog
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null

  // localStorageからトークンを取得（統一方式）
  const token = localStorage.getItem('token')
  if (token) {
    return token.startsWith('Bearer ') ? token : `Bearer ${token}`
  }

  return null
}

// AngerLog作成
export async function createAngerLog(
  data: CreateAngerLogData
): Promise<AngerLogApiResponse> {
  try {
    // バリデーション
    const validatedFields = CreateAngerLogSchema.safeParse(data)
    if (!validatedFields.success) {
      const errors = validatedFields.error.issues.map((issue) => issue.message)
      return {
        errors,
        success: '',
      }
    }

    const authToken = getAuthToken()
    if (!authToken) {
      return {
        errors: ['認証が必要です。ログインしてください。'],
        success: '',
      }
    }

    const apiUrl = `${API_BASE}/api/v1/anger_logs`

    const requestBody = {
      anger_log: validatedFields.data,
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authToken, // プレフィックスは getAuthToken() で処理済み
      },
      body: JSON.stringify(requestBody),
    })

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
      const validatedResponse = AngerLogAPIResponseSchema.safeParse(apiData)
      if (!validatedResponse.success) {
        return {
          errors: ['サーバーからのデータ形式が正しくありません'],
          success: '',
        }
      }

      return {
        errors: [],
        success: '相談記録を保存しました！AIアドバイスも生成されました。',
        angerLog: validatedResponse.data,
      }
    }

    const errorMessages = []

    if (apiData.error) {
      errorMessages.push(apiData.error)
    }

    if (apiData.errors && Array.isArray(apiData.errors)) {
      errorMessages.push(...apiData.errors)
    }

    if (apiData.details && Array.isArray(apiData.details)) {
      errorMessages.push(...apiData.details)
    }

    // Rails の標準的なエラー形式も確認
    if (apiData.message) {
      errorMessages.push(apiData.message)
    }

    return {
      errors:
        errorMessages.length > 0 ? errorMessages : ['記録の保存に失敗しました'],
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

// AngerLog一覧取得
export async function getAngerLogs(
  searchKeyword?: string
): Promise<AngerLogsResponse & { errors?: string[] }> {
  try {
    const authToken = getAuthToken()
    if (!authToken) {
      return {
        anger_logs: [],
        errors: ['認証が必要です。ログインしてください。'],
      }
    }

    const params = new URLSearchParams()
    if (searchKeyword) {
      params.append('search', searchKeyword)
    }
    params.append('per_page', '100') // この行を追加

    const apiUrl = `${API_BASE}/api/v1/anger_logs?${params.toString()}`

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: authToken, // プレフィックスは getAuthToken() で処理済み
        'Content-Type': 'application/json',
      },
    })

    const responseText = await response.text()

    // 401エラーの場合は認証エラーとして処理
    if (response.status === 401) {
      return {
        anger_logs: [],
        errors: ['認証に失敗しました。再ログインしてください。', responseText],
      }
    }

    let apiData
    try {
      apiData = JSON.parse(responseText)
    } catch {
      // HTMLエラーページかテキストレスポンスの可能性
      if (
        responseText.includes('<html') ||
        responseText.includes('<!DOCTYPE')
      ) {
        return {
          anger_logs: [],
          errors: ['サーバーエラーが発生しました（HTMLページが返されました）'],
        }
      }

      return {
        anger_logs: [],
        errors: [
          'サーバーからの応答が正しくありません（JSON解析エラー）',
          responseText.substring(0, 200),
        ],
      }
    }

    if (response.ok) {
      const validatedResponse = AngerLogsAPIResponseSchema.safeParse(apiData)
      if (!validatedResponse.success) {
        return {
          anger_logs: [],
          errors: ['サーバーからのデータ形式が正しくありません'],
        }
      }

      return validatedResponse.data
    }

    return {
      anger_logs: [],
      errors: [apiData.error || '記録の取得に失敗しました'],
    }
  } catch (error: unknown) {
    return {
      anger_logs: [],
      errors: [
        `ネットワークエラーが発生しました: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ],
    }
  }
}

// 特定のAngerLog取得
export async function getAngerLog(
  id: number
): Promise<{ angerLog?: AngerLog; errors?: string[] }> {
  try {
    const authToken = getAuthToken()
    if (!authToken) {
      return {
        errors: ['認証が必要です。ログインしてください。'],
      }
    }

    const apiUrl = `${API_BASE}/api/v1/anger_logs/${id}`

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: authToken, // プレフィックスは getAuthToken() で処理済み
        'Content-Type': 'application/json',
      },
    })

    const responseText = await response.text()

    let apiData
    try {
      apiData = JSON.parse(responseText)
    } catch {
      return {
        errors: ['サーバーからの応答が正しくありません'],
      }
    }

    if (response.ok) {
      const validatedResponse = AngerLogSchema.safeParse(apiData)
      if (!validatedResponse.success) {
        return {
          errors: ['サーバーからのデータ形式が正しくありません'],
        }
      }
      return {
        angerLog: validatedResponse.data,
      }
    }
    return {
      errors: [apiData.error || '記録の取得に失敗しました'],
    }
  } catch (error: unknown) {
    return {
      errors: [
        `ネットワークエラーが発生しました: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ],
    }
  }
}
