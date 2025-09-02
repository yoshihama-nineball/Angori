'use client'

import React from 'react'
import AuthGuard from '@/components/auth/AuthGuard'
import { CounselingLayout } from '@/components/counseling/CounselingLayout'

const CounselingPage = () => {
  return (
    <AuthGuard>
      <CounselingLayout />
    </AuthGuard>
  )
}

export default CounselingPage
