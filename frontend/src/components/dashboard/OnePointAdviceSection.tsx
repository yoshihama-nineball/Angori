import React from 'react'
import { Typography, Alert, AlertTitle } from '@mui/material'
import { useState, useEffect } from 'react'
import { getRecommendedWiseSaying } from '../../../lib/api/wise_sayings'
import { WiseSaying } from '@/schemas/wise_saying'

const OnePointAdviceSection: React.FC = () => {
  const [wiseSaying, setWiseSaying] = useState<WiseSaying | null>(null)
  const [, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        const response = await getRecommendedWiseSaying()
        if (response.wise_saying) {
          setWiseSaying(response.wise_saying)
        }
      } catch {
      } finally {
        setLoading(false)
      }
    }

    fetchAdvice()
  }, [])

  return (
    <Alert>
      <AlertTitle>今日のアドバイス</AlertTitle>
      <Typography>
        {wiseSaying?.content || 'アドバイスを読み込んでいます...'}
      </Typography>
      {wiseSaying?.author && (
        <Typography variant="caption">- {wiseSaying.author}</Typography>
      )}
    </Alert>
  )
}

export default OnePointAdviceSection
