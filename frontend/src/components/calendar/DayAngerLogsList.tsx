'use client'

import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { AngerLog } from '@/schemas/anger_log'
import AngerLogCard from '@/components/anger_logs/AngerLogCard'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

interface DayAngerLogsListProps {
  open: boolean
  onClose: () => void
  angerLogs: AngerLog[]
  date: string // YYYY-MM-DD format
  onSelectAngerLog: (angerLog: AngerLog) => void
}

const DayAngerLogsList: React.FC<DayAngerLogsListProps> = ({
  open,
  onClose,
  angerLogs,
  date,
  onSelectAngerLog,
}) => {
  const formatDateTitle = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, 'yyyy年MM月dd日（E）', { locale: ja })
  }

  const handleCardClick = (id: number) => {
    const selectedLog = angerLogs.find((log) => log.id === id)
    if (selectedLog) {
      onSelectAngerLog(selectedLog)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '85vh',
          marginTop: '20px',
          marginBottom: '20px',
        },
      }}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, position: 'relative' }}>
        <Typography variant="h6" component="div" sx={{ pr: 5 }}>
          {formatDateTitle(date)}の記録
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {angerLogs.length}件の記録があります
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
            },
            gap: 2,
          }}
        >
          {angerLogs.map((log) => (
            <AngerLogCard
              key={log.id}
              angerLog={log}
              onClick={handleCardClick}
            />
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
        <Button variant="contained" color="primary" onClick={onClose}>
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DayAngerLogsList
