'use client'

import { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  InputAdornment,
  IconButton,
  Container,
  CircularProgress,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { loginUser } from '../../../lib/actions/auth'

const initialState = {
  success: false,
  message: '',
  errors: {},
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      variant="contained"
      size="large"
      disabled={pending}
      sx={{
        mt: 2,
        py: 1.5,
        backgroundColor: pending ? 'grey.300' : 'primary.main',
        '&:hover': {
          backgroundColor: pending ? 'grey.400' : 'primary.dark',
        },
      }}
    >
      {pending ? (
        <>
          <CircularProgress size={20} sx={{ mr: 1 }} />
          ログイン中...
        </>
      ) : (
        '🍌 ログイン'
      )}
    </Button>
  )
}

export default function LoginForm() {
  const [state, formAction] = useActionState(loginUser, initialState)
  const [showPassword, setShowPassword] = useState(false)

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
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 400,
            backgroundColor: 'background.paper',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              🦍 Angori
            </Typography>
            <Typography variant="h6" color="text.secondary">
              ログイン
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              おかえり！今日の調子はどうだ？
            </Typography>
          </Box>

          <form action={formAction}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                name="email"
                label="メールアドレス"
                type="email"
                fullWidth
                required
                error={!!state.errors?.email}
                helperText={state.errors?.email?.[0]}
                placeholder="example@example.com"
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
                error={!!state.errors?.password}
                helperText={state.errors?.password?.[0]}
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
                InputLabelProps={{
                  shrink: true,
                }}
              />

              {state.message && !state.success && (
                <Alert severity="error">{state.message}</Alert>
              )}

              <SubmitButton />

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: 'center' }}
              >
                アカウントをお持ちでない方は{' '}
                <a
                  href="/auth/register"
                  style={{
                    color: 'inherit',
                    textDecoration: 'underline',
                  }}
                >
                  新規登録
                </a>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  )
}
