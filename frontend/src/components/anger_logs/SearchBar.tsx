import React from 'react'
import { TextField, InputAdornment } from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'

interface SearchBarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  placeholder?: string
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  placeholder = '検索キーワードを入力',
}) => {
  return (
    <TextField
      fullWidth
      variant="outlined"
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      placeholder={placeholder}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" />
          </InputAdornment>
        ),
      }}
      sx={{
        mb: 3,
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          backgroundColor: '#f5f5f5',
          '&:hover': {
            backgroundColor: '#eeeeee',
          },
          '&.Mui-focused': {
            backgroundColor: 'white',
          },
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'transparent',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: '#e0e0e0',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: '#1976d2',
        },
      }}
    />
  )
}

export default SearchBar
