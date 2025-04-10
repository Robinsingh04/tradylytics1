import React from 'react';
import { Box, ToggleButtonGroup, ToggleButton, styled } from '@mui/material';

export type Timeframe = 'day' | 'week' | 'month' | 'year';

interface TimeframeSelectorProps {
  value: Timeframe;
  onChange: (timeframe: Timeframe) => void;
}

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
  borderRadius: 30,
  '& .MuiToggleButtonGroup-grouped': {
    margin: 3,
    border: 0,
    borderRadius: 20,
    color: theme.palette.mode === 'dark' ? '#aaa' : '#888',
    '&.Mui-selected': {
      color: theme.palette.mode === 'dark' ? '#fff' : '#222',
      backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#e0e0e0',
    },
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' ? '#333' : '#e0e0e0',
    },
  },
}));

const StyledToggleButton = styled(ToggleButton)({
  textTransform: 'none',
  padding: '2px 12px',
  fontSize: '0.75rem',
  fontWeight: 500,
});

export function TimeframeSelector({ value, onChange }: TimeframeSelectorProps) {
  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
    newTimeframe: Timeframe | null
  ) => {
    if (newTimeframe !== null) {
      onChange(newTimeframe);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
      <StyledToggleButtonGroup
        value={value}
        exclusive
        onChange={handleChange}
        aria-label="timeframe"
        size="small"
      >
        <StyledToggleButton value="day">Day</StyledToggleButton>
        <StyledToggleButton value="week">Week</StyledToggleButton>
        <StyledToggleButton value="month">Month</StyledToggleButton>
        <StyledToggleButton value="year">Year</StyledToggleButton>
      </StyledToggleButtonGroup>
    </Box>
  );
}