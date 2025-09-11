'use client'

import React from 'react'
import { Box } from '@mui/material'
import AngerTrendMap from '@/components/analyze/AngerTrendMap'
import AuthGuard from '@/components/auth/AuthGuard'

export default function AnalyzePage() {
  return (
    <AuthGuard>
      <Box>
        <AngerTrendMap />
      </Box>
    </AuthGuard>
  )
}
