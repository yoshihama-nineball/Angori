'use client'

import React, { useEffect, useRef } from 'react'
import { Box } from '@mui/material'
import { MessageBubble } from './MessageBubble'
import { LoadingMessage } from './LoadingMessage'
import { useCounselingStore } from '../../../lib/stores/counselingStore'

export const ChatContainer = () => {
  const { messages, isLoading } = useCounselingStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 自動スクロール
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    // 初期メッセージ（1個）の場合はスクロールしない
    if (messages.length > 1) {
      scrollToBottom()
    }
  }, [messages])

  return (
    <Box
      sx={{
        height: '100%',
        overflowY: 'auto',
        p: 2,
        paddingBottom: '200px',
        // スクロールバーを右端に
        width: '100%',
        maxWidth: '100%',
        '&::-webkit-scrollbar': {
          width: '8px',
        },
        // 以下は既存のまま
      }}
    >
      {/* メッセージ内容 */}
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isLoading && <LoadingMessage />}

      <div ref={messagesEndRef} />
    </Box>
  )
}
