import React from 'react'
import { Box, Typography, Card, CardContent, Chip } from '@mui/material'
import { LocationOn } from '@mui/icons-material'

const CalmingPointsSection: React.FC = () => {
  // 仮データ（実際はAPIから取得）
  const calmingPoints = [
    {
      id: 1,
      title: '深呼吸をする',
      description:
        '4秒吸って、4秒止めて、8秒で吐く呼吸法を試してみましょう。心拍数を落ち着かせる効果があります。',
      category: '呼吸法',
    },
    {
      id: 2,
      title: 'その場を離れる',
      description:
        'イライラを感じたら、可能であればその場から離れて冷静になる時間を作りましょう。',
      category: '環境調整',
    },
    {
      id: 3,
      title: '10まで数える',
      description:
        '怒りを感じたら、まず心の中で10まで数えてから反応しましょう。感情的な反応を抑える効果があります。',
      category: '心理技法',
    },
  ]

  return (
    <Card
      sx={{
        height: 'fit-content',
        borderRadius: 3,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        border: '1px solid #f0f0f0',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <LocationOn sx={{ color: '#4caf50', mr: 1 }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: '#333',
            }}
          >
            今日のアドバイス
          </Typography>
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: '#666',
            mb: 3,
            lineHeight: 1.6,
          }}
        >
          怒りをうまくコントロールするためのヒントをお伝えします。状況に合わせて試してみてください。
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {calmingPoints.map((point, index) => (
            <Box
              key={point.id}
              sx={{
                p: 2,
                backgroundColor: '#f8f9fa',
                borderRadius: 2,
                border: '1px solid #e9ecef',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 1,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 'bold',
                    color: '#333',
                  }}
                >
                  {index + 1}. {point.title}
                </Typography>
                <Chip
                  label={point.category}
                  size="small"
                  sx={{
                    backgroundColor: '#e3f2fd',
                    color: '#1976d2',
                    fontSize: '0.7rem',
                    height: 20,
                  }}
                />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: '#555',
                  lineHeight: 1.5,
                  fontSize: '0.85rem',
                }}
              >
                {point.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}

export default CalmingPointsSection
