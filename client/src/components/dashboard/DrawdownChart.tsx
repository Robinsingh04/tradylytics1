import React, { useState, useEffect } from 'react';
import { LineChart, DataPoint } from './LineChart';
import { useSyncHover } from '../../hooks/useSyncHover';

interface DrawdownChartProps {
  timeRange?: string;
  data?: DataPoint[];
  style?: React.CSSProperties;
  syncId?: string;
}

// Generate mock data for the drawdown chart
const generateDrawdownData = (days: number): DataPoint[] => {
  const data: DataPoint[] = [];
  const now = new Date();
  
  // Random starting point for drawdown (between -5% and 0%)
  let drawdown = -Math.random() * 5;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Random daily change (between -1.5% and +1%)
    const dailyChange = (Math.random() * 2.5 - 1.5);
    
    // Update drawdown (make sure it stays negative and doesn't go below -25%)
    drawdown = Math.max(-25, Math.min(0, drawdown + dailyChange));
    
    data.push({
      value: Math.round(drawdown * 100) / 100,
      timestamp: date.toISOString()
    });
  }
  
  return data;
};

export const DrawdownChart: React.FC<DrawdownChartProps> = ({ 
  timeRange = '1M',
  data,
  style,
  syncId = 'dashboard'
}) => {
  const [chartData, setChartData] = useState<DataPoint[]>([]);
  const { hoveredIndex, setHoveredIndex } = useSyncHover(syncId);
  
  useEffect(() => {
    // Generate data based on selected time range
    let days = 30; // Default to 1 month
    
    switch (timeRange) {
      case '1W':
        days = 7;
        break;
      case '1M':
        days = 30;
        break;
      case '3M':
        days = 90;
        break;
      case 'YTD':
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        days = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
        break;
      case '1Y':
        days = 365;
        break;
      case 'All':
        days = 730; // 2 years
        break;
    }
    
    setChartData(data || generateDrawdownData(days));
  }, [timeRange, data]);
  
  const handleHover = (index: number | null) => {
    setHoveredIndex(index);
  };
  
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <LineChart 
        data={chartData}
        color="#F44336"
        height={240}
        showTooltip={true}
        onHover={handleHover}
        hoveredIndex={hoveredIndex}
        syncId={syncId}
        valueSuffix="%"
        areaFill={true}
      />
    </div>
  );
};
