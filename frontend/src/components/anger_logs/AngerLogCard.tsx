import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  useTheme,
} from '@mui/material'
import { ChevronRight as ChevronRightIcon } from '@mui/icons-material'
import { AngerLog } from '@/schemas/anger_log'

interface AngerLogCardProps {
  angerLog: AngerLog
  onClick: (id: number) => void
}

const AngerLogCard: React.FC<AngerLogCardProps> = ({ angerLog, onClick }) => {
  const theme = useTheme()
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const logDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    )

    if (logDate.getTime() === today.getTime()) {
      return `今日 - ${date.toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit',
      })}`
    }

    return date.toLocaleString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getAngerLevelColor = (level: number) => {
    if (level <= 3) return '#34A853' // 緑
    if (level <= 6) return '#ff9800' // オレンジ
    return '#E53935' // 赤
  }

  const getAngerLevelBgColor = (level: number) => {
    if (level <= 3) return '#e8f5e8' // 薄い緑
    if (level <= 6) return '#fff3e0' // 薄いオレンジ
    return '#ffebee' // 薄い赤
  }

  // 感情データの処理
  const getEmotions = () => {
    if (!angerLog.emotions_felt) return []

    if (Array.isArray(angerLog.emotions_felt)) {
      return angerLog.emotions_felt
    }

    if (typeof angerLog.emotions_felt === 'object') {
      return Object.entries(angerLog.emotions_felt)
        .filter(([_, value]) => value === true)
        .map(([emotion, _]) => emotion)
    }

    return []
  }

  const emotions = getEmotions()

  // 文字数制限（60文字で省略）
  const truncateText = (text: string, maxLength: number = 60) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <Card
      sx={{
        mb: 0,
        backgroundColor: 'white',
        border: '1px solid #e0e0e0',
        cursor: 'pointer',
        height: 180, // 固定の高さでカードを揃える
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          boxShadow: 2,
          borderColor: theme.palette.gorilla.soil,
        },
      }}
      onClick={() => onClick(angerLog.id)}
    >
      <CardContent
        sx={{
          p: 2,
          '&:last-child': { pb: 2 },
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            mb={1}
          >
            <Typography variant="caption" color="text.secondary">
              {formatDate(angerLog.occurred_at)}
            </Typography>
            <IconButton size="small" sx={{ p: 0.5 }}>
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box display="flex" alignItems="center" mb={2}>
            <Typography
              variant="body2"
              sx={{
                flex: 1,
                color: '#333',
                lineHeight: 1.4,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                fontSize: '0.875rem',
              }}
            >
              {truncateText(angerLog.situation_description, 80)}
            </Typography>
          </Box>
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={1}
        >
          <Box display="flex" gap={1} flexWrap="wrap">
            <Chip
              label={`怒り度 ${angerLog.anger_level}`}
              size="small"
              sx={{
                backgroundColor: getAngerLevelBgColor(angerLog.anger_level),
                color: getAngerLevelColor(angerLog.anger_level),
                fontSize: '0.75rem',
                height: 24,
                border: 'none',
              }}
            />
            {/* 感情チップを表示 */}
            {emotions.slice(0, 2).map((emotion, index) => (
              <Chip
                key={index}
                label={emotion}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: theme.palette.gorilla.soil,
                  color: theme.palette.gorilla.soil,
                  fontSize: '0.7rem',
                  height: 24,
                  border: 'none',
                }}
              />
            ))}
            {emotions.length > 2 && (
              <Chip
                label={`+${emotions.length - 2}`}
                size="small"
                variant="outlined"
                sx={{
                  borderColor: theme.palette.gorilla.soil,
                  color: theme.palette.gorilla.soil,
                  fontSize: '0.7rem',
                  height: 24,
                  // border: 'none',
                }}
              />
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default AngerLogCard
