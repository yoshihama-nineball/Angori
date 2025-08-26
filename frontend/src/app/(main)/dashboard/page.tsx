'use client'

import React, { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import { AngerLog } from '@/schemas/anger_log'
import AuthGuard from '@/components/auth/AuthGuard'
import { getAngerLogs } from '../../../../lib/api/anger_log'
import WelcomeSection from '@/components/dashboard/WelcomeSection'
import PointsDisplay from '@/components/dashboard/PointsDisplay'
import RecentAngerLogsSection from '@/components/dashboard/RecentAngerLogsSection'
import OnePointAdviceSection from '@/components/dashboard/OnePointAdviceSection'

const TopPage: React.FC = () => {
  const [recentAngerLogs, setRecentAngerLogs] = useState<AngerLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string[]>([])

  // ユーザーのポイント（仮データ）
  const userPoints = 1250

  useEffect(() => {
    const fetchRecentLogs = async () => {
      try {
        setLoading(true)
        const response = await getAngerLogs(undefined)

        if (response.errors && response.errors.length > 0) {
          setError(response.errors)
          setRecentAngerLogs([])
        } else {
          setRecentAngerLogs((response.anger_logs || []).slice(0, 3))
          setError([])
        }
      } catch {
        setError(['データの取得に失敗しました'])
      } finally {
        setLoading(false)
      }
    }

    fetchRecentLogs()
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
                flex: { lg: '0 0 400px' },
                width: { xs: '100%', lg: '400px' },
              }}
            >
              <PointsDisplay points={userPoints} />
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
          <OnePointAdviceSection />
        </Box>
      </Box>
    </AuthGuard>
  )
}

export default TopPage
