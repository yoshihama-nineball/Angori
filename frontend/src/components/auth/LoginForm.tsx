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
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { loginUser, type ApiResponse } from '../../../lib/api/auth'
import { useAuthStore } from '../../../lib/stores/authStore'
import { LoginFormValues, LoginSchema } from '@/schemas/user'

const LoginForm = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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
    mode: 'onChange', // リアルタイムバリデーション
  })

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true)
    setResponse({ errors: [], success: '' })

    try {
      const result = await loginUser(data)
      setResponse(result)

      if (result.success) {
        setAuthenticated(true)
        reset() // フォームをリセット
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
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
                    2秒後にダッシュボードにリダイレクトします...
                  </Typography>
                </Alert>
              )}

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading || isSubmitting}
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
