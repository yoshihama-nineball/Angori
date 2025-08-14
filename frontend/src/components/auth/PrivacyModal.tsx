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
        <Typography
          paragraph
          sx={{
            textAlign: 'left',
            mt: 3,
            fontSize: { xs: '0.875rem', sm: '1rem' },
          }}
        >
          <strong>第1条（収集する情報）</strong>
        </Typography>

        <Typography
          paragraph
          sx={{ textAlign: 'left', fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
          <strong>1.1 利用者が提供する情報</strong>
          <br />• <strong>アカウント情報</strong>:
          メールアドレス、パスワード（暗号化保存）
          <br />• <strong>感情記録データ</strong>:
          <br />
          　○ 怒りレベル（1-10段階）
          <br />
          　○ 発生日時、場所
          <br />
          　○ 状況の詳細
          <br />
          　○ トリガー情報
          <br />
          　○ 感情の種類
          <br />
          　○ 継続時間
          <br />
          　○ 振り返り内容
          <br />• <strong>AI相談データ</strong>: GPT-4との対話内容
          <br />• <strong>任意提供情報</strong>: お問い合わせ内容
        </Typography>

        <Typography
          paragraph
          sx={{ textAlign: 'left', fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
          <strong>1.2 自動的に収集される情報</strong>
          <br />• <strong>利用状況</strong>: ログイン日時、機能利用履歴
          <br />• <strong>ゲーム情報</strong>:
          落ち着きポイント、レベル、連続記録日数
          <br />• <strong>技術情報</strong>:
          IPアドレス、ブラウザ情報、アクセス日時
        </Typography>

        <Typography
          paragraph
          sx={{ textAlign: 'left', fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
          <strong>1.3 外部サービス連携情報</strong>
          <br />• <strong>Googleアカウント</strong>:
          Googleログイン利用時のプロフィール情報（名前、メールアドレス）
        </Typography>

        <Typography
          paragraph
          sx={{ textAlign: 'left', fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
          <strong>第2条（利用目的）</strong>
          <br />
          収集した個人情報は以下の目的で利用します：
        </Typography>

        <Typography
          paragraph
          sx={{ textAlign: 'left', fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
          <strong>2.1 サービス提供目的</strong>
          <br />• アンガーマネジメント機能の提供
          <br />• AI相談機能でのアドバイス生成
          <br />• 過去データの管理・表示
          <br />• ゲーミフィケーション機能の提供
        </Typography>

        <Typography
          paragraph
          sx={{ textAlign: 'left', fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
          <strong>2.2 サービス改善目的</strong>
          <br />• 利用状況の分析（統計データとして匿名化）
          <br />• 新機能の開発・改善
          <br />• ユーザー体験の向上
        </Typography>

        <Typography
          paragraph
          sx={{ textAlign: 'left', fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
          <strong>2.3 運営目的</strong>
          <br />• 本人確認・認証
          <br />• お問い合わせ対応
          <br />• 規約違反の調査・対応
        </Typography>

        <Typography
          paragraph
          sx={{ textAlign: 'left', fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
          <strong>第3条（第三者提供）</strong>
        </Typography>

        <Typography
          paragraph
          sx={{ textAlign: 'left', fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
          <strong>3.1 提供する場合</strong>
          <br />
          個人情報は、以下の場合を除き第三者に提供しません：
          <br />• 利用者の同意がある場合
          <br />• 法令に基づく場合
          <br />• 人の生命・身体の保護のため緊急に必要な場合
        </Typography>

        <Typography
          paragraph
          sx={{ textAlign: 'left', fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
          <strong>3.2 外部サービス利用</strong>
          <br />
          以下の外部サービスを利用しており、それぞれのプライバシーポリシーが適用されます：
          <br />• <strong>OpenAI</strong>: AI相談機能でのGPT-4 API利用
          <br />
          　相談内容がOpenAIに送信されます
          <br />
          　OpenAIのプライバシーポリシー: https://openai.com/privacy
          <br />• <strong>Google</strong>: 認証サービス利用時
          <br />
          　Googleアカウント情報の連携
          <br />
          　Googleプライバシーポリシー: https://policies.google.com/privacy
        </Typography>

        <Typography
          paragraph
          sx={{ textAlign: 'left', fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
          <strong>第4条（利用者の権利）</strong>
        </Typography>

        <Typography
          paragraph
          sx={{ textAlign: 'left', fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
          <strong>4.1 開示・訂正・削除</strong>
          <br />
          利用者は以下の権利を有します：
          <br />• 個人情報の開示請求
          <br />• 個人情報の訂正・削除請求
          <br />• 利用停止請求
        </Typography>

        <Typography
          paragraph
          sx={{ textAlign: 'left', fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
          <strong>4.2 データポータビリティ</strong>
          <br />
          利用者は、自身の感情記録データのエクスポートを要求できます。
        </Typography>

        <Typography
          paragraph
          sx={{ textAlign: 'left', fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
          <strong>4.3 権利行使方法</strong>
          <br />
          上記権利の行使は、サービス内の設定画面または運営者への直接連絡により行えます。
        </Typography>

        <Typography
          paragraph
          sx={{ textAlign: 'left', fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
          <strong>第5条（Cookieの利用）</strong>
          <br />
          本サービスでは、利用者の利便性向上のためCookieを使用します：
          <br />• <strong>認証Cookie</strong>: ログイン状態の維持
          <br />• <strong>設定Cookie</strong>: ユーザー設定の保存
          <br />• <strong>分析Cookie</strong>:
          サービス改善のための利用状況分析（将来的実装予定）
        </Typography>

        <Typography
          paragraph
          sx={{ textAlign: 'left', fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
          <strong>第6条（お問い合わせ窓口）</strong>
          <br />
          個人情報の取り扱いに関するお問い合わせは、以下までご連絡ください：
          <br />• GitHub Issues:
          https://github.com/yoshihama-nineball/Angori/issues
          <br />• GitHub Discussions:
          https://github.com/yoshihama-nineball/Angori/discussions
        </Typography>

        <Typography
          paragraph
          sx={{ textAlign: 'left', fontSize: { xs: '0.875rem', sm: '1rem' } }}
        >
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
