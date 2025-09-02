import { WiseSaying, WiseSayingAPIResponseSchema } from '@/schemas/wise_saying'
import { getAuthToken } from './auth'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export async function getRecommendedWiseSaying(): Promise<{
  wise_saying?: WiseSaying
  errors?: string[]
}> {
  try {
    const authToken = getAuthToken()
    if (!authToken) {
      return { errors: ['認証が必要です'] }
    }

    const response = await fetch(
      `${API_BASE}/api/v1/wise_sayings/recommend_for_user`,
      {
        method: 'GET',
        headers: {
          Authorization: authToken,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      return { errors: ['アドバイス情報の取得に失敗しました'] }
    }

    const responseText = await response.text()
    let apiData
    try {
      apiData = JSON.parse(responseText)
    } catch {
      return { errors: ['サーバーからの応答が正しくありません'] }
    }

    const validatedResponse = WiseSayingAPIResponseSchema.safeParse(apiData)
    if (!validatedResponse.success) {
      return { errors: ['データ形式が正しくありません'] }
    }

    return { wise_saying: validatedResponse.data }
  } catch (error) {
    return {
      errors: [
        `ネットワークエラー: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ],
    }
  }
}
