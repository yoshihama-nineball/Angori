'use client'

import React from 'react'
import { Box, Typography, ButtonBase } from '@mui/material'
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
      borderRadius: { xs: 1.5, sm: 2 },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      p: { xs: 0.5, sm: 1 },
      position: 'relative',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: hasData ? 'pointer' : 'default',
      border: '2px solid transparent',
      background: 'white',
      minHeight: { xs: '48px', sm: '65px' },
    }

    // 今日の日付の場合
    if (today) {
      return {
        ...baseStyle,
        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
        border: '2px solid #1976d2',
        boxShadow: {
          xs: '0 2px 6px rgba(25, 118, 210, 0.2)',
          sm: '0 4px 12px rgba(25, 118, 210, 0.3)',
        },
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
          transform: { xs: 'none', sm: 'translateY(-2px)' },
          boxShadow: {
            xs: '0 2px 8px rgba(0,0,0,0.1)',
            sm: '0 8px 25px rgba(0,0,0,0.15)',
          },
          border: `2px solid ${dayData?.color}`,
        },
      }
    }

    // 通常の日付
    return {
      ...baseStyle,
      '&:hover': {
        background: { xs: 'white', sm: '#f5f5f5' },
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
          fontSize: { xs: '0.8rem', sm: '1rem' },
          lineHeight: 1,
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
            mt: { xs: 0.5, sm: 0.5 },
          }}
        >
          <Box
            sx={{
              width: { xs: '20px', sm: '28px' },
              height: { xs: '20px', sm: '28px' },
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${dayData.bgColor} 0%, ${dayData.bgColor}dd 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: {
                xs: `0 2px 4px ${dayData.color}40`,
                sm: `0 3px 8px ${dayData.color}40`,
              },
              // border: '1px solid white',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: dayData.color,
                fontWeight: 700,
                fontSize: { xs: '0.65rem', sm: '0.8rem' },
                lineHeight: 1,
              }}
            >
              {dayData.count}
            </Typography>
          </Box>
        </Box>
      )}

      {/* データがない場合の空スペース */}
      {!hasData && <Box sx={{ height: { xs: '20px', sm: '28px' } }} />}
    </ButtonBase>
  )
}

export default CalendarDayCell
