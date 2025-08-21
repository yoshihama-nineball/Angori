import React, { useState, useMemo } from 'react'
import { Box, Typography, Pagination, Alert } from '@mui/material'
import { AngerLog } from '@/schemas/anger_log'
import AngerLogCard from './AngerLogCard'
import SearchBar from './SearchBar'
import { AngerLogDetailModal } from './AngerLogDetailModal'
import { getAngerLog } from '../../../lib/api/anger_log'
import Loading from '../feedback/Loading/Loading'

interface AngerLogsListProps {
  angerLogs: AngerLog[]
  loading?: boolean
  error?: string[]
}

const ITEMS_PER_PAGE = 10

const AngerLogsList: React.FC<AngerLogsListProps> = ({
  angerLogs,
  loading = false,
  error = [],
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedAngerLog, setSelectedAngerLog] = useState<AngerLog | null>(
    null
  )
  const [modalOpen, setModalOpen] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)

  // 検索フィルタリング
  const filteredLogs = useMemo(() => {
    if (!searchTerm.trim()) return angerLogs

    const searchLower = searchTerm.toLowerCase()
    return angerLogs.filter(
      (log) =>
        log.situation_description.toLowerCase().includes(searchLower) ||
        log.location?.toLowerCase().includes(searchLower) ||
        log.trigger_words?.toLowerCase().includes(searchLower) ||
        log.perception?.toLowerCase().includes(searchLower)
    )
  }, [angerLogs, searchTerm])

  // ページネーション
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE)
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return filteredLogs.slice(startIndex, endIndex)
  }, [filteredLogs, currentPage])

  // 検索語が変更されたらページを1に戻す
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handleCardClick = async (id: number) => {
    try {
      setModalLoading(true)
      setModalOpen(true)

      const response = await getAngerLog(id)

      if (response.errors && response.errors.length > 0) {
      } else if (response.angerLog) {
        setSelectedAngerLog(response.angerLog)
      }
    } catch {
    } finally {
      setModalLoading(false)
    }
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setSelectedAngerLog(null)
  }

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value)
    // ページ変更時に上部にスクロール
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return <Loading />
  }

  if (error.length > 0) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error.map((err, index) => (
          <div key={index}>{err}</div>
        ))}
      </Alert>
    )
  }

  return (
    <Box>
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="記録を検索してみましょう..."
      />

      {filteredLogs.length === 0 ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="300px"
          textAlign="center"
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchTerm
              ? '検索結果が見つかりませんでした'
              : 'まだ記録がありません'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm
              ? '別のキーワードで検索してみてください'
              : '最初の怒りログを記録してみましょう'}
          </Typography>
        </Box>
      ) : (
        <>
          {/* 検索結果表示 */}
          {searchTerm && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              「{searchTerm}」の検索結果: {filteredLogs.length}件
            </Typography>
          )}

          {/* カード一覧 */}
          <Box
            sx={{
              mb: 3,
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr', // スマホ: 1列
                sm: 'repeat(2, 1fr)', // タブレット: 2列
                md: 'repeat(3, 1fr)', // PC小: 3列
                lg: 'repeat(4, 1fr)', // PC大: 4列
                xl: 'repeat(5, 1fr)', // 大画面: 5列
              },
              gap: 2,
              mx: 'auto',
              maxWidth: '100%',
            }}
          >
            {paginatedLogs.map((log) => (
              <AngerLogCard
                key={log.id}
                angerLog={log}
                onClick={handleCardClick}
              />
            ))}
          </Box>

          {/* ページネーション */}
          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontSize: '1rem',
                    minWidth: 40,
                    height: 40,
                  },
                  '& .MuiPaginationItem-root.Mui-selected': {
                    color: 'white',
                  },
                }}
              />
            </Box>
          )}
        </>
      )}
      <AngerLogDetailModal
        open={modalOpen}
        onClose={handleModalClose}
        angerLog={selectedAngerLog}
        loading={modalLoading}
      />
    </Box>
  )
}

export default AngerLogsList
