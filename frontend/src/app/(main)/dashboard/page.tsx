'use client'

import React, { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import { AngerLog } from '@/schemas/anger_log'
import { getAngerLogs } from '../../../../lib/api/anger_log'
import WelcomeSection from '@/components/dashboard/WelcomeSection'
import PointsDisplay from '@/components/dashboard/PointsDisplay'
import RecentAngerLogsSection from '@/components/dashboard/RecentAngerLogsSection'
import OnePointAdviceSection from '@/components/dashboard/OnePointAdviceSection'
import { CalmingPoint } from '@/schemas/calming_point'
import { getCalmingPoints } from '../../../../lib/api/calming_points'
import AuthGuard from '@/components/auth/AuthGuard'

const TopPage: React.FC = () => {
  const [recentAngerLogs, setRecentAngerLogs] = useState<AngerLog[]>([])
  const [calmingPoints, setCalmingPoints] = useState<CalmingPoint | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // 並列でデータ取得
        const [logsResponse, pointsResponse] = await Promise.all([
          getAngerLogs(undefined),
          getCalmingPoints(),
        ])
        // アンガーログの処理
        if (logsResponse.errors?.length) {
          setError(logsResponse.errors)
          setRecentAngerLogs([])
        } else {
          setRecentAngerLogs((logsResponse.anger_logs || []).slice(0, 3))
          setError([])
        }

        // ポイントの処理
        if (pointsResponse.errors?.length) {
          // ポイントエラーはアンガーログ表示に影響させない
        } else if (pointsResponse.calming_points) {
          setCalmingPoints(pointsResponse.calming_points)
        }
      } catch {
        setError(['データの取得に失敗しました'])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <AuthGuard>
      <Box
        sx={{
          minHeight: '100vh',
          pb: 4,
          ml: { xs: 0, md: '240px' },
          width: {
            xs: '100%',
            md: 'calc(100% - 240px)',
          },
          boxSizing: 'border-box',
        }}
      >
        <Box
          sx={{
            p: { xs: 2, md: 3 },
            maxWidth: '1200px',
            mx: 'auto',
          }}
        >
          {/* 相談室への導線ボタン */}
          <WelcomeSection />

          {/* メインコンテンツエリア - 落ち着きポイント（ポイント数）と最近のアンガーログ */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', lg: 'row' },
              gap: { xs: 3, lg: 4 },
              mb: 4,
            }}
          >
            {/* 落ち着きポイント（ポイント数表示） */}
            <Box
              sx={{
                flex: { lg: '0 0 350px' }, // PC版での幅を350pxに制限
                width: { xs: '100%', lg: '350px' }, // スマホは100%、PCは350px
              }}
            >
              <PointsDisplay
                points={calmingPoints?.total_points || 0}
                level={calmingPoints?.current_level || 1}
                levelName="修行中ゴリラ 🦍🧘" // 一時的に固定値
                streakDays={calmingPoints?.streak_days || 0}
                pointsToNextLevel={25} // 一時的に固定値
                nextLevelPoints={400} // 一時的に固定値
              />
            </Box>

            {/* 最近のアンガーログ（3件） */}
            <Box
              sx={{
                flex: { lg: 1 },
                width: { xs: '100%', lg: 'auto' },
              }}
            >
              <RecentAngerLogsSection
                angerLogs={recentAngerLogs}
                loading={loading}
                error={error}
              />
            </Box>
          </Box>

          {/* 今日のアドバイス（青い1件のみ） */}
          <Box sx={{ mb: 3 }}>
            <OnePointAdviceSection />
          </Box>
        </Box>
      </Box>
    </AuthGuard>
  )
}

export default TopPage
