import React from 'react';
import { Box, ToggleButtonGroup, ToggleButton, styled } from '@mui/material';

export type Timeframe = 'day' | 'week' | 'month' | 'year';

interface TimeframeSelectorProps {
  value: Timeframe;
  onChange: (timeframe: Timeframe) => void;
}

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  backgroundColor: 'transparent',
  borderRadius: 5,
  border: 'none',
  padding: 0,
  '& .MuiToggleButtonGroup-grouped': {
    margin: 2,
    border: 0,
    borderRadius: 50,
    color: '#666',
    minWidth: 30,
    height: 30,
    width: 30,
    padding: 0,
    '&.Mui-selected': {
      color: '#fff',
      backgroundColor: '#333',
    },
    '&:hover': {
      backgroundColor: '#222',
    },
  },
}));

const StyledToggleButton = styled(ToggleButton)({
  textTransform: 'none',
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
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
      <StyledToggleButtonGroup
        value={value}
        exclusive
        onChange={handleChange}
        aria-label="timeframe"
        size="small"
      >
        <StyledToggleButton value="day">D</StyledToggleButton>
        <StyledToggleButton value="week">W</StyledToggleButton>
        <StyledToggleButton value="month">M</StyledToggleButton>
        <StyledToggleButton value="year">Y</StyledToggleButton>
      </StyledToggleButtonGroup>
    </Box>
  );
}