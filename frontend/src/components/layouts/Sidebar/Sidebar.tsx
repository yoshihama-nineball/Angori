'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Chat as ChatIcon,
  History as HistoryIcon,
  Analytics as AnalyticsIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material'

const sidebarItems = [
  {
    title: 'ダッシュボード',
    path: '/dashboard',
    icon: <DashboardIcon />,
  },
  {
    title: '相談室',
    path: '/counseling',
    icon: <ChatIcon />,
  },
  {
    title: '記録一覧',
    path: '/anger_logs',
    icon: <HistoryIcon />,
  },
  {
    title: 'カレンダー',
    path: '/calendar',
    icon: <CalendarIcon />,
  },
  {
    title: '分析',
    path: '/analyze',
    icon: <AnalyticsIcon />,
  },
]

export const Sidebar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const theme = useTheme()

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <Box
      sx={{
        width: 240,
        height: '100%',
        bgcolor: 'white',
        borderRight: `1px solid ${theme.palette.divider}`,
        position: 'fixed',
        left: 0,
        top: 'var(--header-height, 64px)',
        zIndex: 1000,
        display: { xs: 'none', md: 'block' },
        // CSS変数を設定
        '--sidebar-width': { xs: '0px', md: '240px' },
      }}
      ref={(el) => {
        if (el) {
          document.documentElement.style.setProperty(
            '--sidebar-width',
            window.innerWidth >= 900 ? '240px' : '0px'
          )
        }
      }}
    >
      <List sx={{ pt: 2 }}>
        {sidebarItems.map((item) => {
          const isActive = pathname === item.path

          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  mx: 1,
                  mb: 0.5,
                  borderRadius: 2,
                  bgcolor: isActive
                    ? theme.palette.gorilla.lightBanana
                    : 'transparent',
                  color: isActive
                    ? theme.palette.primary.contrastText
                    : 'inherit',
                  '&:hover': {
                    bgcolor: isActive
                      ? theme.palette.gorilla.banana
                      : theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? 'inherit' : theme.palette.text.secondary,
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400,
                    fontSize: '14px',
                  }}
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </Box>
  )
}
