'use client'

import React, { useState } from 'react'
import {
  Box,
  TextField,
  IconButton,
  useTheme,
  MenuItem,
  Select,
} from '@mui/material'
import { Send as SendIcon } from '@mui/icons-material'
import { QuestionOptions } from './QuestionOptions'
import { QuestionType } from '@/types/counseling'

interface MessageInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
  questionType: QuestionType
  options?: string[]
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  isLoading,
  questionType,
  options,
}) => {
  const theme = useTheme()
  const [inputValue, setInputValue] = useState('')

  const handleSendMessage = () => {
    if (!inputValue.trim()) return
    onSendMessage(inputValue)
    setInputValue('')
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  const handleOptionSelect = (value: string) => {
    setInputValue(value)
  }

  return (
    <>
      {/* 選択肢表示エリア */}
      {(questionType === 'emotion' || questionType === 'rating') && options && (
        <QuestionOptions
          questionType={questionType}
          options={options}
          selectedValue={inputValue}
          onSelect={handleOptionSelect}
        />
      )}
      {/* 入力エリア */}
      <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {questionType === 'select' ? (
            // Select表示
            <>
              <Select
                fullWidth
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                variant="outlined"
                disabled={isLoading}
                displayEmpty
                sx={{
                  borderRadius: '20px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px',
                  },
                }}
              >
                <MenuItem value="" disabled>
                  選択してください...
                </MenuItem>
                {options?.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                sx={{
                  bgcolor: theme.palette.primary.main,
                  color: 'white',
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                  },
                  '&.Mui-disabled': {
                    bgcolor: theme.palette.grey[300],
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </>
          ) : (
            // 通常のTextField表示
            <>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="メッセージを入力してください..."
                variant="outlined"
                disabled={isLoading || questionType === 'emotion'}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px',
                  },
                }}
              />
              <IconButton /* 既存のスタイル */>
                <SendIcon />
              </IconButton>
            </>
          )}
        </Box>
      </Box>
    </>
  )
}
