import React, { useState, useEffect } from 'react';
import { LineChart, DataPoint } from './LineChart';
import { useSyncHover } from '../../hooks/useSyncHover';

interface EquityCurveChartProps {
  timeRanges?: string[];
  data?: any[];
  style?: React.CSSProperties;
}

// Generate mock data for the equity curve
const generateEquityData = (days: number): DataPoint[] => {
  const data: DataPoint[] = [];
  const now = new Date();
  let equity = 100000; // Starting equity
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Random daily percentage change between -2% and +3%
    const dailyChange = (Math.random() * 5 - 2) / 100;
    equity = equity * (1 + dailyChange);
    
    data.push({
      value: Math.round(equity * 100) / 100,
      timestamp: date.toISOString()
    });
  }
  
  return data;
};

export const EquityCurveChart: React.FC<EquityCurveChartProps> = ({ 
  timeRanges = ['1W', '1M', '3M', 'YTD', '1Y', 'All'],
  data,
  style
}) => {
  const [activeRange, setActiveRange] = useState('1M');
  const [chartData, setChartData] = useState<DataPoint[]>([]);
  const { hoveredIndex, setHoveredIndex } = useSyncHover('equity-chart');
  
  useEffect(() => {
    // Generate data based on selected time range
    let days = 30; // Default to 1 month
    
    switch (activeRange) {
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
    
    setChartData(data || generateEquityData(days));
  }, [activeRange, data]);
  
  const handleHover = (index: number | null) => {
    setHoveredIndex(index);
  };
  
  return (
    <div className="chart-card" style={{ width: '100%', height: '100%' }}>
      <div className="chart-card-header">
        <h3 className="chart-card-title">Equity Curve</h3>
        <div className="time-range-toggle">
          {timeRanges.map(range => (
            <button
              key={range}
              className={`time-range-toggle-button ${activeRange === range ? 'active' : ''}`}
              onClick={() => setActiveRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      
      <div className="chart-card-content">
        <LineChart 
          data={chartData}
          color="#4CAF50"
          height={240}
          showTooltip={true}
          onHover={handleHover}
          hoveredIndex={hoveredIndex}
          syncId="equity-chart"
          valuePrefix="₹"
        />
      </div>
    </div>
  );
};
