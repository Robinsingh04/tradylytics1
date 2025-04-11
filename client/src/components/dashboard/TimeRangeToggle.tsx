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
  
  return (
    <div className="time-range-toggle">
      {ranges.map((range) => (
        <button
          key={range}
          className={`time-range-toggle-button ${activeRange === range ? 'active' : ''}`}
          onClick={() => onChange(range)}
        >
          {range.charAt(0).toUpperCase() + range.slice(1)}
        </button>
      ))}
    </div>
  );
}; 