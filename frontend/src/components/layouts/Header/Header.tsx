'use client'
import * as React from 'react'
import Link from 'next/link'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import AccountCircle from '@mui/icons-material/AccountCircle'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import { logoutUser } from '../../../../lib/api/auth'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../../../../lib/stores/authStore'

export default function Header() {
  const router = useRouter()
  const { isAuthenticated, setAuthenticated, initialize } = useAuthStore()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false)

  React.useEffect(() => {
    initialize()
  }, [initialize])

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true)
    handleClose()
  }

  const handleLogoutConfirm = async () => {
    const result = await logoutUser()
    setLogoutDialogOpen(false)

    if (result.success) {
      setAuthenticated(false)
      router.push('/auth/login')
    } else {
      router.push('/auth/login')
    }
  }

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false)
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: 'background.default', // theme.tsと同じ背景色
          color: 'text.primary',
          boxShadow: 1, // theme.tsのshadow使用
          borderBottom: '1px solid #E0E0E0',
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 56, md: 64 },
            width: '100%',
            px: { xs: 2, md: 4 },
          }}
        >
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                cursor: 'pointer',
                fontWeight: 700,
                color: '#5D4037',
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                '&:hover': {
                  color: '#3E2723',
                },
              }}
            >
              アンゴリ
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          {isAuthenticated ? (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                sx={{
                  color: '#5D4037',
                  width: { xs: 40, md: 48 },
                  height: { xs: 40, md: 48 },
                }}
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{
                  '& .MuiPaper-root': {
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E0E0E0',
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    minWidth: 160,
                  },
                }}
              >
                <MenuItem
                  onClick={handleClose}
                  sx={{
                    color: 'text.primary',
                    '&:hover': {
                      backgroundColor: 'rgba(94, 64, 55, 0.1)',
                      color: '#3E2723', // primary.dark より濃い茶色
                    },
                  }}
                >
                  アプリについて
                </MenuItem>

                <MenuItem
                  onClick={handleLogoutClick}
                  sx={{
                    color: 'text.primary',
                    '&:hover': {
                      backgroundColor: 'rgba(94, 64, 55, 0.1)',
                      color: '#3E2723', // 同じく濃い茶色
                    },
                  }}
                >
                  ログアウト
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <Button
              component={Link}
              href="/auth/login"
              variant="contained"
              size="small"
            >
              ログイン
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* ログアウト確認モーダル */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleLogoutCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>ログアウト確認</DialogTitle>

        <DialogContent>
          <Typography variant="body1">本当にログアウトしますか？</Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
          <Button onClick={handleLogoutCancel} color="secondary">
            キャンセル
          </Button>
          <Button
            onClick={handleLogoutConfirm}
            variant="contained"
            color="primary"
          >
            ログアウト
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
