import React from 'react';
import { LineChart, DataPoint } from './LineChart';
import { useSyncHover } from '../../hooks/useSyncHover';

interface MetricCardProps {
  label: string;
  value: string | number;
  change: number;
  color?: string;
  chartData?: DataPoint[];
  syncId?: string;
}

export const MetricCard = ({ 
  label, 
  value, 
  change, 
  color = '#4CAF50', 
  chartData = [],
  syncId = 'dashboard-metrics'
}: MetricCardProps) => {
  const isPositive = change >= 0;
  const { hoveredIndex, setHoveredIndex } = useSyncHover(syncId);

  const handleHover = (index: number | null) => {
    setHoveredIndex(index);
  };

  // Format the change value to 2 decimal places
  const formattedChange = Math.abs(change).toFixed(2);

  // Determine prefix and suffix for values based on the current value format
  let valuePrefix = '';
  let valueSuffix = '';
  
  if (typeof value === 'string') {
    if (value.startsWith('₹')) valuePrefix = '₹';
    if (value.endsWith('%')) valueSuffix = '%';
  }

  return (
    <div className="metric-card">
      <div className="metric-card-header">
        <span className="metric-card-label">{label}</span>
        <span className={`metric-card-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? '+' : '-'}{formattedChange}%
        </span>
      </div>
      <div 
        className="metric-card-value" 
        style={{ color }}
      >
        {value}
      </div>
      
      {chartData.length > 0 && (
        <div 
          className="metric-card-chart" 
          style={{ 
            overflow: 'visible',
            position: 'relative',
            zIndex: 1,
            flex: 1,
            minHeight: 0,
            display: 'flex',
            alignItems: 'flex-start'
          }}
        >
          <LineChart 
            data={chartData}
            color={color}
            onHover={handleHover}
            hoveredIndex={hoveredIndex}
            syncId={syncId}
            valuePrefix={valuePrefix}
            valueSuffix={valueSuffix}
            showTooltip={true}
          />
        </div>
      )}
    </div>
  );
};
