import {
  CalmingPoint,
  CalmingPointAPIResponseSchema,
} from '@/schemas/calming_point'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

const getAuthToken = (): string | null => {
  if (typeof document === 'undefined') return null
  const cookies = document.cookie.split(';')
  const authCookie = cookies.find((cookie) =>
    cookie.trim().startsWith('auth_token=')
  )
  if (authCookie) {
    const token = authCookie.split('=')[1]
    return token.startsWith('Bearer ') ? token : `Bearer ${token}`
  }
  return null
}

export async function getCalmingPoints(): Promise<{
  calming_points?: CalmingPoint
  errors?: string[]
}> {
  try {
    const authToken = getAuthToken()
    if (!authToken) {
      return { errors: ['認証が必要です'] }
    }

    const response = await fetch(`${API_BASE}/api/v1/calming_points`, {
      method: 'GET',
      headers: {
        Authorization: authToken,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return { errors: ['ポイント情報の取得に失敗しました'] }
    }

    const responseText = await response.text()
    let apiData
    try {
      apiData = JSON.parse(responseText)
    } catch {
      return { errors: ['サーバーからの応答が正しくありません'] }
    }

    const validatedResponse = CalmingPointAPIResponseSchema.safeParse(apiData)
    if (!validatedResponse.success) {
      return { errors: ['データ形式が正しくありません'] }
    }

    return { calming_points: validatedResponse.data }
  } catch (error) {
    return {
      errors: [
        `ネットワークエラー: ${error instanceof Error ? error.message : 'Unknown error'}`,
      ],
    }
  }
}
