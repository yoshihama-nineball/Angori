'use client'

import * as React from 'react'
import Box from '@mui/material/Box'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import HomeIcon from '@mui/icons-material/Home'
import ListIcon from '@mui/icons-material/List'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import BubbleChartIcon from '@mui/icons-material/BubbleChart'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const router = useRouter()
  const pathname = usePathname()

  // 現在のパスから初期値を設定（例: /calendar → 'calendar'）
  const currentPath = pathname.replace('/', '') || 'home'
  const [value, setValue] = React.useState<string>(currentPath)

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
    router.push(`/${newValue}`)
  }

  if (!isMobile) return null

  return (
    <Box
      data-testid="footer-nav"
      sx={{
        width: '100vw !important',
        position: 'fixed',
        bottom: 0,
        left: 0,
        zIndex: 9999,
        boxShadow: 3,
        height: { xs: '56px', sm: '64px' },
        display: { xs: 'flex', md: 'none' },
      }}
    >
      <BottomNavigation
        showLabels={false}
        value={value}
        onChange={handleChange}
        sx={{
          width: '100%',
          height: '100%',
          '& .MuiBottomNavigationAction-root': {
            minWidth: { xs: 'auto', sm: '80px' },
            padding: { xs: '6px', sm: '12px' },
            flex: 1,
          },
          '& .MuiSvgIcon-root': {
            fontSize: { xs: '24px', sm: '28px' },
          },
        }}
      >
        <BottomNavigationAction value="dashboard" icon={<HomeIcon />} />
        <BottomNavigationAction value="logs" icon={<ListIcon />} />
        <BottomNavigationAction value="counseling" icon={<ChatBubbleIcon />} />
        <BottomNavigationAction value="calendar" icon={<CalendarMonthIcon />} />
        <BottomNavigationAction value="analysis" icon={<BubbleChartIcon />} />
      </BottomNavigation>
    </Box>
  )
}
