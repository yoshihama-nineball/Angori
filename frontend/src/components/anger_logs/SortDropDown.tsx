import React from 'react'
import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Box,
  SelectChangeEvent,
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  Schedule,
  ScheduleOutlined,
} from '@mui/icons-material'

interface SortDropdownProps {
  sortBy: string
  onSortChange: (sortBy: string) => void
}

const sortOptions = [
  { value: 'recent', label: '新しい順', icon: <Schedule fontSize="small" /> },
  {
    value: 'oldest',
    label: '古い順',
    icon: <ScheduleOutlined fontSize="small" />,
  },
  {
    value: 'anger_high',
    label: '怒りレベル高い順',
    icon: <TrendingUp fontSize="small" />,
  },
  {
    value: 'anger_low',
    label: '怒りレベル低い順',
    icon: <TrendingDown fontSize="small" />,
  },
]

const SortDropdown: React.FC<SortDropdownProps> = ({
  sortBy,
  onSortChange,
}) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    // 型を明示
    onSortChange(event.target.value) // as string を削除
  }

  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth size="small">
        <InputLabel>並び順</InputLabel>
        <Select
          value={sortBy}
          label="並び順"
          onChange={handleChange}
          sx={{ borderRadius: 2, backgroundColor: '#f5f5f5' }}
        >
          {sortOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.icon} {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}

export default SortDropdown
