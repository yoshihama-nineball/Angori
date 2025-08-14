'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CircularProgress, Box } from '@mui/material'
import { useAuthStore } from '../../../lib/stores/authStore'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, initialize } = useAuthStore()
  const router = useRouter()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const initAuth = async () => {
      await initialize()
      setIsInitialized(true)
    }
    initAuth()
  }, [initialize])

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isInitialized, router])

  // 初期化完了前はローディング表示
  if (!isInitialized) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  // 初期化完了後、未認証の場合もローディング表示（リダイレクト中）
  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return <>{children}</>
}
