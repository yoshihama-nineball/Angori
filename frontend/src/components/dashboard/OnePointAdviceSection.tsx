import React from 'react'
import { Typography, Alert, AlertTitle } from '@mui/material'
import { TipsAndUpdates } from '@mui/icons-material'

const OnePointAdviceSection: React.FC = () => {
  // 仮データ（実際はAPIから取得）
  const todayAdvice = {
    title: '今日のアドバイス',
    content:
      '怒りを感じたときは、まず深呼吸をして6秒間待ってみましょう。脳科学的に、怒りのピークは6秒間続くとされており、その時間を乗り越えることで冷静な判断ができるようになります。',
  }

  return (
    <Alert
      icon={<TipsAndUpdates />}
      severity="info"
      sx={{
        my: 4,
        backgroundColor: '#e3f2fd',
        border: '1px solid #2196f3',
        borderRadius: 3,
        '& .MuiAlert-icon': {
          color: '#1976d2',
        },
      }}
    >
      <AlertTitle sx={{ fontWeight: 'bold', color: '#1976d2', mb: 1 }}>
        {todayAdvice.title}
      </AlertTitle>
      <Typography
        variant="body2"
        sx={{
          color: '#333',
          lineHeight: 1.6,
          fontSize: '0.95rem',
        }}
      >
        {todayAdvice.content}
      </Typography>
    </Alert>
  )
}

export default OnePointAdviceSection
