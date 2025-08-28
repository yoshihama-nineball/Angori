import { Box, Typography } from '@mui/material'
export default function CalendarPage() {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h4" gutterBottom>
        📈 怒りの傾向マップ
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        準備中です！もう少しお待ちください 🦍
      </Typography>
      <Typography variant="body2" color="text.secondary">
        怒りの傾向をバブルマップで可視化できるようになります
      </Typography>
    </Box>
  )
}
