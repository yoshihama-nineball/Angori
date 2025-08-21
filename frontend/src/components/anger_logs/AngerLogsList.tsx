import React, { useState, useMemo, useEffect } from 'react'
import { Box, Typography, Pagination, Alert } from '@mui/material'
import { AngerLog } from '@/schemas/anger_log'
import AngerLogCard from './AngerLogCard'
import SearchBar from './SearchBar'
import { getAngerLog } from '../../../lib/api/anger_log'
import SortDropdown from './SortDropDown'
import Loading from '../feedback/Loading/Loading'

type SortOption = 'recent' | 'oldest' | 'anger_high' | 'anger_low'

interface AngerLogsListProps {
  angerLogs: AngerLog[]
  loading?: boolean
  error?: string[]
  searchKeyword?: string
  onSearchChange?: (keyword: string) => void
}

const ITEMS_PER_PAGE = 10

const AngerLogsList: React.FC<AngerLogsListProps> = ({
  angerLogs,
  loading = false,
  error = [],
  searchKeyword,
  onSearchChange,
}) => {
  // const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [, setSelectedAngerLog] = useState<AngerLog | null>(null)
  const [, setModalOpen] = useState(false)
  const [, setModalLoading] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>('recent')

  const [localSearchTerm, setLocalSearchTerm] = useState('')

  const searchTerm = searchKeyword || localSearchTerm
  const handleSearchChange = onSearchChange || setLocalSearchTerm

  // 検索フィルタリング
  const filteredLogs = useMemo(() => {
    let filtered = angerLogs

    // 検索フィルタリング
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filtered = angerLogs.filter(
        (log) =>
          log.situation_description.toLowerCase().includes(searchLower) ||
          log.location?.toLowerCase().includes(searchLower) ||
          log.trigger_words?.toLowerCase().includes(searchLower) ||
          log.perception?.toLowerCase().includes(searchLower)
      )
    }

    // ソート
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return (
            new Date(b.occurred_at).getTime() -
            new Date(a.occurred_at).getTime()
          )
        case 'oldest':
          return (
            new Date(a.occurred_at).getTime() -
            new Date(b.occurred_at).getTime()
          )
        case 'anger_high':
          return b.anger_level - a.anger_level
        case 'anger_low':
          return a.anger_level - b.anger_level
        default:
          return (
            new Date(b.occurred_at).getTime() -
            new Date(a.occurred_at).getTime()
          )
      }
    })

    return sorted
  }, [angerLogs, searchTerm, sortBy])

  // ページネーション
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE)
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return filteredLogs.slice(startIndex, endIndex)
  }, [filteredLogs, currentPage])

  // 検索語・ソートが変更されたらページを1に戻す
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, sortBy])

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

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value)
    // ページ変更時に上部にスクロール
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Loading />
      </Box>
    )
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
        onSearchSubmit={handleSearchChange}
        placeholder="記録を検索してみようウホ..."
      />

      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {/* 検索結果数を左端に追加 */}
        <Box>
          {searchTerm ? (
            <Typography variant="body2" color="text.secondary">
              「{searchTerm}」の検索結果: {filteredLogs.length}件
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              全 {filteredLogs.length}件
            </Typography>
          )}
        </Box>

        {/* ソートドロップダウンを右端に */}
        <Box>
          <SortDropdown
            sortBy={sortBy}
            onSortChange={(value: string) => setSortBy(value as SortOption)}
          />
        </Box>
      </Box>
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
                xl: 'repeat(4, 1fr)', // 大画面: 4列
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
            <Box display="flex" justifyContent="center" mt={4} mb={6}>
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
    </Box>
  )
}

export default AngerLogsList
