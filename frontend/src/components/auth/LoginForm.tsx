'use client'

import { useState } from 'react'
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
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4, // レスポンシブ値をやめて固定値に
        maxWidth: 500, // レスポンシブ値をやめて固定値に
        mx: 'auto',
        width: '100%',
      }}
    >
      <form autoComplete="off">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 4, sm: 6 },
          }}
        >
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
                mt: 1,
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }}
            >
              おかえりウホ！今日も来てくれてありがとうな！
            </Typography>
          </Box>
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
            size="medium"
            autoComplete="current-password"
            inputProps={{
              autoComplete: 'current-password',
            }}
            InputProps={{
              sx: {
                '& input': {
                  color: '#000', // 文字色を明示的に黒に
                },
                backgroundColor: '#fff', // 背景色を明示的に白に
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

          {/* ログイン状態を保持 */}
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  size="small"
                />
              }
              label={
                <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                  ログイン状態を保持する
                </Typography>
              }
              sx={{ alignItems: 'flex-start', ml: 0 }}
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{
              // mt: { xs: 1, sm: 2 },
              py: { xs: 1.2, sm: 1.5 },
              fontSize: { xs: '1rem', sm: '1.1rem' },
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            🍌 ログイン
          </Button>

          {/* パスワードを忘れた場合のリンク */}
          <Box sx={{ textAlign: 'center' }}>
            <Link
              href="/forgot-password"
              sx={{
                fontSize: { xs: '0.875rem', sm: '1rem' },
                textDecoration: 'underline',
                color: 'text.secondary',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              パスワードを忘れた場合
            </Link>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              textAlign: 'center',
              fontSize: { xs: '0.875rem', sm: '1rem' },
              // mt: { xs: 1, sm: 2 },
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
      </form>
    </Paper>
  )
}

export default LoginForm
