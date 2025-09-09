import {
  TriggerWordsAPIResponseSchema,
  TriggerWordsResponse,
} from '@/schemas/trigger_word'

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

// TriggerWords一覧取得
export async function getTriggerWords(): Promise<
  TriggerWordsResponse & { errors?: string[] }
> {
  try {
    const authToken = getAuthToken()
    if (!authToken) {
      return {
        trigger_words: [],
        errors: ['認証が必要です。ログインしてください。'],
      }
    }

    const apiUrl = `${API_BASE}/api/v1/trigger_words`

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: authToken,
        'Content-Type': 'application/json',
      },
    })

    const responseText = await response.text()

    // 401エラーの場合は認証エラーとして処理
    if (response.status === 401) {
      return {
        trigger_words: [],
        errors: ['認証に失敗しました。再ログインしてください。'],
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
          trigger_words: [],
          errors: ['サーバーエラーが発生しました（HTMLページが返されました）'],
        }
      }

      return {
        trigger_words: [],
        errors: [
          'サーバーからの応答が正しくありません（JSON解析エラー）',
          responseText.substring(0, 200),
        ],
      }
    }

    if (response.ok) {
      const validatedResponse = TriggerWordsAPIResponseSchema.safeParse(apiData)
      if (!validatedResponse.success) {
        return {
          trigger_words: [],
          errors: ['サーバーからのデータ形式が正しくありません'],
        }
      }

      return validatedResponse.data
    }

    return {
      trigger_words: [],
      errors: [apiData.error || 'トリガーワードの取得に失敗しました'],
    }
  } catch (error) {
    return {
      trigger_words: [],
      errors: [
        `ネットワークエラーが発生しました: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ],
    }
  }
}

// カテゴリ別統計取得（オプション）
export async function getTriggerWordStats(): Promise<{
  stats?: Record<string, unknown>
  errors?: string[]
}> {
  try {
    const authToken = getAuthToken()
    if (!authToken) {
      return {
        errors: ['認証が必要です。ログインしてください。'],
      }
    }

    const apiUrl = `${API_BASE}/api/v1/trigger_words/stats`

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: authToken,
        'Content-Type': 'application/json',
      },
    })

    const responseText = await response.text()

    if (response.status === 401) {
      return {
        errors: ['認証に失敗しました。再ログインしてください。'],
      }
    }

    let apiData
    try {
      apiData = JSON.parse(responseText)
    } catch {
      return {
        errors: ['サーバーからの応答が正しくありません'],
      }
    }

    if (response.ok) {
      return { stats: apiData }
    }

    return {
      errors: [apiData.error || '統計データの取得に失敗しました'],
    }
  } catch (error: unknown) {
    return {
      errors: [
        `ネットワークエラーが発生しました: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ],
    }
  }
}
