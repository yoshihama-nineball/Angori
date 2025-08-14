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

interface PrivacyModalProps {
  open: boolean
  onClose: () => void
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ open, onClose }) => {
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
          プライバシーポリシー
        </Box>
      </DialogTitle>
      <DialogContent dividers>

        <Typography paragraph>
          <strong>第1条（収集する情報）</strong>
        </Typography>

        <Typography
          variant="subtitle2"
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          1.1 利用者が提供する情報
        </Typography>
        <Box component="ul" sx={{ pl: 2, mb: 2 }}>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            <strong>アカウント情報</strong>:
            メールアドレス、パスワード（暗号化保存）
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            <strong>感情記録データ</strong>:
            <Box component="ul" sx={{ pl: 2, mt: 1 }}>
              <Typography component="li" variant="body1">
                怒りレベル（1-10段階）
              </Typography>
              <Typography component="li" variant="body1">
                発生日時、場所
              </Typography>
              <Typography component="li" variant="body1">
                状況の詳細
              </Typography>
              <Typography component="li" variant="body1">
                トリガー情報
              </Typography>
              <Typography component="li" variant="body1">
                感情の種類
              </Typography>
              <Typography component="li" variant="body1">
                継続時間
              </Typography>
              <Typography component="li" variant="body1">
                振り返り内容
              </Typography>
            </Box>
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            <strong>AI相談データ</strong>: GPT-4との対話内容
          </Typography>
          <Typography component="li" variant="body1">
            <strong>任意提供情報</strong>: お問い合わせ内容
          </Typography>
        </Box>

        <Typography
          variant="subtitle2"
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          1.2 自動的に収集される情報
        </Typography>
        <Box component="ul" sx={{ pl: 2, mb: 2 }}>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            <strong>利用状況</strong>: ログイン日時、機能利用履歴
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            <strong>ゲーム情報</strong>: 落ち着きポイント、レベル、連続記録日数
          </Typography>
          <Typography component="li" variant="body1">
            <strong>技術情報</strong>: IPアドレス、ブラウザ情報、アクセス日時
          </Typography>
        </Box>

        <Typography
          variant="subtitle2"
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          1.3 外部サービス連携情報
        </Typography>
        <Box component="ul" sx={{ pl: 2, mb: 2 }}>
          <Typography component="li" variant="body1">
            <strong>Googleアカウント</strong>:
            Googleログイン利用時のプロフィール情報（名前、メールアドレス）
          </Typography>
        </Box>

        <Typography paragraph sx={{ mt: 3 }}>
          <strong>第2条（利用目的）</strong>
          <br />
          収集した個人情報は以下の目的で利用します：
        </Typography>

        <Typography
          variant="subtitle2"
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          2.1 サービス提供目的
        </Typography>
        <Box component="ul" sx={{ pl: 2, mb: 2 }}>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            アンガーマネジメント機能の提供
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            AI相談機能でのアドバイス生成
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            過去データの管理・表示
          </Typography>
          <Typography component="li" variant="body1">
            ゲーミフィケーション機能の提供
          </Typography>
        </Box>

        <Typography
          variant="subtitle2"
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          2.2 サービス改善目的
        </Typography>
        <Box component="ul" sx={{ pl: 2, mb: 2 }}>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            利用状況の分析（統計データとして匿名化）
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            新機能の開発・改善
          </Typography>
          <Typography component="li" variant="body1">
            ユーザー体験の向上
          </Typography>
        </Box>

        <Typography
          variant="subtitle2"
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          2.3 運営目的
        </Typography>
        <Box component="ul" sx={{ pl: 2, mb: 2 }}>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            本人確認・認証
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            お問い合わせ対応
          </Typography>
          <Typography component="li" variant="body1">
            規約違反の調査・対応
          </Typography>
        </Box>

        <Typography paragraph sx={{ mt: 3 }}>
          <strong>第3条（第三者提供）</strong>
        </Typography>

        <Typography
          variant="subtitle2"
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          3.1 提供する場合
        </Typography>
        <Typography variant="body1" paragraph>
          個人情報は、以下の場合を除き第三者に提供しません：
        </Typography>
        <Box component="ul" sx={{ pl: 2, mb: 2 }}>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            利用者の同意がある場合
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            法令に基づく場合
          </Typography>
          <Typography component="li" variant="body1">
            人の生命・身体の保護のため緊急に必要な場合
          </Typography>
        </Box>

        <Typography
          variant="subtitle2"
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          3.2 外部サービス利用
        </Typography>
        <Typography variant="body1" paragraph>
          以下の外部サービスを利用しており、それぞれのプライバシーポリシーが適用されます：
        </Typography>
        <Box component="ul" sx={{ pl: 2, mb: 2 }}>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            <strong>OpenAI</strong>: AI相談機能でのGPT-4 API利用
            <br />
            <Typography variant="body2" component="span">
              相談内容がOpenAIに送信されます
              <br />
              OpenAIのプライバシーポリシー: https://openai.com/privacy
            </Typography>
          </Typography>
          <Typography component="li" variant="body1">
            <strong>Google</strong>: 認証サービス利用時
            <br />
            <Typography variant="body2" component="span">
              Googleアカウント情報の連携
              <br />
              Googleプライバシーポリシー: https://policies.google.com/privacy
            </Typography>
          </Typography>
        </Box>

        <Typography paragraph sx={{ mt: 3 }}>
          <strong>第4条（利用者の権利）</strong>
        </Typography>

        <Typography
          variant="subtitle2"
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          4.1 開示・訂正・削除
        </Typography>
        <Typography variant="body1" paragraph>
          利用者は以下の権利を有します：
        </Typography>
        <Box component="ul" sx={{ pl: 2, mb: 2 }}>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            個人情報の開示請求
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            個人情報の訂正・削除請求
          </Typography>
          <Typography component="li" variant="body1">
            利用停止請求
          </Typography>
        </Box>

        <Typography
          variant="subtitle2"
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          4.2 データポータビリティ
        </Typography>
        <Typography variant="body1" paragraph>
          利用者は、自身の感情記録データのエクスポートを要求できます。
        </Typography>

        <Typography
          variant="subtitle2"
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          4.3 権利行使方法
        </Typography>
        <Typography variant="body1" paragraph>
          上記権利の行使は、サービス内の設定画面または運営者への直接連絡により行えます。
        </Typography>

        <Typography paragraph sx={{ mt: 3 }}>
          <strong>第5条（Cookieの利用）</strong>
          <br />
          本サービスでは、利用者の利便性向上のためCookieを使用します：
        </Typography>
        <Box component="ul" sx={{ pl: 2, mb: 2 }}>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            <strong>認証Cookie</strong>: ログイン状態の維持
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            <strong>設定Cookie</strong>: ユーザー設定の保存
          </Typography>
          <Typography component="li" variant="body1">
            <strong>分析Cookie</strong>:
            サービス改善のための利用状況分析（将来的実装予定）
          </Typography>
        </Box>

        <Typography paragraph sx={{ mt: 3 }}>
          <strong>第6条（お問い合わせ窓口）</strong>
          <br />
          個人情報の取り扱いに関するお問い合わせは、以下までご連絡ください：
        </Typography>
        <Box component="ul" sx={{ pl: 2, mb: 2 }}>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            GitHub Issues: https://github.com/yoshihama-nineball/Angori/issues
          </Typography>
          <Typography component="li" variant="body1">
            GitHub Discussions:
            https://github.com/yoshihama-nineball/Angori/discussions
          </Typography>
        </Box>

        <Typography paragraph>
          <strong>第7条（ポリシー変更）</strong>
          <br />
          本ポリシーを変更する場合は、サービス内での通知により利用者にお知らせします。重要な変更の場合は、30日前に事前通知を行います。
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

export default PrivacyModal
