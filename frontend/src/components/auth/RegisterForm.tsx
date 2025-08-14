'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
  Container,
  Alert,
  CircularProgress,
} from '@mui/material'
import { Visibility, VisibilityOff, OpenInNew } from '@mui/icons-material'
import { registerUser, type ApiResponse } from '../../../lib/api/auth'

const RegisterForm = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<ApiResponse>({
    errors: [],
    success: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [termsModalOpen, setTermsModalOpen] = useState(false)
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false)

  // 成功時のリダイレクト処理
  React.useEffect(() => {
    if (response.success) {
      const timer = setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [response.success, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setResponse({ errors: [], success: '' })

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      password_confirmation: formData.get('password_confirmation') as string,
    }

    const result = await registerUser(data)
    setResponse(result)
    setLoading(false)
  }

  const hasErrors = response.errors && response.errors.length > 0
  const hasSuccess = response.success && response.success.length > 0

  return (
    <>
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 0,
            mt: '-64px',
          }}
        >
          <Paper
            elevation={4}
            sx={{
              p: 4,
              maxWidth: 500,
              width: '100%',
            }}
          >
            {/* ヘッダー */}
            <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
              <Typography
                variant="h4"
                fontWeight="bold"
                color="primary.dark"
                gutterBottom
                sx={{
                  fontSize: {
                    xs: '1.5rem',
                    sm: '2rem',
                    md: '2.5rem',
                  },
                }}
              >
                ユーザー登録
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 2,
                  fontSize: { xs: '0.8rem', sm: '1rem' },
                }}
              >
                ゴリラと一緒にアンガーマネジメントを始めよう！
              </Typography>
            </Box>

            <form onSubmit={handleSubmit} autoComplete="off">
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: { xs: 4, sm: 6 },
                }}
              >
                <TextField
                  name="name"
                  label="ユーザー名"
                  fullWidth
                  required
                  placeholder="ニックネームでOK"
                  size="medium"
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  name="email"
                  label="メールアドレス"
                  type="email"
                  fullWidth
                  required
                  placeholder="example@example.com"
                  size="medium"
                  autoComplete="off"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

                <TextField
                  name="password"
                  label="パスワード"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  required
                  helperText="8文字以上、大文字・小文字・数字を含む"
                  size="medium"
                  autoComplete="new-password"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    sx: {
                      '& input': {
                        color: '#000',
                      },
                      backgroundColor: '#fff',
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  name="password_confirmation"
                  label="パスワード（確認）"
                  type={showPasswordConfirmation ? 'text' : 'password'}
                  fullWidth
                  required
                  size="medium"
                  autoComplete="new-password"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    sx: {
                      '& input': {
                        color: '#000',
                      },
                      backgroundColor: '#fff',
                    },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowPasswordConfirmation(
                              !showPasswordConfirmation
                            )
                          }
                          edge="end"
                          size="small"
                        >
                          {showPasswordConfirmation ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* エラーメッセージ表示 */}
                {hasErrors && (
                  <Box>
                    {response.errors.map((error, index) => (
                      <Alert severity="error" key={index} sx={{ mb: 1 }}>
                        {error}
                      </Alert>
                    ))}
                  </Box>
                )}

                {/* 成功メッセージ表示 */}
                {hasSuccess && (
                  <Alert severity="success">
                    {response.success}
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      2秒後にダッシュボードにリダイレクトします...
                    </Typography>
                  </Alert>
                )}

                {/* 利用規約・プライバシーポリシー同意 */}
                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        size="small"
                        sx={{ mt: -1 }}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                        <Link
                          component="button"
                          type="button"
                          onClick={() => setTermsModalOpen(true)}
                          sx={{ textDecoration: 'underline', mr: 0.5 }}
                        >
                          利用規約
                        </Link>
                        および
                        <Link
                          component="button"
                          type="button"
                          onClick={() => setPrivacyModalOpen(true)}
                          sx={{ textDecoration: 'underline', mx: 0.5 }}
                        >
                          プライバシーポリシー
                        </Link>
                        に同意する
                      </Typography>
                    }
                    sx={{ alignItems: 'flex-start', ml: 0, mt: -1 }}
                  />
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={!agreeToTerms || loading}
                  sx={{
                    py: { xs: 1.2, sm: 1.5 },
                    mt: { xs: -1, sm: -2 },
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    backgroundColor:
                      agreeToTerms && !loading ? 'primary.main' : 'grey.300',
                    '&:hover': {
                      backgroundColor:
                        agreeToTerms && !loading ? 'primary.dark' : 'grey.400',
                    },
                  }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      登録中...
                    </>
                  ) : (
                    '🍌 アカウント作成'
                  )}
                </Button>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    textAlign: 'center',
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    mt: { xs: -1, sm: -3 },
                  }}
                >
                  既にアカウントをお持ちですか？{' '}
                  <a
                    href="/login"
                    style={{
                      color: 'inherit',
                      textDecoration: 'underline',
                      fontSize: 'inherit',
                    }}
                  >
                    ログイン
                  </a>
                </Typography>
              </Box>
            </form>
          </Paper>
        </Box>
      </Container>

      {/* 利用規約モーダル */}
      <Dialog
        open={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            🦍 Angori 利用規約
            <OpenInNew fontSize="small" />
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Typography paragraph>
            <strong>第1条（適用）</strong>
            <br />
            本規約は、Angori（以下「本サービス」）の利用に関して適用されます。
          </Typography>
          <Typography paragraph>
            <strong>第2条（利用目的）</strong>
            <br />
            本サービスは、ユーザーのアンガーマネジメントをサポートすることを目的としています。
            ゴリラのキャラクターと一緒に、健康的な感情管理を学ぶことができます。
          </Typography>
          <Typography paragraph>
            <strong>第3条（禁止事項）</strong>
            <br />
            以下の行為を禁止します：
            <br />• 他のユーザーへの誹謗中傷
            <br />• 本サービスの妨害行為
            <br />• バナナの独占（冗談です🍌）
          </Typography>
          <Typography paragraph>
            <strong>第4条（免責）</strong>
            <br />
            本サービスの利用により生じた損害について、当社は責任を負いかねます。
            ただし、ゴリラの可愛さによる癒し効果については保証いたします。
          </Typography>
          <Typography paragraph>
            <strong>第5条（規約の変更）</strong>
            <br />
            本規約は、ユーザーへの通知なく変更される場合があります。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTermsModalOpen(false)}>閉じる</Button>
        </DialogActions>
      </Dialog>

      {/* プライバシーポリシーモーダル */}
      <Dialog
        open={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            🔒 プライバシーポリシー
            <OpenInNew fontSize="small" />
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Typography paragraph>
            <strong>1. 収集する情報</strong>
            <br />
            以下の情報を収集します：
            <br />• ユーザー名（ニックネーム）
            <br />• メールアドレス
            <br />• アンガーログデータ
            <br />• 落ち着きポイント
          </Typography>
          <Typography paragraph>
            <strong>2. 情報の利用目的</strong>
            <br />
            収集した情報は以下の目的で利用します：
            <br />• サービスの提供・改善
            <br />• ユーザーサポート
            <br />• ゴリラからのアドバイス生成
            <br />• 統計データの作成（個人を特定できない形式）
          </Typography>
          <Typography paragraph>
            <strong>3. 情報の管理</strong>
            <br />
            お預かりした情報は適切に管理し、第三者への提供は行いません。
            ただし、ゴリラが興味を示しても絶対に教えません🦍
          </Typography>
          <Typography paragraph>
            <strong>4. Cookieについて</strong>
            <br />
            本サービスではCookieを使用してユーザー体験を向上させています。
          </Typography>
          <Typography paragraph>
            <strong>5. お問い合わせ</strong>
            <br />
            プライバシーに関するご質問は、お問い合わせフォームからご連絡ください。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPrivacyModalOpen(false)}>閉じる</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default RegisterForm
