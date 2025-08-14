import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material'

interface TermsModalProps {
  open: boolean
  onClose: () => void
}

const TermsModal: React.FC<TermsModalProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            justifyContent: 'center',
          }}
        >
          利用規約
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          gutterBottom
        >
          Angori（アンゴリ）サービス利用条件
        </Typography>
        <Typography
          variant="caption"
          display="block"
          color="text.secondary"
          sx={{ mb: 3, textAlign: 'right' }}
        >
          最終更新日：2025年8月11日
        </Typography>

        <Typography paragraph>
          <strong>第1条（サービス内容）</strong>
          <br />
          Angori（アンゴリ）は、アンガーマネジメントをサポートするWebアプリです。感情記録、AI相談、過去ログ管理などの機能を提供します。
        </Typography>

        <Typography paragraph>
          <strong>第2条（禁止事項）</strong>
          <br />
          以下の行為を禁止します：
        </Typography>
        <Box component="ul" sx={{ pl: 2, mb: 2 }}>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            法令に違反する行為
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            他の利用者に迷惑をかける行為
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            サービスの運営を妨害する行為
          </Typography>
          <Typography component="li" variant="body1">
            虚偽の情報を登録する行為
          </Typography>
        </Box>

        <Typography paragraph>
          <strong>第3条（免責事項）</strong>
        </Typography>
        <Box component="ol" sx={{ pl: 2, mb: 2 }}>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            本サービスは医療行為ではありません
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            AI相談の内容について責任を負いません
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            データの損失について責任を負いません
          </Typography>
          <Typography component="li" variant="body1">
            サービスの完全性を保証しません
          </Typography>
        </Box>

        <Typography paragraph>
          <strong>第4条（サービス変更・停止）</strong>
          <br />
          事前通知なくサービス内容の変更・停止を行う場合があります。
        </Typography>

        <Typography paragraph>
          <strong>第5条（規約変更）</strong>
          <br />
          必要に応じて本規約を変更することがあります。
        </Typography>

        <Typography paragraph>
          <strong>第6条（準拠法）</strong>
          <br />
          本規約は日本法に準拠します。
        </Typography>

        <Typography
          variant="h6"
          sx={{ mt: 3, textAlign: 'center', fontWeight: 'bold' }}
        >
          以上
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>閉じる</Button>
      </DialogActions>
    </Dialog>
  )
}

export default TermsModal
