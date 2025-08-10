'use client'
import { useEffect } from 'react'
import Alert from './Alert'
import { useMessage } from '../../../../context/MessageContext'
import { Box } from '@mui/material'

export default function FlashMessage() {
  const { message, clearMessage } = useMessage()
  
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        clearMessage()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message, clearMessage])

  if (!message || !message.text) return null

  return (
    <Box sx={{ 
      position: 'sticky', // または 'fixed'
      top: 'var(--header-height, 64px)', // ヘッダーの下に配置
      zIndex: 1300, // MUIのModalより上に表示
      width: '100%',
      px: 2 // 左右にパディング
    }}>
      <Alert severity={message.severity}>{message.text}</Alert>
    </Box>
  )
}