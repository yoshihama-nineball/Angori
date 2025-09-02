import React from 'react'
import { Box, Typography, Button, useTheme } from '@mui/material'
import { useRouter } from 'next/navigation'

const WelcomeSection: React.FC = () => {
  const router = useRouter()
  const theme = useTheme()

  const handleCounselingClick = () => {
    router.push('/counseling')
  }

  return (
    <Box
      sx={{
        mb: 4,
        p: 2,
        backgroundColor: theme.palette.gorilla.lightBanana,
        border: '1px solid #ffeaa7',
        borderRadius: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          backgroundColor: '#fff1b3',
          transform: 'translateY(-1px)',
          boxShadow: '0 2px 8px rgba(255, 235, 167, 0.4)',
        },
      }}
      onClick={handleCounselingClick}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, pl: 1 }}>
        <Box>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 'bold',
              color: '#856404',
              mb: 0.5,
            }}
          >
            嫌だったことを相談する
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#856404',
              opacity: 0.8,
            }}
          >
            どうした？いつでも話を聞くウホよ！
          </Typography>
        </Box>
      </Box>

      <Button
        variant="outlined"
        size="small"
        sx={{
          color: '#856404',
          borderColor: '#856404',
          minWidth: 'auto',
          px: 2,
          borderRadius: 2,
          textTransform: 'none',
          fontSize: '0.875rem',
          '&:hover': {
            backgroundColor: '#856404',
            color: 'white',
            borderColor: '#856404',
          },
        }}
      >
        相談する
      </Button>
    </Box>
  )
}

export default WelcomeSection
