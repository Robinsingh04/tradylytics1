import React, { useState, useEffect } from 'react';
import { MetricCard } from '../dashboard/MetricCard';
import { ChartCard } from '../dashboard/ChartCard';
import { MonthlyCalendar } from '../dashboard/MonthlyCalendar';
import { TimeRangeToggle, TimeRange } from '../dashboard/TimeRangeToggle';
import { DataPoint } from '../dashboard/LineChart';
import { EquityCurveChart } from '../dashboard/EquityCurveChart';
import { DrawdownChart } from '../dashboard/DrawdownChart';
import { OpenTrades } from '../dashboard/OpenTrades';
import { CalendarView } from '../dashboard/CalendarView';

// Mock data generator function
const generateMockData = (range: TimeRange): Record<string, DataPoint[]> => {
  const now = new Date();
  const dataPoints: Record<string, DataPoint[]> = {
    profit: [],
    winRate: [],
    riskReward: [],
    drawdown: [],
    consistency: []
  };

  let numPoints = 0;
  let startDate = new Date();

  switch (range) {
    case 'day':
      numPoints = 24; // hourly
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      break;
    case 'week':
      numPoints = 7; // daily
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
      break;
    case 'month':
      numPoints = 30; // daily
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);
      break;
    case 'year':
      numPoints = 12; // monthly
      startDate = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);
      break;
  }

  // Generate random data points
  for (let i = 0; i < numPoints; i++) {
    let date = new Date(startDate);
    
    if (range === 'day') {
      date.setHours(date.getHours() + i);
    } else if (range === 'week' || range === 'month') {
      date.setDate(date.getDate() + i);
    } else if (range === 'year') {
      date.setMonth(date.getMonth() + i);
    }

    // Generate random values with trends
    // Base value + trend + random noise
    dataPoints.profit.push({
      timestamp: date.toISOString(),
      value: 6000 + (i * 30) + (Math.random() * 1000 - 500)
    });
    
    dataPoints.winRate.push({
      timestamp: date.toISOString(),
      value: 85 + (Math.random() * 10 - 5)
    });
    
    dataPoints.riskReward.push({
      timestamp: date.toISOString(),
      value: 150 + (Math.random() * 30 - 15)
    });
    
    dataPoints.drawdown.push({
      timestamp: date.toISOString(),
      value: 350 + (Math.random() * 50 - 25)
    });
    
    dataPoints.consistency.push({
      timestamp: date.toISOString(),
      value: 94 + (Math.random() * 4 - 2)
    });
  }

  return dataPoints;
};

// Calculate percentage change for a given array
const calculateChange = (data: DataPoint[]): number => {
  if (data.length < 2) return 0;
  const first = data[0].value;
  const last = data[data.length - 1].value;
  return ((last - first) / first) * 100;
};

export const DashboardScreen = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('day');
  const [chartData, setChartData] = useState<Record<string, DataPoint[]>>({});

  // Generate mock data when time range changes
  useEffect(() => {
    const data = generateMockData(timeRange);
    setChartData(data);
  }, [timeRange]);

  // Prepare metric data from the chart data
  const metrics = [
    { 
      label: 'Total Profit/Loss', 
      value: chartData.profit?.length ? 
        `₹${chartData.profit[chartData.profit.length - 1].value.toFixed(2)}` : 
        '₹0', 
      change: chartData.profit?.length ? calculateChange(chartData.profit) : 0, 
      color: '#4CAF50',
      chartData: chartData.profit || []
    },
    { 
      label: 'Win Rate', 
      value: chartData.winRate?.length ? 
        `${chartData.winRate[chartData.winRate.length - 1].value.toFixed(1)}%` : 
        '0%', 
      change: chartData.winRate?.length ? calculateChange(chartData.winRate) : 0, 
      color: '#2196F3',
      chartData: chartData.winRate || []
    },
    { 
      label: 'Risk to Reward', 
      value: chartData.riskReward?.length ? 
        chartData.riskReward[chartData.riskReward.length - 1].value.toFixed(1) : 
        '0', 
      change: chartData.riskReward?.length ? calculateChange(chartData.riskReward) : 0, 
      color: '#3F51B5',
      chartData: chartData.riskReward || []
    },
    { 
      label: 'Max Drawdown', 
      value: chartData.drawdown?.length ? 
        `₹${chartData.drawdown[chartData.drawdown.length - 1].value.toFixed(2)}` : 
        '₹0', 
      change: chartData.drawdown?.length ? calculateChange(chartData.drawdown) : 0, 
      color: '#FF5252',
      chartData: chartData.drawdown || []
    },
    { 
      label: 'Consistency Score', 
      value: chartData.consistency?.length ? 
        chartData.consistency[chartData.consistency.length - 1].value.toFixed(1) : 
        '0', 
      change: chartData.consistency?.length ? calculateChange(chartData.consistency) : 0, 
      color: '#9C27B0',
      chartData: chartData.consistency || []
    },
  ];

  return (
    <div className="dashboard">
      <div className="performance-metrics-container">
        <div className="performance-header">
          <h2 className="dashboard-title">Performance Metrics</h2>
          <TimeRangeToggle activeRange={timeRange} onChange={setTimeRange} />
        </div>

        <div className="metrics-container metrics-container-compact">
          {metrics.map((metric, index) => (
            <div key={index} className="metric-card-wrapper">
              <MetricCard {...metric} />
            </div>
          ))}
        </div>
      </div>

      <div className="charts-container">
        <EquityCurveChart />
        <DrawdownChart />
      </div>

      <div className="bottom-section">
        <div className="bottom-section-calendar">
          <CalendarView 
            monthlyData={[
              // Mock data
              { date: new Date(), pnl: 2500, tradesCount: 5 },
              { date: new Date(Date.now() - 86400000), pnl: -1200, tradesCount: 3 },
              { date: new Date(Date.now() - 86400000 * 2), pnl: 1800, tradesCount: 4 },
              { date: new Date(Date.now() - 86400000 * 3), pnl: 3200, tradesCount: 7 },
              { date: new Date(Date.now() - 86400000 * 5), pnl: -800, tradesCount: 2 },
            ]} 
          />
        </div>
        <div className="bottom-section-trades">
          <OpenTrades />
        </div>
      </div>
    </div>
  );
}; 