'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
  CircularProgress,
  Divider,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { loginUser, googleLogin, type ApiResponse } from '../../../lib/api/auth'
import { useAuthStore } from '../../../lib/stores/authStore'
import { LoginFormValues, LoginSchema } from '@/schemas/user'

const LoginForm = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [response, setResponse] = useState<ApiResponse>({
    errors: [],
    success: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const { setAuthenticated } = useAuthStore()

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  })

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true)
    setResponse({ errors: [], success: '' })

    try {
      const result = await loginUser(data)
      setResponse(result)

      if (result.success) {
        setAuthenticated(true)
        reset()
        router.push('/dashboard')
      }
    } catch {
      setResponse({
        errors: ['ログイン処理中にエラーが発生しました'],
        success: '',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setResponse({ errors: [], success: '' })

    try {
      const result = await googleLogin()
      setResponse(result)

      if (result.success) {
        setAuthenticated(true)
        router.push('/dashboard')
      }
    } catch {
      setResponse({
        errors: ['Googleログイン処理中にエラーが発生しました'],
        success: '',
      })
    } finally {
      setGoogleLoading(false)
    }
  }

  const hasServerErrors = response.errors && response.errors.length > 0
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

          {/* Googleログインボタン */}
          <Box sx={{ mb: 3 }}>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              disabled={googleLoading || loading}
              onClick={handleGoogleLogin}
              sx={{
                py: { xs: 1.2, sm: 1.5 },
                fontSize: { xs: '1rem', sm: '1.1rem' },
                borderColor: '#4285f4',
                color: '#4285f4',
                '&:hover': {
                  borderColor: '#3367d6',
                  backgroundColor: 'rgba(66, 133, 244, 0.04)',
                },
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              {googleLoading ? (
                <>
                  <CircularProgress size={20} sx={{ color: '#4285f4' }} />
                  Googleでログイン中...
                </>
              ) : (
                <>
                  <Box
                    component="svg"
                    sx={{ width: 20, height: 20 }}
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </Box>
                  Googleでログイン
                </>
              )}
            </Button>
          </Box>

          {/* 区切り線 */}
          <Divider sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              または
            </Typography>
          </Divider>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 4, sm: 6 },
              }}
            >
              {/* メールアドレスフィールド */}
              <TextField
                label="メールアドレス"
                type="email"
                fullWidth
                required
                placeholder="example@example.com"
                size="medium"
                autoComplete="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register('email')}
                InputLabelProps={{
                  shrink: true,
                }}
              />

              {/* パスワードフィールド */}
              <TextField
                label="パスワード"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                required
                size="medium"
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register('password')}
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
                        aria-label="パスワードの表示切替"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* サーバーエラーメッセージ表示 */}
              {hasServerErrors && (
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
                    ダッシュボードにリダイレクトします...
                  </Typography>
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading || isSubmitting || googleLoading}
                sx={{
                  py: { xs: 1.2, sm: 1.5 },
                  mt: { xs: -1, sm: -2 },
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  backgroundColor: !(loading || isSubmitting)
                    ? 'primary.main'
                    : 'grey.300',
                  '&:hover': {
                    backgroundColor: !(loading || isSubmitting)
                      ? 'primary.dark'
                      : 'grey.400',
                  },
                }}
              >
                {loading || isSubmitting ? (
                  <>
                    <CircularProgress size={16} sx={{ mr: 1 }} />
                    ログイン中...
                  </>
                ) : (
                  '🍌 ログイン'
                )}
              </Button>

              {/* パスワードを忘れた場合のリンク */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                  }}
                >
                  アカウントをお持ちでない方は{' '}
                  <a
                    href="/register"
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
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default LoginForm
