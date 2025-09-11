'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  IconButton,
  Paper,
  CircularProgress,
  Alert,
  Fade,
} from '@mui/material'
import {
  ChevronLeft,
  ChevronRight,
  Today,
} from '@mui/icons-material'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, addMonths, subMonths } from 'date-fns'
import { ja } from 'date-fns/locale'
import { AngerLog } from '@/schemas/anger_log'
import CalendarDayCell from './CalendarDayCell'
import DayAngerLogsList from './DayAngerLogsList'
import { getAngerLogs } from '../../../lib/api/anger_log'
// import AngerLogDetailModal from '../AngerLogDetailModal' // 既存の詳細モーダル

// 日別集約データの型定義
export type DayAngerSummary = {
  date: string // YYYY-MM-DD
  angerLogs: AngerLog[]
  maxAngerLevel: number
  count: number
  color: string
  bgColor: string
}

// 怒り度による色分け関数
const getAngerLevelColor = (level: number) => {
  if (level <= 3) return '#34A853' // 緑
  if (level <= 6) return '#ff9800' // オレンジ
  return '#E53935' // 赤
}

const getAngerLevelBgColor = (level: number) => {
  if (level <= 3) return '#e8f5e8' // 薄い緑
  if (level <= 6) return '#fff3e0' // 薄いオレンジ
  return '#ffebee' // 薄い赤
}

// 曜日ヘッダー
const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

const AngerLogCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [angerLogs, setAngerLogs] = useState<AngerLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dayAngerData, setDayAngerData] = useState<Record<string, DayAngerSummary>>({})
  
  // モーダル状態管理
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showDayList, setShowDayList] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedAngerLog, setSelectedAngerLog] = useState<AngerLog | null>(null)

  // アンガーログデータ取得
  const fetchAngerLogs = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await getAngerLogs()
      if (response.errors && response.errors.length > 0) {
        setError(response.errors[0])
        return
      }
      
      setAngerLogs(response.anger_logs)
      processAngerLogsByDate(response.anger_logs)
    } catch (err) {
      setError('データの取得に失敗しました')
      console.error('Error fetching anger logs:', err)
    } finally {
      setLoading(false)
    }
  }

  // 日付別にアンガーログを集約処理
  const processAngerLogsByDate = (logs: AngerLog[]) => {
    const dayData: Record<string, DayAngerSummary> = {}
    
    logs.forEach((log) => {
      const dateKey = format(new Date(log.created_at), 'yyyy-MM-dd')
      
      if (!dayData[dateKey]) {
        dayData[dateKey] = {
          date: dateKey,
          angerLogs: [],
          maxAngerLevel: 0,
          count: 0,
          color: '',
          bgColor: '',
        }
      }
      
      dayData[dateKey].angerLogs.push(log)
      dayData[dateKey].count += 1
      dayData[dateKey].maxAngerLevel = Math.max(
        dayData[dateKey].maxAngerLevel,
        log.anger_level
      )
    })
    
    // 各日付の色を設定
    Object.values(dayData).forEach((day) => {
      day.color = getAngerLevelColor(day.maxAngerLevel)
      day.bgColor = getAngerLevelBgColor(day.maxAngerLevel)
    })
    
    setDayAngerData(dayData)
  }

  // 日付クリック処理
  const handleDateClick = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd')
    const dayData = dayAngerData[dateKey]
    
    if (!dayData || dayData.count === 0) {
      return // 相談記録がない日はクリック無効
    }
    
    setSelectedDate(dateKey)
    
    if (dayData.count === 1) {
      // 単一記録の場合：直接詳細モーダル表示
      setSelectedAngerLog(dayData.angerLogs[0])
      setShowDetailModal(true)
    } else {
      // 複数記録の場合：一覧モーダル表示
      setShowDayList(true)
    }
  }

  // 一覧から詳細選択時の処理
  const handleSelectAngerLog = (angerLog: AngerLog) => {
    setSelectedAngerLog(angerLog)
    setShowDayList(false)
    setShowDetailModal(true)
  }

  // モーダルクローズ処理
  const handleCloseModals = () => {
    setShowDayList(false)
    setShowDetailModal(false)
    setSelectedAngerLog(null)
    setSelectedDate(null)
  }

  // 月変更処理
  const handlePreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1))
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  // カレンダーの日付範囲を取得
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const startDate = new Date(monthStart)
  startDate.setDate(startDate.getDate() - monthStart.getDay()) // 月の最初の週の日曜日から
  
  const endDate = new Date(monthEnd)
  const remainingDays = 6 - monthEnd.getDay()
  endDate.setDate(endDate.getDate() + remainingDays) // 月の最後の週の土曜日まで

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

  // 初回データ取得
  useEffect(() => {
    fetchAngerLogs()
  }, [])

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="400px"
        sx={{
          borderRadius: 3,
        }}
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          アンガーログを読み込み中...
        </Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert 
          severity="error" 
          sx={{ borderRadius: 2 }}
          action={
            <IconButton onClick={fetchAngerLogs} color="inherit" size="small">
              <Today />
            </IconButton>
          }
        >
          {error}
        </Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      {/* カレンダーコンテナ */}
      <Paper
        elevation={8}
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          background: '#ffffff',
          border: '1px solid rgba(0,0,0,0.06)',
          width: '100%',
          maxWidth: '450px',
        }}
      >
        {/* カレンダーヘッダー */}
        <Box
          sx={{
            backgroundColor: 'white',
            color: '#424242',
            p: { xs: 2, sm: 3 },
            borderBottom: '1px solid rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box display="flex" alignItems="center" gap={2} sx={{ justifyContent: 'center', width: '100%' }}>
            <IconButton 
              onClick={handlePreviousMonth} 
              sx={{ 
                color: '#424242',
                backgroundColor: 'rgba(0,0,0,0.05)',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)' }
              }}
            >
              <ChevronLeft />
            </IconButton>
            <Typography variant="h6" component="h1" sx={{ fontWeight: 600, textAlign: 'center' }}>
              {format(currentDate, 'yyyy年MM月', { locale: ja })}
            </Typography>
            <IconButton 
              onClick={handleNextMonth} 
              sx={{ 
                color: '#424242',
                backgroundColor: 'rgba(0,0,0,0.05)',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.1)' }
              }}
            >
              <ChevronRight />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ p: { xs: 1, sm: 2 } }}>
          {/* 曜日ヘッダー */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: { xs: 0.25, sm: 0.5 },
              mb: { xs: 0.5, sm: 1 },
            }}
          >
            {WEEKDAYS.map((day, index) => (
              <Box
                key={day}
                sx={{
                  py: 1,
                  textAlign: 'center',
                  fontWeight: 600,
                  color: index === 0 ? '#e53935' : index === 6 ? '#1e88e5' : '#424242',
                  fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem', lg: '1.1rem' },
                  letterSpacing: '0.5px',
                }}
              >
                {day}
              </Box>
            ))}
          </Box>

          {/* カレンダーグリッド */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: { xs: 0.25, sm: 0.5 },
              '& > *': {
                aspectRatio: '1',
                minHeight: { xs: '55px', sm: '65px' },
              }
            }}
          >
            {calendarDays.map((day) => (
              <CalendarDayCell
                key={day.toISOString()}
                date={day}
                isCurrentMonth={isSameMonth(day, currentDate)}
                dayData={dayAngerData[format(day, 'yyyy-MM-dd')]}
                onClick={() => handleDateClick(day)}
                isWeekend={day.getDay() === 0 || day.getDay() === 6}
                // badgeSize={getBadgeSize()}
              />
            ))}
          </Box>
        </Box>
      </Paper>

      {/* 同日一覧モーダル */}
      {showDayList && selectedDate && (
        <DayAngerLogsList
          open={showDayList}
          onClose={handleCloseModals}
          angerLogs={dayAngerData[selectedDate]?.angerLogs || []}
          date={selectedDate}
          onSelectAngerLog={handleSelectAngerLog}
        />
      )}

      {/* 詳細モーダル */}
      {showDetailModal && selectedAngerLog && (
        // <AngerLogDetailModal
        //   open={showDetailModal}
        //   onClose={handleCloseModals}
        //   angerLog={selectedAngerLog}
        // />
        <h4>モーダル出現</h4>
      )}
    </Box>
  )
}

export default AngerLogCalendar