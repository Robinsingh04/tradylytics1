import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Container } from '@mui/material';
import { MetricCard, MetricType } from '../dashboard/MetricCard';
import { ChartCard } from '../dashboard/ChartCard';
import { MonthlyCalendar } from '../dashboard/MonthlyCalendar';
import { TimeRangeToggle, TimeRange } from '../dashboard/TimeRangeToggle';
import { DataPoint } from '../dashboard/LineChart';
import { EquityCurveChart } from '../dashboard/EquityCurveChart';
import { DrawdownChart } from '../dashboard/DrawdownChart';
import { OpenTrades } from '../dashboard/OpenTrades';
import { CalendarView } from '../dashboard/CalendarView';
import { SyncHoverProvider } from '../../hooks/useSyncHover';
import styles from '../../styles/components/Dashboard.module.scss';

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
  if (first === 0) return 0; // Avoid division by zero
  return ((last - first) / first) * 100;
};

export const DashboardScreen = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [chartData, setChartData] = useState<Record<string, DataPoint[]>>({});
  const [chartTimeRange, setChartTimeRange] = useState<string>('1M');

  // Generate mock data when time range changes
  useEffect(() => {
    const data = generateMockData(timeRange);
    console.log("[DashboardScreen] Generated chart data:", data);
    setChartData(data);
  }, [timeRange]);

  // Prepare metric data based on mock data and image
  const getMetricValue = (key: string, isMonetary: boolean, suffix: string = '') => {
    const data = chartData[key];
    if (!data || data.length === 0) {
      // Return 0 for numeric types, or a default string for monetary
      return isMonetary ? '₹0.00' : (0).toFixed(1) + suffix; 
    }
    const latestValue = data[data.length - 1].value;
    return isMonetary 
      ? `₹${latestValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}` 
      : latestValue.toFixed(1) + suffix;
  };

  const getMetricChange = (key: string) => {
    const data = chartData[key];
    return data ? calculateChange(data) : 0;
  };

  const metrics: Array<{
    title: string;
    valueKey: string;
    isMonetary: boolean;
    suffix?: string;
    metricType: MetricType;
    chartDataKey: string;
  }> = [
    { title: 'Total Profit/Loss', valueKey: 'profit', isMonetary: true, metricType: 'profit-loss', chartDataKey: 'profit' },
    { title: 'Win Rate', valueKey: 'winRate', isMonetary: false, suffix: '%', metricType: 'win-rate', chartDataKey: 'winRate' },
    { title: 'Risk to Reward', valueKey: 'riskReward', isMonetary: false, metricType: 'risk-reward', chartDataKey: 'riskReward' },
    { title: 'Max Drawdown', valueKey: 'drawdown', isMonetary: true, metricType: 'drawdown', chartDataKey: 'drawdown' },
    { title: 'Consistency Score', valueKey: 'consistency', isMonetary: false, metricType: 'consistency', chartDataKey: 'consistency' }
  ];

  // Mock data for CalendarView
  const mockCalendarData = [
    { date: new Date(), pnl: 2500, tradesCount: 5 },
    { date: new Date(Date.now() - 86400000), pnl: -1200, tradesCount: 3 },
    { date: new Date(Date.now() - 86400000 * 2), pnl: 1800, tradesCount: 4 },
  ];
  
  // Mock open trades data
  const mockOpenTradesData = [
    { 
      symbol: 'TCS', 
      type: 'SELL', 
      shares: 11, 
      entryDate: '13 Apr, 8:57 am',
      entryPrice: 1523,
      currentPrice: 1547.55,
      change: -1.61,
      pnl: -270.06
    }
  ];

  return (
    <Container maxWidth="xl" disableGutters className={styles.dashboard}>
      <Box className={styles.headerSection}>
        <Typography variant="h4" component="h1" className={styles.pageTitle}>
          Performance Metrics
        </Typography>
        <TimeRangeToggle activeRange={timeRange} onChange={setTimeRange} />
      </Box>

      <SyncHoverProvider>
        <Grid container spacing={2.5} className={styles.metricsGrid}>
          {metrics.map((metric, index) => {
            const change = getMetricChange(metric.chartDataKey);
            const isPositive = change >= 0;
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2.4} key={index}>
                <MetricCard 
                  title={metric.title}
                  value={getMetricValue(metric.valueKey, metric.isMonetary, metric.suffix)}
                  change={change}
                  isPositive={isPositive}
                  isMonetary={metric.isMonetary}
                  chartData={chartData[metric.chartDataKey] || []}
                  metricType={metric.metricType}
                  suffix={metric.suffix}
                  syncId="dashboard"
                />
              </Grid>
            );
          })}
        </Grid>

        <Grid container spacing={2.5} className={styles.chartsGrid} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={2} 
              className={styles.chartSection}
              sx={{ borderRadius: 2 }}
            >
              <Box className={styles.chartHeader}>
                <Typography variant="h6" className={styles.chartTitle}>
                  Equity Curve
                </Typography>
                <TimeRangeToggle 
                  activeRange={timeRange === 'day' ? 'day' : 
                               timeRange === 'week' ? 'week' : 
                               timeRange === 'month' ? 'month' : 'year'} 
                  onChange={setTimeRange} 
                />
              </Box>
              <EquityCurveChart 
                data={chartData.profit} 
                timeRange={chartTimeRange}
                syncId="dashboard"
              />
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={2} 
              className={styles.chartSection}
              sx={{ borderRadius: 2 }}
            >
              <Box className={styles.chartHeader}>
                <Typography variant="h6" className={styles.chartTitle}>
                  Drawdown
                </Typography>
                <TimeRangeToggle 
                  activeRange={timeRange === 'day' ? 'day' : 
                               timeRange === 'week' ? 'week' : 
                               timeRange === 'month' ? 'month' : 'year'} 
                  onChange={setTimeRange} 
                />
              </Box>
              <DrawdownChart 
                data={chartData.drawdown} 
                timeRange={chartTimeRange}
                syncId="dashboard"
              />
            </Paper>
          </Grid>
        </Grid>
      </SyncHoverProvider>

      <Grid container spacing={2.5} className={styles.bottomGrid}>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={2} 
            className={styles.calendarSection}
            sx={{ borderRadius: 2 }}
          >
            <Typography variant="h6" component="h3">
              Monthly Performance
            </Typography>
            <MonthlyCalendar />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={2} 
            className={styles.tradesSection}
            sx={{ borderRadius: 2 }}
          >
            <Typography variant="h6" component="h3">
              Open Trades
            </Typography>
            <OpenTrades trades={mockOpenTradesData} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}; 