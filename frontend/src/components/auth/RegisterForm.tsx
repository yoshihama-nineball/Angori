'use client'

import React, { useState } from 'react'
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
  Alert,
  Container,
  CircularProgress,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

// 通常のfetch用の型定義
type ApiResponse = {
  errors: string[]
  success: string
}

const RegisterForm = () => {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<ApiResponse>({
    errors: [],
    success: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  // 成功時のリダイレクト処理
  React.useEffect(() => {
    if (response.success) {
      const timer = setTimeout(() => {
        window.location.href = '/dashboard'
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [response.success])

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

    console.log('🔍 Frontend submit started')
    console.log('📊 Form data:', data)

    try {
      // Docker環境での正しいアクセス方法
      // ブラウザからはlocalhost経由でアクセス
      const API_BASE = 'http://localhost:5000'
      const apiUrl = `${API_BASE}/api/v1/users`

      console.log('📡 Calling API directly:', apiUrl)

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: data,
        }),
      })

      console.log('📡 Response status:', response.status)

      // レスポンステキストを先に取得
      const responseText = await response.text()
      console.log('📡 Raw response:', responseText.substring(0, 300))

      let result: ApiResponse
      try {
        const apiData = JSON.parse(responseText)

        if (response.ok) {
          // JWTトークンを確認・保存
          const authToken = response.headers.get('Authorization')
          console.log('🔑 JWT Token received:', authToken ? 'Yes' : 'No')

          if (authToken) {
            // HttpOnlyクッキーとして保存（セキュア）
            document.cookie = `auth_token=${authToken}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=strict`
            console.log('🍪 Token saved to cookie')
          } else {
            console.log('⚠️ No JWT token received from backend')
          }

          result = {
            errors: [],
            success:
              '🎉 登録が完了しました！ダッシュボードにリダイレクトします...',
          }
        } else {
          // エラーレスポンスの処理
          const errorMessages = []
          if (apiData.message) errorMessages.push(apiData.message)
          if (apiData.errors) {
            if (Array.isArray(apiData.errors)) {
              errorMessages.push(...apiData.errors)
            }
          }

          result = {
            errors:
              errorMessages.length > 0 ? errorMessages : ['登録に失敗しました'],
            success: '',
          }
        }
      } catch (parseError) {
        console.log('❌ JSON parse failed')
        result = {
          errors: [
            'サーバーからの応答が正しくありません（HTML エラーページが返されました）',
          ],
          success: '',
        }
      }

      setResponse(result)
    } catch (error) {
      console.error('❌ Network error:', error)
      setResponse({
        errors: [`ネットワークエラーが発生しました: ${error}`],
        success: '',
      })
    } finally {
      setLoading(false)
    }
  }

  const hasErrors = response.errors && response.errors.length > 0
  const hasSuccess = response.success && response.success.length > 0

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
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
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              color="primary.dark"
              gutterBottom
            >
              ユーザー登録
            </Typography>
            <Typography variant="body3" color="text.secondary">
              一緒にアンガーマネジメントを始めようウホ！
            </Typography>
          </Box>

          <form onSubmit={handleSubmit} autoComplete="off">
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              <TextField
                name="name"
                label="ユーザー名"
                fullWidth
                required
                placeholder="ニックネームでOK"
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                name="email"
                label="メールアドレス"
                type="email"
                fullWidth
                required
                placeholder="example@example.com"
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                name="password"
                label="パスワード"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                required
                helperText="8文字以上、大文字・小文字・数字を含む"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
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
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowPasswordConfirmation(!showPasswordConfirmation)
                        }
                        edge="end"
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

              {/* 利用規約同意 */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                  />
                }
                label="利用規約およびプライバシーポリシーに同意する"
              />

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
                sx={{ textAlign: 'center' }}
              >
                既にアカウントをお持ちですか？{' '}
                <a
                  href="/login"
                  style={{ color: 'inherit', textDecoration: 'underline' }}
                >
                  ログイン
                </a>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  )
}

export default RegisterForm
