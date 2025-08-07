'use client'

import {
  Container,
  Typography,
  Box,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material'

export default function PrivacyPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: false,
    noSsr: true,
  })

  return (
    <Container maxWidth="md">
      <Box py={isMobile ? 4 : 8} px={isMobile ? 2 : 6}>
        {/* タイトル */}
        <Typography
          variant={isMobile ? 'h5' : 'h3'}
          align="center"
          gutterBottom
        >
          プライバシーポリシー
        </Typography>

        {/* サブタイトル */}
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          gutterBottom
          sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}
        >
          個人情報の取り扱いについて
        </Typography>

        {/* 更新日 */}
        <Typography
          variant="caption"
          align={isMobile ? 'center' : 'right'}
          display="block"
          color="text.secondary"
          mb={isMobile ? 2 : 4}
        >
          最終更新日：2025年4月13日
        </Typography>

        {/* セクション1 */}
        <Box mb={isMobile ? 3 : 4}>
          <Typography variant="h6" gutterBottom>
            第1条（収集する情報）
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ fontSize: isMobile ? '0.95rem' : '1.05rem' }}
          >
            当サービスでは、ユーザーのメールアドレス、利用履歴、端末情報などを収集する場合があります。
          </Typography>
        </Box>

        {!isMobile && <Divider />}

        {/* セクション2 */}
        <Box mt={isMobile ? 3 : 5}>
          <Typography variant="h6" gutterBottom>
            第2条（利用目的）
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ fontSize: isMobile ? '0.95rem' : '1.05rem' }}
          >
            収集した情報は、サービスの改善、通知の送信、ユーザーサポートのために利用されます。
          </Typography>
        </Box>

        {/* 以下、必要に応じて追加 */}
      </Box>
    </Container>
  )
}
