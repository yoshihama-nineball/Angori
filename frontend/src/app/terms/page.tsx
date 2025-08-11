'use client'

import {
  Container,
  Typography,
  Box,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material'

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
          Angori（アンゴリ）サービス利用条件
        </Typography>

        <Typography
          variant="caption"
          align={isMobile ? 'center' : 'right'}
          display="block"
          color="text.secondary"
          mb={isMobile ? 3 : 4}
        >
          最終更新日：2025年8月11日
        </Typography>

        {/* 第1条 */}
        <Box mb={isMobile ? 3 : 4}>
          <Typography variant="h6" gutterBottom>
            第1条（サービス内容）
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ fontSize: isMobile ? '0.95rem' : '1.05rem' }}
          >
            Angori（アンゴリ）は、アンガーマネジメントをサポートするWebアプリです。感情記録、AI相談、過去ログ管理などの機能を提供します。
          </Typography>
        </Box>

        {!isMobile && <Divider />}

        {/* 第2条 */}
        <Box mt={isMobile ? 3 : 5} mb={isMobile ? 3 : 4}>
          <Typography variant="h6" gutterBottom>
            第2条（禁止事項）
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ fontSize: isMobile ? '0.95rem' : '1.05rem' }}
          >
            以下の行為を禁止します：
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <Typography
              component="li"
              variant="body1"
              sx={{ fontSize: isMobile ? '0.95rem' : '1.05rem', mb: 1 }}
            >
              法令に違反する行為
            </Typography>
            <Typography
              component="li"
              variant="body1"
              sx={{ fontSize: isMobile ? '0.95rem' : '1.05rem', mb: 1 }}
            >
              他の利用者に迷惑をかける行為
            </Typography>
            <Typography
              component="li"
              variant="body1"
              sx={{ fontSize: isMobile ? '0.95rem' : '1.05rem', mb: 1 }}
            >
              サービスの運営を妨害する行為
            </Typography>
            <Typography
              component="li"
              variant="body1"
              sx={{ fontSize: isMobile ? '0.95rem' : '1.05rem' }}
            >
              虚偽の情報を登録する行為
            </Typography>
          </Box>
        </Box>

        {!isMobile && <Divider />}

        {/* 第3条 */}
        <Box mt={isMobile ? 3 : 5} mb={isMobile ? 3 : 4}>
          <Typography variant="h6" gutterBottom>
            第3条（免責事項）
          </Typography>
          <Box component="ol" sx={{ pl: 2 }}>
            <Typography
              component="li"
              variant="body1"
              sx={{ fontSize: isMobile ? '0.95rem' : '1.05rem', mb: 1 }}
            >
              本サービスは医療行為ではありません
            </Typography>
            <Typography
              component="li"
              variant="body1"
              sx={{ fontSize: isMobile ? '0.95rem' : '1.05rem', mb: 1 }}
            >
              AI相談の内容について責任を負いません
            </Typography>
            <Typography
              component="li"
              variant="body1"
              sx={{ fontSize: isMobile ? '0.95rem' : '1.05rem', mb: 1 }}
            >
              データの損失について責任を負いません
            </Typography>
            <Typography
              component="li"
              variant="body1"
              sx={{ fontSize: isMobile ? '0.95rem' : '1.05rem' }}
            >
              サービスの完全性を保証しません
            </Typography>
          </Box>
        </Box>

        {!isMobile && <Divider />}

        {/* 第4条 */}
        <Box mt={isMobile ? 3 : 5} mb={isMobile ? 3 : 4}>
          <Typography variant="h6" gutterBottom>
            第4条（サービス変更・停止）
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ fontSize: isMobile ? '0.95rem' : '1.05rem' }}
          >
            事前通知なくサービス内容の変更・停止を行う場合があります。
          </Typography>
        </Box>

        {!isMobile && <Divider />}

        {/* 第5条 */}
        <Box mt={isMobile ? 3 : 5} mb={isMobile ? 3 : 4}>
          <Typography variant="h6" gutterBottom>
            第5条（規約変更）
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ fontSize: isMobile ? '0.95rem' : '1.05rem' }}
          >
            必要に応じて本規約を変更することがあります。
          </Typography>
        </Box>

        {!isMobile && <Divider />}

        {/* 第6条 */}
        <Box mt={isMobile ? 3 : 5} mb={isMobile ? 3 : 4}>
          <Typography variant="h6" gutterBottom>
            第6条（準拠法）
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ fontSize: isMobile ? '0.95rem' : '1.05rem' }}
          >
            本規約は日本法に準拠します。
          </Typography>
        </Box>

        {!isMobile && <Divider />}
        <Box mt={isMobile ? 4 : 6}>
          <Typography variant="h6" sx={{ mb: 8 }} gutterBottom>
            以上
          </Typography>
        </Box>
      </Box>
    </Container>
  )
}
