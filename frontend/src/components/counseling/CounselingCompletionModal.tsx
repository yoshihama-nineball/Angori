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
import {
  Home as HomeIcon,
  Close as CloseIcon,
  Share as ShareIcon,
} from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import type { AngerLogFormData } from '@/types/counseling'
import dayjs from 'dayjs'

interface CounselingCompletionModalProps {
  open: boolean
  onClose: () => void
  angerLogData: AngerLogFormData
  aiAdvice: string
}

export const CounselingCompletionModal: React.FC<
  CounselingCompletionModalProps
> = ({ open, onClose, angerLogData, aiAdvice }) => {
  const theme = useTheme()
  const router = useRouter()

  // 感情を配列に変換
  const selectedEmotions = Object.keys(angerLogData.emotions_felt || {}).filter(
    (emotion) => angerLogData.emotions_felt[emotion]
  )

  // シェア機能
  const handleShare = () => {
    const shareText = `アンガーマネジメント相談室で気持ちを整理しました🦍💚\n怒りレベル: ${angerLogData.anger_level}/10\n感情: ${selectedEmotions.join('、')}\n今日も自分と向き合えました！\n\n#アンガーマネジメント #アンゴリ`

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
    window.open(twitterUrl, '_blank')

    // シェア後にトップに戻る
    handleGoHome()
  }

  // トップページに戻る
  const handleGoHome = () => {
    router.push('/dashboard')
    onClose()
  }

  // 怒りレベルの色を取得
  const getAngerLevelColor = (level: number) => {
    if (level <= 3) return theme.palette.success.main
    if (level <= 6) return theme.palette.warning.main
    return theme.palette.error.main
  }

  return (
    <Dialog
      open={open}
      onClose={handleGoHome}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '85vh',
          marginTop: '80px', // ヘッダーの高さ分下にずらす
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
        <IconButton
          onClick={handleGoHome}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ my: 4 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: theme.palette.gorilla.fur, fontWeight: 600 }}
          >
            🎯 Dr.ゴリからのアドバイス
          </Typography>
          <Box
            sx={{
              p: 3,
              bgcolor: `${theme.palette.gorilla.lightBanana}20`,
              border: `2px solid ${theme.palette.gorilla.lightBanana}`,
              borderRadius: 3,
              position: 'relative',
            }}
          >
            <Typography
              variant="body1"
              sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}
            >
              {aiAdvice || 'AIアドバイスを生成中です...'}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* 相談内容サマリー */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ color: theme.palette.gorilla.fur, fontWeight: 600 }}
          >
            📋 今回の記録
          </Typography>

          <Grid container spacing={2}>
            {/* 発生日時 */}
            {/* 発生日時 */}
            <Grid item xs={12} sm={6}>
              <Box
                sx={{ p: 2, bgcolor: theme.palette.grey[50], borderRadius: 2 }}
              >
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  発生日時
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {angerLogData.occurred_at
                    ? dayjs(angerLogData.occurred_at).format(
                        'YYYY年MM月DD日 HH:mm'
                      )
                    : '未入力'}
                </Typography>
              </Box>
            </Grid>

            {/* 場所 */}
            <Grid item xs={12} sm={6}>
              <Box
                sx={{ p: 2, bgcolor: theme.palette.grey[50], borderRadius: 2 }}
              >
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  場所
                </Typography>
                <Typography variant="body1" fontWeight="500">
                  {angerLogData.location || '未入力'}
                </Typography>
              </Box>
            </Grid>

            {/* 怒りレベル */}
            <Grid item xs={12} sm={6}>
              <Box
                sx={{ p: 2, bgcolor: theme.palette.grey[50], borderRadius: 2 }}
              >
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  怒りレベル
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: getAngerLevelColor(angerLogData.anger_level),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  >
                    {angerLogData.anger_level}
                  </Box>
                  <Typography variant="body1" fontWeight="500">
                    / 10
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* 感情 */}
            <Grid item xs={12} sm={6}>
              <Box
                sx={{ p: 2, bgcolor: theme.palette.grey[50], borderRadius: 2 }}
              >
                <Typography variant="body2" color="textSecondary" gutterBottom>
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
                          bgcolor: theme.palette.gorilla.lightBanana,
                          color: theme.palette.gorilla.fur,
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
              <Box
                sx={{ p: 2, bgcolor: theme.palette.grey[50], borderRadius: 2 }}
              >
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  状況説明
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {angerLogData.situation_description || '未入力'}
                </Typography>
              </Box>
            </Grid>

            {/* トリガー */}
            {angerLogData.trigger_words && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: theme.palette.grey[50],
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    トリガー
                  </Typography>
                  <Typography variant="body1">
                    {angerLogData.trigger_words}
                  </Typography>
                </Box>
              </Grid>
            )}

            {/* 振り返り */}
            {angerLogData.reflection && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: theme.palette.grey[50],
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    振り返り
                  </Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {angerLogData.reflection}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>

      {/* アクションボタン */}
      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          pt: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          alignItems: 'stretch',
          '& > *': {
            width: '100% !important',
            margin: '0 !important',
          },
        }}
      >
        <Button
          variant="contained"
          onClick={handleShare}
          startIcon={<ShareIcon />}
          fullWidth
          sx={{
            bgcolor: '#1DA1F2',
            color: 'white',
            '&:hover': {
              bgcolor: '#1a91da',
            },
            borderRadius: 3,
            px: 3,
            margin: '0 !important',
            minWidth: 'unset !important',
          }}
        >
          Xでシェアする
        </Button>
        <Button
          variant="outlined"
          onClick={handleGoHome}
          startIcon={<HomeIcon />}
          fullWidth
          sx={{
            borderColor: theme.palette.gorilla.fur,
            color: theme.palette.gorilla.fur,
            '&:hover': {
              borderColor: theme.palette.gorilla.darkFur,
              bgcolor: `${theme.palette.gorilla.fur}08`,
            },
            borderRadius: 3,
            px: 3,
            margin: '0 !important',
            minWidth: 'unset !important',
          }}
        >
          トップに戻る
        </Button>
      </DialogActions>
    </Dialog>
  )
}
