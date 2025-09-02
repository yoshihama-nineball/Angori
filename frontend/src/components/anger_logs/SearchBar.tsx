import React, { useState } from 'react'
import { TextField, InputAdornment, IconButton } from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'

interface SearchBarProps {
  searchTerm: string
  onSearchSubmit: (value: string) => void
  placeholder?: string
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchSubmit,
  placeholder = '検索キーワードを入力',
}) => {
  const [inputValue, setInputValue] = useState(searchTerm)

  const handleSubmit = () => {
    onSearchSubmit(inputValue.trim())
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  // 親からsearchTermが変更された時にinputValueも更新
  React.useEffect(() => {
    setInputValue(searchTerm)
  }, [searchTerm])

  return (
    <TextField
      fullWidth
      variant="outlined"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyPress={handleKeyPress}
      placeholder={placeholder}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleSubmit} size="small">
              <SearchIcon />
            </IconButton>
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
      }}
    />
  )
}

export default SearchBar
