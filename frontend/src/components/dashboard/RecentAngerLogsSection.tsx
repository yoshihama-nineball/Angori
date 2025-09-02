import React from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
} from '@mui/material'
import { History, ChevronRight } from '@mui/icons-material'
import { AngerLog } from '@/schemas/anger_log'
import AngerLogCard from '@/components/anger_logs/AngerLogCard'
import Loading from '@/components/feedback/Loading/Loading'
import { AngerLogDetailModal } from '@/components/anger_logs/AngerLogDetailModal'
import { getAngerLog } from '../../../lib/api/anger_log'
import { useRouter } from 'next/navigation'

interface RecentAngerLogsSectionProps {
  angerLogs: AngerLog[]
  loading?: boolean
  error?: string[]
}

const RecentAngerLogsSection: React.FC<RecentAngerLogsSectionProps> = ({
  angerLogs,
  loading = false,
  error = [],
}) => {
  const router = useRouter()
  const [selectedAngerLog, setSelectedAngerLog] =
    React.useState<AngerLog | null>(null)
  const [modalOpen, setModalOpen] = React.useState(false)
  const [modalLoading, setModalLoading] = React.useState(false)

  const handleCardClick = async (id: number) => {
    try {
      setModalLoading(true)
      setModalOpen(true)

      const response = await getAngerLog(id)

      if (response.errors && response.errors.length > 0) {
        // console.error('詳細取得エラー:', response.errors)
      } else if (response.angerLog) {
        setSelectedAngerLog(response.angerLog)
      }
    } catch {
      // console.error('詳細取得に失敗:', error)
    } finally {
      setModalLoading(false)
    }
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setSelectedAngerLog(null)
  }

  const handleViewMore = () => {
    router.push('/anger_logs')
  }

  const handleCounseling = () => {
    router.push('/counseling')
  }

  return (
    <Card
      sx={{
        height: 'fit-content',
        borderRadius: 3,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        border: '1px solid #f0f0f0',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <History sx={{ color: '#ff6b35', mr: 1 }} />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: '#333',
              }}
            >
              最近のアンガーログ一覧
            </Typography>
          </Box>

          {angerLogs.length > 0 && (
            <Button
              endIcon={<ChevronRight />}
              onClick={handleViewMore}
              sx={{
                color: '#666',
                textTransform: 'none',
                fontSize: '0.875rem',
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: '#ff6b35',
                },
              }}
            >
              すべて見る
            </Button>
          )}
        </Box>

        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="200px"
          >
            <Loading />
          </Box>
        ) : error.length > 0 ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.map((err, index) => (
              <div key={index}>{err}</div>
            ))}
          </Alert>
        ) : angerLogs.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="200px"
            textAlign="center"
            sx={{
              backgroundColor: '#f8f9fa',
              borderRadius: 2,
              p: 3,
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              まだ記録がありません
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              最初のアンガーログを記録してみましょう
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCounseling}
            >
              記録を始める
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {angerLogs.map((log) => (
              <Box key={log.id} sx={{ '& .MuiCard-root': { height: 'auto' } }}>
                <AngerLogCard angerLog={log} onClick={handleCardClick} />
              </Box>
            ))}

            {angerLogs.length === 3 && (
              <Button
                variant="outlined"
                color="secondary"
                endIcon={<ChevronRight />}
                onClick={handleViewMore}
                sx={{
                  mt: 2,
                  alignSelf: 'center',
                  textTransform: 'none',
                }}
              >
                もっとアンガーログを見る
              </Button>
            )}
          </Box>
        )}
      </CardContent>

      {/* 詳細モーダル */}
      <AngerLogDetailModal
        open={modalOpen}
        onClose={handleModalClose}
        angerLog={selectedAngerLog}
        loading={modalLoading}
      />
    </Card>
  )
}

export default RecentAngerLogsSection
