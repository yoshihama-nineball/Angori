import AuthGuard from '@/components/auth/AuthGuard'
import React from 'react'

const DashboardPage = () => {
  return <AuthGuard>ダッシュボード画面</AuthGuard>
}

export default DashboardPage
