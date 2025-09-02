'use client'

import React from 'react'
import {
  Box,
  Avatar,
  Paper,
  Typography,
  CircularProgress,
  Grow,
  useTheme,
} from '@mui/material'

export const LoadingMessage = () => {
  const theme = useTheme()

  return (
    <Grow in={true}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar
            src="/angori-image/angori-counseling.jpg"
            sx={{
              bgcolor: theme.palette.gorilla.lightBanana,
              '& img': {
                objectFit: 'cover !important',
                objectPosition: 'center bottom !important',
                transform: 'translateY(3px)',
              },
            }}
          />
          <Paper
            elevation={1}
            sx={{
              p: 2,
              bgcolor: theme.palette.gorilla.lightBanana,
              borderRadius: '20px 20px 20px 5px',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} />
              <Typography variant="body2" color="textSecondary">
                考え中ウホ...
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Grow>
  )
}
