'use client'

import React from 'react'
import { Box, Avatar, Paper, Typography, Fade, useTheme } from '@mui/material'
import { Message } from '@/types/counseling'
import Image from 'next/image'

interface MessageBubbleProps {
  message: Message
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const theme = useTheme()

  return (
    <Fade in={true} timeout={500}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1,
            maxWidth: '80%',
            flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
          }}
        >
          <Avatar
            sx={{
              bgcolor:
                message.sender === 'user'
                  ? theme.palette.grey[100]
                  : theme.palette.gorilla.lightBanana,
              width: 40,
              height: 40,
              '& img': {
                objectPosition: 'center bottom', // 画像を下寄せに配置
              },
            }}
          >
            {message.sender === 'user' ? (
              '👤'
            ) : (
              <Image
                src="/angori-image/angori-counseling.jpg"
                alt="アンゴリ先生"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  transform: 'translateY(3px)',
                }}
              />
            )}
          </Avatar>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              bgcolor:
                message.sender === 'user'
                  ? theme.palette.grey[100]
                  : theme.palette.gorilla.lightBanana,
              color: message.sender === 'user' ? 'white' : 'black',
              borderRadius:
                message.sender === 'user'
                  ? '20px 20px 5px 20px'
                  : '20px 20px 20px 5px',
            }}
          >
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {message.content}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                mt: 1,
                display: 'block',
                opacity: 0.7,
              }}
            >
              {message.timestamp.toLocaleTimeString('ja-JP', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Fade>
  )
}
