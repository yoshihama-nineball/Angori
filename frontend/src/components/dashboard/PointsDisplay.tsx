import React from 'react'
import { Box, Typography, Card, CardContent } from '@mui/material'
import Image from 'next/image'

interface PointsDisplayProps {
  points: number
}

const PointsDisplay: React.FC<PointsDisplayProps> = ({ points }) => {
  return (
    <Card
      sx={{
        mb: 3,
        color: 'white',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
      }}
    >
      <CardContent
        sx={{
          textAlign: 'center',
          py: 4,
        }}
      >
        {/* アンゴリ画像 */}
        <Box
          sx={{
            mb: -6,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Image
            src="/angori-image/angori-counseling.jpg"
            alt="アンゴリ"
            width={240}
            height={240}
            style={{
              objectFit: 'cover',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
            }}
          />
        </Box>

        <Typography
          variant="h2"
          component="div"
          sx={{
            fontSize: { xs: '2.5rem', md: '3rem' },
            fontWeight: 'bold',
            mb: 1,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          {points.toLocaleString()}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            opacity: 0.9,
            fontSize: '1.1rem',
          }}
        >
          落ち着きポイント
        </Typography>
      </CardContent>
    </Card>
  )
}

export default PointsDisplay
