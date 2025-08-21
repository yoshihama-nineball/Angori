'use client'

import React, { useState, useEffect } from 'react'
import { Box, Container } from '@mui/material'
import { AngerLog } from '@/schemas/anger_log'
import AngerLogsList from '@/components/anger_logs/AngerLogsList'
import { getAngerLogs } from '../../../lib/api/anger_log'

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
    <Box sx={{ minHeight: '100vh', pb: 4 }}>
      <Container maxWidth="xl" sx={{ pt: 3, px: { xs: 2, sm: 3 } }}>
        <AngerLogsList
          angerLogs={angerLogs}
          loading={loading}
          error={error}
          searchKeyword={searchKeyword}
          onSearchChange={setSearchKeyword} // 検索変更ハンドラを渡す
        />
      </Container>
    </Box>
  )
}

export default LogsPage
