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
  FormControlLabel,
  Checkbox,
  Link,
  Container,
  Alert,
  CircularProgress,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { registerUser, type ApiResponse } from '../../../lib/api/auth'
import TermsModal from './TermsModal'
import PrivacyModal from './PrivacyModal'
import { RegisterFormValues, RegisterSchema } from '@/schemas/user'

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

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
    mode: 'onChange', // リアルタイムバリデーション
  })

  // パスワードの値を監視（確認用パスワードのバリデーションで使用）
  // const watchedPassword = watch('password')

  // 成功時のリダイレクト処理
  React.useEffect(() => {
    if (response.success) {
      const timer = setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [response.success, router])

  const onSubmit = async (data: RegisterFormValues) => {
    if (!agreeToTerms) {
      setResponse({
        errors: ['利用規約とプライバシーポリシーに同意する必要があります'],
        success: '',
      })
      return
    }

    setLoading(true)
    setResponse({ errors: [], success: '' })

    try {
      const result = await registerUser(data)
      setResponse(result)

      if (result.success) {
        reset() // フォームをリセット
      }
    } catch {
      setResponse({
        errors: ['登録処理中にエラーが発生しました'],
        success: '',
      })
    } finally {
      setLoading(false)
    }
  }

  const hasServerErrors = response.errors && response.errors.length > 0
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
            py: { xs: 2, sm: 4 },
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

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: { xs: 4, sm: 6 },
                }}
              >
                {/* ユーザー名フィールド */}
                <TextField
                  label="ユーザー名"
                  fullWidth
                  required
                  placeholder="ニックネームでOK"
                  size="medium"
                  autoComplete="username"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  {...register('name')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

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
                  autoComplete="new-password"
                  error={!!errors.password}
                  helperText={
                    errors.password?.message ||
                    '8文字以上、大文字・小文字・数字を含む'
                  }
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

                {/* パスワード確認フィールド */}
                <TextField
                  label="パスワード（確認）"
                  type={showPasswordConfirmation ? 'text' : 'password'}
                  fullWidth
                  required
                  size="medium"
                  autoComplete="new-password"
                  error={!!errors.password_confirmation}
                  helperText={errors.password_confirmation?.message}
                  {...register('password_confirmation')}
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
                          aria-label="確認パスワードの表示切替"
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
                  disabled={!agreeToTerms || loading || isSubmitting}
                  sx={{
                    py: { xs: 1.2, sm: 1.5 },
                    mt: { xs: -1, sm: -2 },
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    backgroundColor:
                      agreeToTerms && !(loading || isSubmitting)
                        ? 'primary.main'
                        : 'grey.300',
                    '&:hover': {
                      backgroundColor:
                        agreeToTerms && !(loading || isSubmitting)
                          ? 'primary.dark'
                          : 'grey.400',
                    },
                  }}
                >
                  {loading || isSubmitting ? (
                    <>
                      <CircularProgress size={16} sx={{ mr: 1 }} />
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
            </Box>
          </Paper>
        </Box>
      </Container>

      {/* モーダルコンポーネント */}
      <TermsModal
        open={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
      />
      <PrivacyModal
        open={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />
    </>
  )
}

export default RegisterForm
