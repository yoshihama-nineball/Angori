'use client'

import { Container, Typography, Box, Divider, useMediaQuery, useTheme } from '@mui/material'

export default function TermsPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <Container maxWidth="md">
      <Box py={isMobile ? 4 : 8} px={isMobile ? 2 : 6}>
        <Typography
          variant={isMobile ? 'h5' : 'h3'}
          align="center"
          gutterBottom
        >
          利用規約
        </Typography>

        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          gutterBottom
          sx={{ fontSize: isMobile ? '0.9rem' : '1rem' }}
        >
          サービス利用条件
        </Typography>

        <Typography
          variant="caption"
          align={isMobile ? 'center' : 'right'}
          display="block"
          color="text.secondary"
          mb={isMobile ? 3 : 4}
        >
          最終更新日：2025年4月13日
        </Typography>

        <Box mb={isMobile ? 3 : 4}>
          <Typography variant="h6" gutterBottom>
            第1条（適用）
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ fontSize: isMobile ? '0.95rem' : '1.05rem' }}
          >
            本規約は、ユーザーと当社との間のサービス利用に関する条件を定めるものです。
          </Typography>
        </Box>

        {!isMobile && <Divider />}

        <Box mt={isMobile ? 3 : 5}>
          <Typography variant="h6" gutterBottom>
            第2条（定義）
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ fontSize: isMobile ? '0.95rem' : '1.05rem' }}
          >
            本規約において「ユーザー」とは、当社のサービスを利用するすべての者を指します。
          </Typography>
        </Box>
      </Box>
    </Container>
  )
}
