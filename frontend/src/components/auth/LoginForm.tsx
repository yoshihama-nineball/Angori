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
  Container,
  Alert,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { loginUser, type ApiResponse } from '../../../lib/api/auth'
import { useAuthStore } from '../../../lib/stores/authStore'
import Loading from '../feedback/Loading/Loading'

const LoginForm = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<ApiResponse>({
    errors: [],
    success: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  // const [rememberMe, setRememberMe] = useState(false)
  const { setAuthenticated } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setResponse({ errors: [], success: '' })

    const formData = new FormData(e.currentTarget)
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }

    const result = await loginUser(data)
    setResponse(result)
    setLoading(false)

    if (result.success) {
      setAuthenticated(true) // 即座に認証状態更新
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000) // リダイレクトのみ2秒後
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
              ログイン
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 2,
                fontSize: { xs: '0.8rem', sm: '1rem' },
              }}
            >
              今日も来てくれてありがとうウホ！
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
                name="email"
                label="メールアドレス"
                type="email"
                fullWidth
                required
                placeholder="example@example.com"
                size="medium"
                autoComplete="email"
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
                size="medium"
                autoComplete="current-password"
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

              {/* ログイン状態を保持する */}
              {/* <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      size="small"
                      sx={{ mt: -1 }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                      ログイン状態を保持する
                    </Typography>
                  }
                  sx={{ alignItems: 'flex-start', ml: 0, mt: -1 }}
                />
              </Box> */}

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

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: { xs: 1.2, sm: 1.5 },
                  mt: { xs: -1, sm: -2 },
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  backgroundColor: !loading ? 'primary.main' : 'grey.300',
                  '&:hover': {
                    backgroundColor: !loading ? 'primary.dark' : 'grey.400',
                  },
                }}
              >
                {loading ? (
                  <>
                    <Loading />
                    ログイン中...
                  </>
                ) : (
                  '🍌 ログイン'
                )}
              </Button>

              {/* パスワードを忘れた場合のリンク */}
              <Box sx={{ textAlign: 'center' }}>
                {/* <Link
                  href="/auth/forgot-password"
                  sx={{
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    textDecoration: 'underline',
                    color: 'text.secondary',
                    display: 'block',
                    mb: 1,
                    '&:hover': {
                      color: 'primary.main',
                    },
                  }}
                >
                  パスワードを忘れた場合
                </Link> */}

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  }}
                >
                  アカウントをお持ちでない方は{' '}
                  <a
                    href="/auth/register"
                    style={{
                      color: 'inherit',
                      textDecoration: 'underline',
                      fontSize: 'inherit',
                    }}
                  >
                    新規登録
                  </a>
                </Typography>
              </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  )
}

export default LoginForm
