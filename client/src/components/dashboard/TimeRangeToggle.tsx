import React from 'react';

export type TimeRange = 'day' | 'week' | 'month' | 'year';

interface TimeRangeToggleProps {
  activeRange: TimeRange;
  onChange: (range: TimeRange) => void;
}

export const TimeRangeToggle: React.FC<TimeRangeToggleProps> = ({ 
  activeRange, 
  onChange 
}) => {
  const ranges: TimeRange[] = ['day', 'week', 'month', 'year'];
  
  // Map of time ranges to their abbreviated labels
  const rangeLabels: Record<TimeRange, string> = {
    day: 'D',
    week: 'W',
    month: 'M',
    year: 'Y'
  };
  
  return (
    <div className="time-range-toggle">
      {ranges.map((range) => (
        <button
          key={range}
          className={`time-range-toggle-button ${activeRange === range ? 'active' : ''}`}
          onClick={() => onChange(range)}
        >
          <span>{rangeLabels[range]}</span>
        </button>
      ))}
    </div>
  );
}; 