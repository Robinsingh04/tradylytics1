import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Box, 
  Container, 
  Grid, 
  Skeleton, 
  Paper, 
  useTheme,
  styled
} from '@mui/material';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { EquityCurveChart } from '@/components/dashboard/EquityCurveChart';
import { DrawdownChart } from '@/components/dashboard/DrawdownChart';
import { CalendarView } from '@/components/dashboard/CalendarView';
import { OpenTrades } from '@/components/dashboard/OpenTrades';
import { Navbar } from '@/components/dashboard/Navbar';
import { TimeframeSelector, Timeframe } from '@/components/dashboard/TimeframeSelector';
import { SyncHoverProvider } from '@/hooks/use-sync-hover';
import { DataPoint } from '@/components/dashboard/LineChart';
import '@/styles/main.scss';
import { format, parseISO } from 'date-fns';
import { Metrics, Trade, DailyPerformance } from '@shared/schema';

// Theme-aware styled components using SASS classes instead of custom styling
const DashboardContainer = styled(Box)(() => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
}));

const MainContent = styled(Container)(() => ({
  flexGrow: 1,
  paddingTop: '64px', // 48px navbar + 16px padding
  paddingBottom: '16px',
  maxWidth: '100%',
  width: '100%',
}));

export default function Dashboard() {
  const theme = useTheme();
  const [timeframe, setTimeframe] = useState<Timeframe>('month');
  // Also need separate timeframes for each chart section
  const [leftChartTimeframe, setLeftChartTimeframe] = useState<Timeframe>('day');
  const [rightChartTimeframe, setRightChartTimeframe] = useState<Timeframe>('day');
  
  // Fetch metrics data
  const { data: metricsData, isLoading: isLoadingMetrics } = useQuery<Metrics>({
    queryKey: ['/api/metrics'],
  });

  // Fetch equity curve data
  const { data: equityData, isLoading: isLoadingEquity } = useQuery<{ date: string; equity: number }[]>({
    queryKey: ['/api/equity-history'],
  });

  // Fetch drawdown data
  const { data: drawdownData, isLoading: isLoadingDrawdown } = useQuery<{ date: string; drawdown: number }[]>({
    queryKey: ['/api/drawdown-history'],
  });

  // Fetch open trades
  const { data: openTrades, isLoading: isLoadingTrades } = useQuery<Trade[]>({
    queryKey: ['/api/trades/open'],
  });

  // Fetch calendar data
  const { data: calendarData, isLoading: isLoadingCalendar } = useQuery<DailyPerformance[]>({
    queryKey: ['/api/daily-performance'],
  });

  // Mock handlers for demo purposes
  const handleEditTrade = (tradeId: number) => {
    console.log(`Edit trade ${tradeId}`);
  };

  const handleCloseTrade = (tradeId: number) => {
    console.log(`Close trade ${tradeId}`);
  };

  // Format calendar data
  const formattedCalendarData = calendarData?.map(day => ({
    date: new Date(day.date),
    pnl: parseFloat(day.pnl.toString()),
    tradesCount: day.tradesCount
  })) || [];
  
  // Transform chart data format to match DataPoint interface
  const generateChartData = (values: number[]): DataPoint[] => {
    const now = new Date();
    return values.map((val, index) => {
      // Create a placeholder timestamp (e.g., decreasing by 1 hour for each point)
      const timestamp = new Date(now.getTime() - index * 60 * 60 * 1000).toISOString();
      return {
        value: val,
        timestamp: timestamp,
      };
    });
  };

  // Synthetic chart data for different timeframes
  const getChartDataByTimeframe = (seed: number = 0, isPositive: boolean = true) => {
    const dayData = Array(24).fill(0).map((_, i) => 75 + Math.sin(i / 2 + seed) * 20 + Math.random() * 10);
    const weekData = Array(7).fill(0).map((_, i) => 75 + Math.sin(i + seed) * 20 + Math.random() * 10);
    const monthData = Array(30).fill(0).map((_, i) => 75 + Math.sin(i / 4 + seed) * 20 + Math.random() * 10);
    const yearData = Array(12).fill(0).map((_, i) => 75 + Math.sin(i / 2 + seed) * 20 + Math.random() * 10);
    
    // For negative trend, reverse and scale the data
    if (!isPositive) {
      return {
        day: generateChartData(dayData.map(v => 100 - (v - 75) / 2)),
        week: generateChartData(weekData.map(v => 100 - (v - 75) / 2)),
        month: generateChartData(monthData.map(v => 100 - (v - 75) / 2)),
        year: generateChartData(yearData.map(v => 100 - (v - 75) / 2))
      };
    }
    
    return { 
      day: generateChartData(dayData), 
      week: generateChartData(weekData), 
      month: generateChartData(monthData), 
      year: generateChartData(yearData) 
    };
  };

  // Generate chart data for each metric
  const pnlChartData = getChartDataByTimeframe(1, true);
  const winRateChartData = getChartDataByTimeframe(2, true);
  const tradesChartData = getChartDataByTimeframe(3, true);
  const avgWinChartData = getChartDataByTimeframe(4, true);
  const avgLossChartData = getChartDataByTimeframe(5, false);
  
  // Transform data for chart components
  const formattedEquityData = equityData?.map(item => ({
    date: item.date,
    value: item.equity,
  }));
  
  const formattedDrawdownData = drawdownData?.map(item => ({
    date: item.date,
    value: item.drawdown,
  }));
  
  return (
    <DashboardContainer className="dashboard">
      <Navbar />

      <MainContent>
        <div className="dashboard__main">
          {/* Page title */}
          <h1 className="dashboard__page-title">Performance Metrics</h1>
          
          {/* Timeframe Selector - Top row */}
          <div className="dashboard__timeframe">
            <TimeframeSelector 
              value={timeframe} 
              onChange={setTimeframe} 
            />
          </div>
          
          {/* Metric Cards - 5 cards in a row */}
          <div className="dashboard__metrics">
            {isLoadingMetrics ? (
              // Loading skeleton for 5 cards
              Array(5).fill(0).map((_, i) => (
                <Paper 
                  key={i}
                  className="metric-card metric-card--loading"
                >
                  <div className="metric-card__header">
                    <div className="metric-card__title">Loading...</div>
                  </div>
                  <div className="metric-card__value">0</div>
                  <div className="metric-card__change"></div>
                  <div className="metric-card__chart"></div>
                </Paper>
              ))
            ) : metricsData ? (
              <SyncHoverProvider>
                {/* First Card - Total Profit/Loss */}
                <MetricCard
                  title="Total Profit/Loss"
                  value="6744.64"
                  change={-9.38}
                  isPositive={false}
                  isMonetary={true}
                  chartData={pnlChartData[timeframe]}
                  metricType="profit-loss"
                />
                
                {/* Second Card - Win Rate */}
                <MetricCard
                  title="Win Rate"
                  value="84.0"
                  change={-4.24}
                  isPositive={false}
                  suffix="%"
                  chartData={winRateChartData[timeframe]}
                  metricType="win-rate"
                />
                
                {/* Third Card - Risk to Reward */}
                <MetricCard
                  title="Risk to Reward"
                  value="142.3"
                  change={-5.12}
                  isPositive={false}
                  chartData={tradesChartData[timeframe]}
                  metricType="risk-reward"
                />
                
                {/* Fourth Card - Max Drawdown */}
                <MetricCard
                  title="Max Drawdown"
                  value="346.15"
                  change={-6.15}
                  isPositive={false}
                  isMonetary={true}
                  chartData={avgWinChartData[timeframe]}
                  metricType="drawdown"
                />
                
                {/* Fifth Card - Consistency Score */}
                <MetricCard
                  title="Consistency Score"
                  value="92.1"
                  change={2.25}
                  isPositive={false}
                  chartData={avgLossChartData[timeframe]}
                  metricType="consistency"
                />
              </SyncHoverProvider>
            ) : (
              <div className="dashboard__error">
                Failed to load metrics data
              </div>
            )}
          </div>

          {/* Two chart sections side by side */}
          <div className="dashboard__charts-grid">
            {/* Left Chart Section */}
            <div className="dashboard__chart-section">
              <div className="dashboard__chart-header">
                <h3 className="dashboard__chart-title">Trades by Day</h3>
                <div className="dashboard__chart-value">
                  <span>12.5K</span>
                  <span className="dashboard__chart-change dashboard__chart-change--positive">+2.5%</span>
                </div>
                <div className="dashboard__chart-subtitle">Trade volume for the last 7 days</div>
                
                {/* Timeframe selector for left chart */}
                <div className="dashboard__chart-timeframe">
                  <TimeframeSelector 
                    value={leftChartTimeframe} 
                    onChange={setLeftChartTimeframe} 
                  />
                </div>
              </div>
              
              <div className="dashboard__chart">
                {isLoadingEquity ? (
                  <div className="dashboard__chart-skeleton">
                    <Skeleton variant="rectangular" height={240} />
                  </div>
                ) : formattedEquityData ? (
                  <EquityCurveChart data={formattedEquityData} />
                ) : (
                  <div className="dashboard__chart-error">
                    Failed to load equity data
                  </div>
                )}
              </div>
            </div>
            
            {/* Right Chart Section */}
            <div className="dashboard__chart-section">
              <div className="dashboard__chart-header">
                <h3 className="dashboard__chart-title">Trades by Day</h3>
                <div className="dashboard__chart-value">
                  <span>12.5K</span>
                  <span className="dashboard__chart-change dashboard__chart-change--positive">+2.5%</span>
                </div>
                <div className="dashboard__chart-subtitle">Trade volume for the last 7 days</div>
                
                {/* Timeframe selector for right chart */}
                <div className="dashboard__chart-timeframe">
                  <TimeframeSelector 
                    value={rightChartTimeframe} 
                    onChange={setRightChartTimeframe} 
                  />
                </div>
              </div>
              
              <div className="dashboard__chart">
                {isLoadingDrawdown ? (
                  <div className="dashboard__chart-skeleton">
                    <Skeleton variant="rectangular" height={240} />
                  </div>
                ) : formattedDrawdownData ? (
                  <DrawdownChart data={formattedDrawdownData} />
                ) : (
                  <div className="dashboard__chart-error">
                    Failed to load drawdown data
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Additional sections (Calendar and Open Trades) can remain as is */}
          <div className="dashboard__grid">
            <div className="dashboard__calendar">
              {isLoadingCalendar ? (
                <div className="dashboard__calendar-skeleton">
                  <Skeleton variant="rectangular" height={400} />
                </div>
              ) : formattedCalendarData.length > 0 ? (
                <CalendarView monthlyData={formattedCalendarData} />
              ) : (
                <div className="dashboard__calendar-error">
                  Failed to load calendar data
                </div>
              )}
            </div>
            
            <div className="dashboard__trades">
              {isLoadingTrades ? (
                <div className="dashboard__trades-skeleton">
                  <Skeleton variant="rectangular" height={400} />
                </div>
              ) : openTrades ? (
                <OpenTrades 
                  trades={openTrades} 
                />
              ) : (
                <div className="dashboard__trades-error">
                  Failed to load open trades
                </div>
              )}
            </div>
          </div>
        </div>
      </MainContent>
    </DashboardContainer>
  );
}
