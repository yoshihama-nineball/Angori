'use client'

import React, { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import { AngerLog } from '@/schemas/anger_log'
import AngerLogsList from '@/components/anger_logs/AngerLogsList'
import { getAngerLogs } from '../../../lib/api/anger_log'
import AuthGuard from '@/components/auth/AuthGuard'

const LogsPage: React.FC = () => {
  const [angerLogs, setAngerLogs] = useState<AngerLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string[]>([])
  const [searchKeyword, setSearchKeyword] = useState('') // 検索状態を追加

  useEffect(() => {
    const fetchAngerLogs = async () => {
      try {
        setLoading(true)
        // 検索キーワードをAPIに渡す
        const response = await getAngerLogs(searchKeyword.trim() || undefined)

        if (response.errors && response.errors.length > 0) {
          setError(response.errors)
          setAngerLogs([])
        } else {
          setAngerLogs(response.anger_logs || [])
          setError([])
        }
      } catch {
        setError(['データの取得に失敗しました'])
      } finally {
        setLoading(false)
      }
    }

    // デバウンス処理
    const timeoutId = setTimeout(
      () => {
        fetchAngerLogs()
      },
      searchKeyword ? 300 : 0
    )

    return () => clearTimeout(timeoutId)
  }, [searchKeyword]) // searchKeyword の変更を監視

  return (
    <AuthGuard>
      <Box
        sx={{
          minHeight: '100vh',
          pb: 4,
          ml: { xs: 0, md: '240px' }, // スマホは0、PC以上は240px
          p: 3,
          width: {
            xs: '100%',
            md: 'calc(100% - 240px)',
          },
          boxSizing: 'border-box',
        }}
      >
        <AngerLogsList
          angerLogs={angerLogs}
          loading={loading}
          error={error}
          searchKeyword={searchKeyword}
          onSearchChange={setSearchKeyword}
        />
      </Box>
    </AuthGuard>
  )
}

export default LogsPage
