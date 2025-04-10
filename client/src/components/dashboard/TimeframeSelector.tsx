import React from 'react';
import { Box, ToggleButtonGroup, ToggleButton, styled } from '@mui/material';

export type Timeframe = 'day' | 'week' | 'month' | 'year';

interface TimeframeSelectorProps {
  value: Timeframe;
  onChange: (timeframe: Timeframe) => void;
}

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#0a0a0a' : '#f5f5f5',
  borderRadius: 5,
  border: `1px solid ${theme.palette.mode === 'dark' ? '#333' : '#e0e0e0'}`,
  padding: 0,
  '& .MuiToggleButtonGroup-grouped': {
    margin: 0,
    border: 0,
    borderRadius: 0,
    color: theme.palette.mode === 'dark' ? '#888' : '#888',
    minWidth: 50,
    '&.Mui-selected': {
      color: theme.palette.mode === 'dark' ? '#fff' : '#222',
      backgroundColor: theme.palette.mode === 'dark' ? '#222' : '#e0e0e0',
    },
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' ? '#222' : '#e0e0e0',
    },
    '&:first-of-type': {
      borderTopLeftRadius: 4,
      borderBottomLeftRadius: 4,
    },
    '&:last-of-type': {
      borderTopRightRadius: 4,
      borderBottomRightRadius: 4,
    },
  },
}));

const StyledToggleButton = styled(ToggleButton)({
  textTransform: 'none',
  padding: '4px 12px',
  fontSize: '0.75rem',
  fontWeight: 500,
  height: 28,
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