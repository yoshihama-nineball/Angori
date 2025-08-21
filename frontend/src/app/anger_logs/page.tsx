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

  useEffect(() => {
    const fetchAngerLogs = async () => {
      try {
        setLoading(true)
        const response = await getAngerLogs()

        if (response.errors && response.errors.length > 0) {
          setError(response.errors)
        } else {
          setAngerLogs(response.anger_logs || [])
          setError([])
        }
      } catch (err) {
        setError(['データの取得に失敗しました'])
        console.error('Failed to fetch anger logs:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAngerLogs()
  }, [])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pb: 4,
      }}
    >
      <Container maxWidth="xl" sx={{ pt: 3, px: { xs: 2, sm: 3 } }}>
        {/* メインコンテンツ */}
        <AngerLogsList angerLogs={angerLogs} loading={loading} error={error} />
      </Container>
    </Box>
  )
}

export default LogsPage