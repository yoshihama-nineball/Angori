import React from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material'
import Image from 'next/image'

interface PointsDisplayProps {
  points: number
  level?: number
  levelName?: string
  streakDays?: number
  pointsToNextLevel?: number
  nextLevelPoints?: number
}

const PointsDisplay: React.FC<PointsDisplayProps> = ({
  points,
  level = 1,
  levelName = '',
  streakDays = 0,
  pointsToNextLevel = 100,
  nextLevelPoints = 100,
}) => {
  // 進捗率を計算
  const progressPercentage =
    ((nextLevelPoints - pointsToNextLevel) / nextLevelPoints) * 100

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
          // py: 4,
        }}
      >
        {/* アンゴリ画像 */}
        <Box
          sx={{
            mb: { xs: -6, md: 2 },
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

        {/* ポイント数 */}
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
            color: '#666',
            fontSize: '1.1rem',
            mb: 2,
          }}
        >
          落ち着きポイント
        </Typography>

        {/* レベル情報 */}
        <Typography
          variant="body2"
          sx={{
            color: '#666',
            mb: 2,
            fontSize: '1rem',
            fontWeight: 500,
          }}
        >
          レベル {level} - {levelName || '修行中ゴリラ 🦍🧘'}
        </Typography>

        {/* 進捗バー */}
        <Box sx={{ mb: 2, px: 2 }}>
          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#4caf50',
                borderRadius: 4,
              },
            }}
          />
          <Typography
            variant="caption"
            sx={{
              color: '#666',
              mt: 1,
              display: 'block',
            }}
          >
            次のレベルまで {pointsToNextLevel} ポイント
          </Typography>
        </Box>

        {/* 連続記録日数 */}
        {streakDays > 0 && (
          <Typography
            variant="body2"
            sx={{
              opacity: 0.9,
              fontSize: '0.9rem',
            }}
          >
            🔥 連続記録: {streakDays} 日
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default PointsDisplay
