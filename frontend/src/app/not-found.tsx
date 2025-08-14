import { Box, Button, Container, Typography } from '@mui/material'
import Link from 'next/link'

export default function NotFound() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          p: 4,
        }}
      >
        <div>
          <Typography variant="h4" gutterBottom>
            ページが見つかりません
          </Typography>
          <Typography>お探しのリソースが見つかりませんウホ....</Typography>
          <Button
            sx={{ mt: 2 }}
            component={Link}
            href="/dashboard"
            variant="contained"
          >
            トップページへ戻る
          </Button>
        </div>
      </Box>
    </Container>
  )
}

export const dynamic = 'force-dynamic'
