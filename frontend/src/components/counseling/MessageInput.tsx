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
import dayjs from 'dayjs'

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
        <Box sx={{ maxHeight: '35vh', overflow: 'auto', mb: 4 }}>
          <QuestionOptions
            questionType={questionType}
            options={options}
            selectedValue={inputValue}
            onSelect={handleOptionSelect}
            onSendMessage={onSendMessage}
          />
        </Box>
      )}
      {/* 入力エリア - emotion, rating時は非表示 */}
      {questionType !== 'emotion' && questionType !== 'rating' && (
        <Box
          sx={{
            p: 2,
            borderTop: '1px solid #e0e0e0',
            position: 'sticky',
            bottom: 0,
            bgcolor: 'white',
          }}
        >
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
            {questionType === 'datetime' ? (
              // DateTimePicker表示
              <>
                <TextField
                  fullWidth
                  type="datetime-local"
                  value={
                    inputValue
                      ? dayjs(inputValue).format('YYYY-MM-DDTHH:mm')
                      : ''
                  }
                  onChange={(e) =>
                    setInputValue(dayjs(e.target.value).toISOString())
                  }
                  inputProps={{
                    max: dayjs().format('YYYY-MM-DDTHH:mm'),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '20px',
                    },
                  }}
                />
                <IconButton
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={!inputValue || isLoading}
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: 'white',
                    flexShrink: 0,
                    alignSelf: 'flex-end',
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
            ) : questionType === 'select' ? (
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
                    flexShrink: 0,
                    alignSelf: 'flex-end',
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
                  disabled={isLoading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '20px',
                    },
                  }}
                />
                <IconButton
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: 'white',
                    flexShrink: 0,
                    alignSelf: 'flex-end',
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
            )}
          </Box>
        </Box>
      )}
    </>
  )
}
