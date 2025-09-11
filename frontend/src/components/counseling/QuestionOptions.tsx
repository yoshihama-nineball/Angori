'use client'

import React, { useState } from 'react'
import {
  Box,
  Typography,
  Grid,
  Chip,
  useTheme,
  Select,
  MenuItem,
  Button,
} from '@mui/material'
import { Mood as MoodIcon } from '@mui/icons-material'
import { QuestionType } from '@/types/counseling'

interface QuestionOptionsProps {
  questionType: QuestionType
  options: string[]
  selectedValue: string
  onSelect: (value: string) => void
  onSendMessage?: (message: string) => void
  onClear?: () => void
}

export const QuestionOptions: React.FC<QuestionOptionsProps> = ({
  questionType,
  options,
  selectedValue,
  onSelect,
  onSendMessage,
  onClear,
}) => {
  const theme = useTheme()
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([])

  const handleEmotionSelect = (emotion: string) => {
    const newSelectedEmotions = selectedEmotions.includes(emotion)
      ? selectedEmotions.filter((e) => e !== emotion)
      : [...selectedEmotions, emotion]

    setSelectedEmotions(newSelectedEmotions)
  }

  const handleRatingSelect = (rating: string) => {
    onSelect(rating)
  }

  if (questionType === 'emotion') {
    return (
      <Box sx={{ p: 1, borderTop: '1px solid #e0e0e0' }}>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          感情を選んでください（複数選択可）:
        </Typography>
        <Grid container spacing={1} sx={{ mb: 1 }}>
          {options.map((emotion) => (
            <Grid item key={emotion}>
              <Chip
                label={emotion}
                onClick={() => handleEmotionSelect(emotion)}
                color={
                  selectedEmotions.includes(emotion) ? 'primary' : 'default'
                }
                variant={
                  selectedEmotions.includes(emotion) ? 'filled' : 'outlined'
                }
                icon={<MoodIcon />}
                sx={{
                  cursor: 'pointer',
                  bgcolor: selectedEmotions.includes(emotion)
                    ? theme.palette.primary.main
                    : 'transparent',
                  color: selectedEmotions.includes(emotion)
                    ? 'white'
                    : 'inherit',
                }}
              />
            </Grid>
          ))}
        </Grid>
        {/* 決定ボタンを追加 */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onSendMessage?.(selectedEmotions.join(', '))}
            disabled={selectedEmotions.length === 0}
            sx={{ borderRadius: '20px', px: 3 }}
          >
            決定
          </Button>
        </Box>
      </Box>
    )
  }
  if (questionType === 'select') {
    return (
      <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          選択してください:
        </Typography>
        <Select
          value={selectedValue}
          onChange={(e) => onSelect(e.target.value)}
          fullWidth
          variant="outlined"
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </Box>
    )
  }

  if (questionType === 'rating') {
    return (
      <Box sx={{ p: 1, borderTop: '1px solid #e0e0e0' }}>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
          怒りのレベルを選んでください:
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            justifyContent: 'center',
            mb: 0.5,
          }}
        >
          {['1', '2', '3', '4', '5'].map((rating) => (
            <Chip
              key={rating}
              label={rating}
              onClick={() => handleRatingSelect(rating)}
              color={selectedValue === rating ? 'primary' : 'default'}
              variant={selectedValue === rating ? 'filled' : 'outlined'}
              sx={{
                cursor: 'pointer',
                minWidth: '48px',
                height: '32px',
                fontSize: '14px',
                bgcolor:
                  selectedValue === rating
                    ? theme.palette.gorilla.banana
                    : 'transparent',
              }}
            />
          ))}
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            justifyContent: 'center',
            mb: 1, // 決定ボタンとの距離を空ける
          }}
        >
          {['6', '7', '8', '9', '10'].map(
            (
              rating // 正しい配列に修正
            ) => (
              <Chip
                key={rating}
                label={rating}
                onClick={() => handleRatingSelect(rating)}
                color={selectedValue === rating ? 'primary' : 'default'}
                variant={selectedValue === rating ? 'filled' : 'outlined'}
                sx={{
                  cursor: 'pointer',
                  minWidth: '48px',
                  height: '32px',
                  fontSize: '14px',
                  bgcolor:
                    selectedValue === rating
                      ? theme.palette.gorilla.banana
                      : 'transparent',
                }}
              />
            )
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              onSendMessage?.(selectedValue)
              onClear?.()
            }}
            disabled={!selectedValue}
            sx={{ borderRadius: '20px', px: 3 }}
          >
            決定
          </Button>
        </Box>
      </Box>
    )
  }

  return null
}
