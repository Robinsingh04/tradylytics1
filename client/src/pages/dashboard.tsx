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
import '@/styles/main.scss';
import { format, parseISO } from 'date-fns';
import { Metrics, Trade, DailyPerformance } from '@shared/schema';
import { DataPoint } from '@/types/chart';

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
  maxWidth: '1280px',
}));

export default function Dashboard() {
  const theme = useTheme();
  const [timeframe, setTimeframe] = useState<Timeframe>('month');
  
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
    return values.map((value, index) => ({
      x: index,
      y: value
    }));
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
        {/* Timeframe Selector */}
        <div className="d-flex justify-content-end mb-3">
          <TimeframeSelector 
            value={timeframe} 
            onChange={setTimeframe} 
          />
        </div>
        
        {/* Metric Cards */}
        <div className="metrics-grid mb-4">
          {isLoadingMetrics ? (
            // Loading skeleton
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
              <MetricCard
                title="Total Profit/Loss"
                value={parseFloat(metricsData.totalPnl.toString())}
                change={parseFloat(metricsData.pnlChange?.toString() || '0')}
                isPositive={parseFloat(metricsData.totalPnl.toString()) > 0}
                isMonetary={true}
                chartData={pnlChartData[timeframe]}
                color="#00c853"
              />
              <MetricCard
                title="Win Rate"
                value={`${parseFloat(metricsData.winRate.toString()).toFixed(1)}`}
                change={parseFloat(metricsData.winRateChange?.toString() || '0')}
                isPositive={parseFloat(metricsData.winRateChange?.toString() || '0') > 0}
                chartData={winRateChartData[timeframe]}
                suffix="%"
                color="#00bcd4"
              />
              <MetricCard
                title="Risk to Reward"
                value={metricsData.totalTrades > 100 ? 161.5 : metricsData.totalTrades}
                change={metricsData.tradesChange || 2.5}
                isPositive={(metricsData.tradesChange || 0) > 0}
                chartData={tradesChartData[timeframe]}
                color="#3d5afe"
              />
              <MetricCard
                title="Max Drawdown"
                value={parseFloat(metricsData.avgLoss.toString())}
                change={parseFloat(metricsData.avgLossChange?.toString() || '0')}
                isPositive={false}
                isMonetary={true}
                chartData={avgLossChartData[timeframe]}
                color="#ff5252"
              />
              <MetricCard
                title="Consistency Score"
                value={95.2}
                change={0}
                isPositive={true}
                chartData={avgWinChartData[timeframe]}
                color="#aa00ff"
              />
            </SyncHoverProvider>
          ) : (
            <div className="text-center py-4 text-sm">
              Failed to load metrics data
            </div>
          )}
        </div>

        {/* Charts */}
        <div className="chart-grid">
          <Box sx={{ 
            bgcolor: 'background.paper', 
            borderRadius: 1, 
            overflow: 'hidden',
            boxShadow: 1,
            height: '100%'
          }}>
            {isLoadingEquity ? (
              <Box sx={{ p: 2 }}>
                <Skeleton variant="rectangular" height={240} />
              </Box>
            ) : formattedEquityData ? (
              <EquityCurveChart data={formattedEquityData} />
            ) : (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                Failed to load equity data
              </Box>
            )}
          </Box>
          
          <Box sx={{ 
            bgcolor: 'background.paper', 
            borderRadius: 1, 
            overflow: 'hidden',
            boxShadow: 1,
            height: '100%'
          }}>
            {isLoadingDrawdown ? (
              <Box sx={{ p: 2 }}>
                <Skeleton variant="rectangular" height={240} />
              </Box>
            ) : formattedDrawdownData ? (
              <DrawdownChart data={formattedDrawdownData} />
            ) : (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                Failed to load drawdown data
              </Box>
            )}
          </Box>
        </div>

        {/* Calendar and Open Trades */}
        <div className="bottom-section-grid">
          <div className="calendar-container">
            {isLoadingCalendar ? (
              <Box sx={{ p: 2 }}>
                <Skeleton variant="rectangular" height={320} />
              </Box>
            ) : formattedCalendarData ? (
              <CalendarView monthlyData={formattedCalendarData} />
            ) : (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                Failed to load calendar data
              </Box>
            )}
          </div>
          
          <div className="trades-container">
            {isLoadingTrades ? (
              <Box sx={{ p: 2 }}>
                <Skeleton variant="rectangular" height={320} />
              </Box>
            ) : (
              <OpenTrades trades={openTrades} />
            )}
          </div>
        </div>
      </MainContent>
    </DashboardContainer>
  );
}
