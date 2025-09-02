import { Box, Typography } from '@mui/material'
export default function CalendarPage() {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h4" gutterBottom>
        📅 カレンダー機能
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        準備中です！もう少しお待ちください 🦍
      </Typography>
      <Typography variant="body2" color="text.secondary">
        怒りの記録をカレンダー形式で確認できるようになります
      </Typography>
    </Box>
  )
}
