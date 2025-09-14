'use client'

import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Grid,
  Divider,
  IconButton,
  useTheme,
} from '@mui/material'
import { Close as CloseIcon, Share as ShareIcon } from '@mui/icons-material'
import { AngerLog } from '@/schemas/anger_log'
import dayjs from 'dayjs'

interface AngerLogDetailModalProps {
  open: boolean
  onClose: () => void
  angerLog: AngerLog | null
  loading?: boolean
}

const AngerLogDetailModal: React.FC<AngerLogDetailModalProps> = ({
  open,
  onClose,
  angerLog,
  loading = false,
}) => {
  const theme = useTheme()

  // 感情を配列に変換
  const getSelectedEmotions = () => {
    if (!angerLog?.emotions_felt) return []

    if (Array.isArray(angerLog.emotions_felt)) {
      return angerLog.emotions_felt
    }

    if (typeof angerLog.emotions_felt === 'object') {
      return Object.entries(angerLog.emotions_felt)
        .filter(([_, value]) => value === true)
        .map(([emotion, _]) => emotion)
    }

    return []
  }

  const selectedEmotions = getSelectedEmotions()

  // シェア機能
  const handleShare = () => {
    if (!angerLog) return

    const shareText = `過去のアンガーマネジメント記録を振り返ったウホ！🦍

怒りレベル: ${angerLog.anger_level}/10
感情: ${selectedEmotions.join('、')}
自分と向き合い続けています！

Dr.ゴリと一緒にあなたも始めてみませんか？

#アンガーマネジメント #アンゴリ #メンタルヘルス

https://angori.vercel.app`

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
    window.open(twitterUrl, '_blank')
  }

  // 怒りレベルの色を取得
  const getAngerLevelColor = (level: number) => {
    if (level <= 3) return '#4caf50' // 緑
    if (level <= 6) return '#ff9800' // オレンジ
    return '#f44336' // 赤
  }

  if (!angerLog && !loading) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '85vh',
          marginTop: '20px',
          marginBottom: '20px',
        },
      }}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, position: 'relative' }}>
        <Typography variant="h6" component="div" sx={{ pr: 5 }}>
          アンガーログ詳細
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={200}
          >
            <Typography>読み込み中ウホ...</Typography>
          </Box>
        ) : angerLog ? (
          <>
            {/* 記録内容 - 先に表示 */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ color: '#333', fontWeight: 600 }}
              >
                📋 記録内容
              </Typography>

              <Grid container spacing={2}>
                {/* 発生日時 */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      発生日時
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {dayjs(angerLog.occurred_at).format(
                        'YYYY年MM月DD日 HH:mm'
                      )}
                    </Typography>
                  </Box>
                </Grid>

                {/* 場所 */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      場所
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {angerLog.location || '未入力'}
                    </Typography>
                  </Box>
                </Grid>

                {/* 怒りレベル */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      怒りレベル
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          bgcolor: getAngerLevelColor(angerLog.anger_level),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      >
                        {angerLog.anger_level}
                      </Box>
                      <Typography variant="body1" fontWeight="500">
                        / 10
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* 感情 */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      感じた感情
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {selectedEmotions.length > 0 ? (
                        selectedEmotions.map((emotion) => (
                          <Chip
                            key={emotion}
                            label={emotion}
                            size="small"
                            sx={{
                              bgcolor:
                                theme.palette.gorilla?.lightBanana || '#fff3e0',
                              color: theme.palette.gorilla?.fur || '#333',
                            }}
                          />
                        ))
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          未選択
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Grid>

                {/* 状況説明 */}
                <Grid item xs={12}>
                  <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      状況説明
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {angerLog.situation_description}
                    </Typography>
                  </Box>
                </Grid>

                {/* 出来事の捉え方 */}
                <Grid item xs={12}>
                  <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      gutterBottom
                    >
                      出来事の捉え方
                    </Typography>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {angerLog.perception || '未入力'}
                    </Typography>
                  </Box>
                </Grid>

                {/* トリガー */}
                {angerLog.trigger_words && (
                  <Grid item xs={12}>
                    <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        gutterBottom
                      >
                        トリガー
                      </Typography>
                      <Typography variant="body1">
                        {angerLog.trigger_words}
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {/* 振り返り */}
                {angerLog.reflection && (
                  <Grid item xs={12}>
                    <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        gutterBottom
                      >
                        振り返り
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ whiteSpace: 'pre-wrap' }}
                      >
                        {angerLog.reflection}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>

            {/* AIアドバイス - 後に表示 */}
            {angerLog.ai_advice && (
              <>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    🎯 Dr.ゴリからのアドバイス
                  </Typography>
                  <Box
                    sx={{
                      p: { xs: 2, sm: 3 },
                      bgcolor: `${theme.palette.gorilla?.lightBanana || '#fff3e0'}20`,
                      border: `2px solid ${theme.palette.gorilla?.lightBanana || '#fff3e0'}`,
                      borderRadius: 3,
                      position: 'relative',
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        whiteSpace: 'pre-wrap',
                        lineHeight: { xs: 1.5, sm: 1.6 },
                        fontSize: { xs: '14px', sm: '16px' },
                      }}
                    >
                      {angerLog.ai_advice}
                    </Typography>
                  </Box>
                </Box>
              </>
            )}
          </>
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={200}
          >
            <Typography>データが見つかりませんでした</Typography>
          </Box>
        )}
      </DialogContent>

      {/* アクションボタン */}
      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          pt: 1,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 1,
          alignItems: 'stretch',
        }}
      >
        <Button
          variant="outlined"
          onClick={handleShare}
          startIcon={<ShareIcon />}
          sx={{
            borderColor: '#1DA1F2',
            color: '#1DA1F2',
            '&:hover': {
              borderColor: '#1a91da',
              bgcolor: '#e3f2fd',
            },
            borderRadius: 2,
            px: 3,
          }}
        >
          Xでシェア
        </Button>
        <Button variant="contained" color="primary" onClick={onClose}>
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AngerLogDetailModal
