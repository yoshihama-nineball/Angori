'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  Alert,
  Chip,
} from '@mui/material'
import { TriggerWord } from '@/schemas/trigger_word'
import { getTriggerWords } from '../../../lib/api/trigger_word'

const AngerTrendMap: React.FC = () => {
  const [triggerWords, setTriggerWords] = useState<TriggerWord[]>([])
  const [categoryFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<string>('all')
  const [filteredData, setFilteredData] = useState<TriggerWord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  // データ取得
  useEffect(() => {
    const fetchTriggerWords = async () => {
      try {
        setLoading(true)
        const response = await getTriggerWords()

        if (response.errors) {
          setError(response.errors.join(', '))
          setSampleData()
        } else {
          setTriggerWords(response.trigger_words)
        }
      } catch {
        setError('データの取得に失敗しました')
        setSampleData()
      } finally {
        setLoading(false)
      }
    }

    fetchTriggerWords()
  }, [])

  // サンプルデータ設定（APIエラー時のフォールバック）
  const setSampleData = () => {
    const sampleData: TriggerWord[] = [
      {
        id: 1,
        user_id: 1,
        name: '大声',
        count: 1,
        anger_level_avg: 6.0,
        category: 'other',
        needs_attention: false,
        frequency_level: 'low',
        anger_severity: 'moderate',
        last_triggered_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        user_id: 1,
        name: '騒音',
        count: 5,
        anger_level_avg: 6.0,
        category: 'sensory',
        needs_attention: true,
        frequency_level: 'medium',
        anger_severity: 'moderate',
        last_triggered_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 3,
        user_id: 1,
        name: '締切',
        count: 1,
        anger_level_avg: 8.0,
        category: 'work',
        needs_attention: false,
        frequency_level: 'low',
        anger_severity: 'severe',
        last_triggered_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]
    setTriggerWords(sampleData)
  }

  // データフィルタリング
  useEffect(() => {
    let filtered = [...triggerWords]

    // カテゴリフィルタ
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((d) => d.category === categoryFilter)
    }

    // 表示モードフィルタ
    if (viewMode === 'dangerous') {
      filtered = filtered.filter((d) => d.needs_attention)
    } else if (viewMode === 'frequent') {
      filtered = filtered.filter((d) => d.count >= 3)
    }

    // ソート: 発生回数優先、次に怒りレベル
    filtered.sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count // 発生回数で比較
      }
      return b.anger_level_avg - a.anger_level_avg // 同じ発生回数なら怒りレベルで比較
    })

    setFilteredData(filtered)
  }, [categoryFilter, viewMode, triggerWords])

  // 怒りレベルによる色分け
  const getAngerColor = (angerLevel: number): string => {
    if (angerLevel >= 8.0) return '#ff6b6b'
    if (angerLevel >= 6.0) return '#ffa726'
    return '#66bb6a'
  }

  const getAngerSeverityJa = (severity: string): string => {
    const severityMap: { [key: string]: string } = {
      mild: '軽度',
      moderate: '中度',
      severe: '重度',
      extreme: '極度',
    }
    return severityMap[severity] || severity
  }

  // // 順位アイコン
  const getRankIcon = (rank: number): string => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `${rank}位`
  }

  // 統計計算
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 600
  const displayData = isMobile
    ? filteredData.slice(0, 10)
    : filteredData.slice(0, 15)

  const stats = {
    totalTriggers: filteredData.length,
    totalOccurrences: filteredData.reduce((sum, d) => sum + d.count, 0),
    avgAngerLevel:
      filteredData.length > 0
        ? (
            filteredData.reduce((sum, d) => sum + d.anger_level_avg, 0) /
            filteredData.length
          ).toFixed(1)
        : '0',
    dangerousTriggers: filteredData.filter((d) => d.needs_attention).length,
  }

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>データを読み込み中...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        textAlign="center"
        sx={{ mb: 4, fontWeight: 'bold' }}
      >
        怒りの傾向分析
      </Typography>

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error} （サンプルデータを表示しています）
        </Alert>
      )}

      {/* コントロール */}
      <Grid container spacing={2} sx={{ mb: 4 }} justifyContent="center">
        <Grid item>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>表示モード</InputLabel>
            <Select
              value={viewMode}
              label="表示モード"
              onChange={(e) => setViewMode(e.target.value)}
            >
              <MenuItem value="all">全トリガー</MenuItem>
              <MenuItem value="dangerous">要注意</MenuItem>
              <MenuItem value="frequent">頻出</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* ランキング表示 */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom textAlign="center">
          トリガーワードランキング (発生回数順)
          {displayData.length < filteredData.length && (
            <Typography
              variant="caption"
              display="block"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              上位{displayData.length}件を表示中 (全{filteredData.length}件中)
            </Typography>
          )}
        </Typography>

        {filteredData.length > 0 ? (
          <Box sx={{ mt: 2 }}>
            {displayData.map((trigger, index) => (
              <Card
                key={trigger.id}
                sx={{
                  mb: 2,
                  border: '1px solid #e0e0e0',
                  '&:hover': {
                    boxShadow: 3,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease-in-out',
                  },
                }}
              >
                <CardContent sx={{ py: 2 }}>
                  <Grid container alignItems="center" spacing={1}>
                    {/* 順位（スマホは小さく） */}
                    <Grid item xs={2} sm={1}>
                      <Typography
                        variant={isMobile ? 'body1' : 'h6'}
                        textAlign="center"
                        sx={{ fontWeight: 'bold' }}
                      >
                        {getRankIcon(index + 1)}
                      </Typography>
                    </Grid>

                    {/* トリガー名のみ */}
                    <Grid item xs={4} sm={3}>
                      <Typography
                        variant={isMobile ? 'body1' : 'h6'}
                        sx={{ fontWeight: 'bold' }}
                      >
                        {trigger.name}
                      </Typography>
                    </Grid>

                    {/* 発生回数 */}
                    <Grid item xs={3} sm={2}>
                      <Box textAlign="center">
                        <Typography
                          variant={isMobile ? 'h6' : 'h5'}
                          sx={{ fontWeight: 'bold', color: 'primary.main' }}
                        >
                          {trigger.count}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          回
                        </Typography>
                      </Box>
                    </Grid>

                    {/* 怒りレベル */}
                    <Grid item xs={3} sm={2}>
                      <Box textAlign="center">
                        <Typography
                          variant={isMobile ? 'h6' : 'h5'}
                          sx={{
                            fontWeight: 'bold',
                            color: getAngerColor(trigger.anger_level_avg),
                          }}
                        >
                          {trigger.anger_level_avg.toFixed(1)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          レベル
                        </Typography>
                      </Box>
                    </Grid>

                    {/* 危険度（PCのみ詳細表示） */}
                    <Grid item xs={12} sm={4}>
                      <Box
                        display="flex"
                        justifyContent={{ xs: 'flex-start', sm: 'center' }}
                        gap={1}
                        flexWrap="wrap"
                        sx={{ mt: { xs: 1, sm: 0 } }}
                      >
                        <Chip
                          label={getAngerSeverityJa(trigger.anger_severity)}
                          size="small"
                          sx={{
                            backgroundColor:
                              getAngerColor(trigger.anger_level_avg) + '20',
                            color: getAngerColor(trigger.anger_level_avg),
                            fontSize: '0.7rem',
                            border: 'none',
                          }}
                        />
                        {trigger.needs_attention && (
                          <Chip
                            label="要注意"
                            size="small"
                            color="error"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              表示するデータがありません
            </Typography>
          </Box>
        )}
      </Paper>

      {/* 統計 */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {stats.totalTriggers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                トリガー種類
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {stats.totalOccurrences}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                総発生回数
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {stats.avgAngerLevel}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                平均怒りレベル
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error">
                {stats.dangerousTriggers}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                要注意トリガー
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AngerTrendMap
