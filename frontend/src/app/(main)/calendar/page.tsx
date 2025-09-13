'use client'

import React from 'react'
import { Box, Typography } from '@mui/material'
import { CalendarMonth } from '@mui/icons-material'
import AuthGuard from '@/components/auth/AuthGuard'
import AngerLogCalendar from '@/components/calendar/AngerLogCalendar'

export default function CalendarPage() {
  return (
    <AuthGuard>
      <Box sx={{ py: { xs: 2, sm: 3 }, width: '100%' }}>
        {/* ページヘッダー */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, sm: 2 },
            mb: { xs: 2, sm: 3 },
            flexWrap: 'wrap',
            justifyContent: 'center',
            px: 2,
          }}
        >
          <CalendarMonth
            sx={{
              fontSize: { xs: '1.5rem', sm: '2rem' },
              color: 'primary.main',
            }}
          />
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontSize: { xs: '1.5rem', sm: '2rem' },
              }}
            >
              相談履歴カレンダー
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}
            >
              過去の相談記録をカレンダー形式で確認できるウホ。日付をクリックして記録を振り返ってみよう！。
            </Typography>
          </Box>
        </Box>

        {/* カレンダーコンポーネント */}
        <AngerLogCalendar />
      </Box>
    </AuthGuard>
  )
}
