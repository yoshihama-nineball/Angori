'use client'

import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Typography,
  Chip,
  Divider,
} from '@mui/material'
import {
  Close,
  AccessTime,
  Psychology,
} from '@mui/icons-material'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { AngerLog } from '@/schemas/anger_log'

interface DayAngerLogsListProps {
  open: boolean
  onClose: () => void
  angerLogs: AngerLog[]
  date: string // YYYY-MM-DD
  onSelectAngerLog: (angerLog: AngerLog) => void
}

// 怒り度による色分け関数
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

// 相談内容を短縮表示する関数
const truncateContent = (content: string, maxLength: number = 60) => {
  if (content.length <= maxLength) return content
  return content.substring(0, maxLength) + '...'
}

const DayAngerLogsList: React.FC<DayAngerLogsListProps> = ({
  open,
  onClose,
  angerLogs,
  date,
  onSelectAngerLog,
}) => {
  const formatDisplayDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return format(date, 'yyyy年MM月dd日(E)', { locale: ja })
    } catch {
      return dateString
    }
  }

  // 相談記録を時間順でソート（新しい順）
  const sortedAngerLogs = [...angerLogs].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '80vh',
        }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
        }}
      >
        <Box>
          <Typography variant="h6" component="div">
            {formatDisplayDate(date)}の相談記録
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {angerLogs.length}件の相談記録があります
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'grey.500',
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <List sx={{ py: 0 }}>
          {sortedAngerLogs.map((angerLog, index) => (
            <React.Fragment key={angerLog.id}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => onSelectAngerLog(angerLog)}
                  sx={{
                    py: 2,
                    px: 3,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ mb: 1 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 1,
                          }}
                        >
                          {/* 時間表示 */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTime sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {format(new Date(angerLog.created_at), 'HH:mm')}
                            </Typography>
                          </Box>

                          {/* 怒り度チップ */}
                          <Chip
                            icon={<Psychology sx={{ fontSize: '1rem' }} />}
                            label={`怒り度 ${angerLog.anger_level}`}
                            size="small"
                            sx={{
                              backgroundColor: getAngerLevelBgColor(angerLog.anger_level),
                              color: getAngerLevelColor(angerLog.anger_level),
                              fontWeight: 'bold',
                              '& .MuiChip-icon': {
                                color: getAngerLevelColor(angerLog.anger_level),
                              },
                            }}
                          />
                        </Box>

                        {/* 相談内容プレビュー */}
                        <Typography
                          variant="body1"
                          sx={{
                            color: 'text.primary',
                            lineHeight: 1.5,
                            wordBreak: 'break-word',
                          }}
                        >
                          {truncateContent(angerLog.situation)}
                        </Typography>

                        {/* タグ表示（もしあれば） */}
                        {angerLog.trigger && (
                          <Box sx={{ mt: 1 }}>
                            <Chip
                              label={angerLog.trigger}
                              size="small"
                              variant="outlined"
                              sx={{
                                fontSize: '0.75rem',
                                height: '24px',
                              }}
                            />
                          </Box>
                        )}
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
              {index < sortedAngerLogs.length - 1 && (
                <Divider variant="inset" component="li" />
              )}
            </React.Fragment>
          ))}
        </List>

        {/* 空状態（念のため） */}
        {angerLogs.length === 0 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 4,
              px: 2,
            }}
          >
            <Psychology sx={{ fontSize: '3rem', color: 'text.disabled', mb: 2 }} />
            <Typography variant="body1" color="text.secondary" textAlign="center">
              この日の相談記録はありません
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default DayAngerLogsList