'use client'

import React from 'react'
import {
  Box,
  Typography,
  ButtonBase,
} from '@mui/material'
import { format, isToday } from 'date-fns'
import { DayAngerSummary } from './AngerLogCalendar'

interface CalendarDayCellProps {
  date: Date
  isCurrentMonth: boolean
  dayData?: DayAngerSummary
  onClick: () => void
  isWeekend: boolean
}

const CalendarDayCell: React.FC<CalendarDayCellProps> = ({
  date,
  isCurrentMonth,
  dayData,
  onClick,
  isWeekend,
}) => {
  const dayNumber = format(date, 'd')
  const hasData = dayData && dayData.count > 0
  const today = isToday(date)

  // 日付の色設定
  const getDateColor = () => {
    if (!isCurrentMonth) return '#c0c0c0'
    if (today) return '#1976d2'
    if (isWeekend) {
      return date.getDay() === 0 ? '#e53935' : '#1e88e5' // 日曜日は赤、土曜日は青
    }
    return '#424242'
  }

  // セルのスタイル設定
  const getCellStyle = () => {
    const baseStyle = {
      width: '100%',
      height: '100%',
      borderRadius: 2,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      p: 1,
      position: 'relative',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: hasData ? 'pointer' : 'default',
      border: '2px solid transparent',
      background: 'white',
    }

    // 今日の日付の場合
    if (today) {
      return {
        ...baseStyle,
        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
        border: '2px solid #1976d2',
        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
      }
    }

    // 当月外の日付
    if (!isCurrentMonth) {
      return {
        ...baseStyle,
        background: '#fafafa',
        opacity: 0.5,
      }
    }

    // データがある日付
    if (hasData) {
      return {
        ...baseStyle,
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
          border: `2px solid ${dayData?.color}`,
        },
      }
    }

    // 通常の日付
    return {
      ...baseStyle,
      '&:hover': {
        background: '#f5f5f5',
      },
    }
  }

  return (
    <ButtonBase
      onClick={hasData ? onClick : undefined}
      sx={getCellStyle()}
      disabled={!hasData}
    >
      {/* 日付表示 */}
      <Typography
        variant="body1"
        sx={{
          color: getDateColor(),
          fontWeight: today ? 700 : 500,
          fontSize: { xs: '0.9rem', sm: '1rem' },
        }}
      >
        {dayNumber}
      </Typography>

      {/* 相談データがある場合の表示 */}
      {hasData && (
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${dayData.color} 0%, ${dayData.color}dd 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 3px 8px ${dayData.color}40`,
              border: '2px solid white',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: 'white',
                fontWeight: 700,
                fontSize: '0.8rem',
              }}
            >
              {dayData.count}
            </Typography>
          </Box>
        </Box>
      )}

      {/* データがない場合の空スペース */}
      {!hasData && <Box sx={{ height: '28px' }} />}
    </ButtonBase>
  )
}

export default CalendarDayCell