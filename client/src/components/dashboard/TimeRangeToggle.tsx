import React from 'react';
import { Button, ButtonGroup } from '@mui/material';
import styles from '../../styles/components/TimeRangeToggle.module.scss';

export type TimeRange = 'day' | 'week' | 'month' | 'year';

interface TimeRangeToggleProps {
  activeRange: TimeRange;
  onChange: (range: TimeRange) => void;
}

export const TimeRangeToggle = ({ 
  activeRange, 
  onChange 
}: TimeRangeToggleProps) => {
  const ranges: TimeRange[] = ['day', 'week', 'month', 'year'];
  
  // Map of time ranges to their abbreviated labels
  const rangeLabels: Record<TimeRange, string> = {
    day: 'D',
    week: 'W',
    month: 'M',
    year: 'Y'
  };
  
  return (
    <ButtonGroup
      variant="outlined"
      size="small"
      aria-label="time range toggle"
      className={styles.timeRangeToggle}
    >
      {ranges.map((range) => (
        <Button
          key={range}
          onClick={() => onChange(range)}
          color={activeRange === range ? 'primary' : 'inherit'}
          variant={activeRange === range ? 'contained' : 'outlined'}
          className={activeRange === range ? styles.active : ''}
          sx={{ minWidth: 36, borderRadius: 1 }}
        >
          {rangeLabels[range]}
        </Button>
      ))}
    </ButtonGroup>
  );
}; 