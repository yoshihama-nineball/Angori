'use client'
import { AngryGorilla } from '@/icons/AngryGorillaIcon'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { keyframes } from '@mui/system'

// ゴリラが暴れるアニメーション
const gorillaRage = keyframes`
  0% { 
    transform: rotate(-10deg) translateX(-5px);
  }
  25% { 
    transform: rotate(10deg) translateX(5px);
  }
  50% { 
    transform: rotate(-15deg) translateX(-8px);
  }
  75% { 
    transform: rotate(15deg) translateX(8px);
  }
  100% { 
    transform: rotate(-10deg) translateX(-5px);
  }
`

export default function Loading() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: 3,
      }}
    >
      <Box
        sx={{
          animation: `${gorillaRage} 0.8s ease-in-out infinite`,
          transformOrigin: 'center center',
        }}
      >
        <AngryGorilla
          sx={{
            fontSize: '10rem',
            color: '#8B4513',
            filter: 'drop-shadow(0 4px 8px rgba(139, 69, 19, 0.3))',
          }}
        />
      </Box>
      <Typography
        variant="h6"
        sx={{
          color: '#8B4513',
          textAlign: 'center',
        }}
      >
        ウホウホ...Loading...🍌
      </Typography>
    </Box>
  )
}
