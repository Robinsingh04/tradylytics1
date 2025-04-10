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
import '@/styles/dashboard.scss';
import { format, parseISO } from 'date-fns';
import { Metrics, Trade, DailyPerformance } from '@shared/schema';

const DashboardContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#f5f5f5',
}));

const MainContent = styled(Container)(({ theme }) => ({
  flexGrow: 1,
  paddingTop: '76px', // 60px navbar + 16px padding
  paddingBottom: '16px',
  maxWidth: '1280px',
}));

const LoadingSkeleton = styled(Skeleton)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#333333' : '#e0e0e0',
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

  // Synthetic chart data for different timeframes
  const getChartDataByTimeframe = (seed: number = 0, isPositive: boolean = true) => {
    const dayData = Array(24).fill(0).map((_, i) => 75 + Math.sin(i / 2 + seed) * 20 + Math.random() * 10);
    const weekData = Array(7).fill(0).map((_, i) => 75 + Math.sin(i + seed) * 20 + Math.random() * 10);
    const monthData = Array(30).fill(0).map((_, i) => 75 + Math.sin(i / 4 + seed) * 20 + Math.random() * 10);
    const yearData = Array(12).fill(0).map((_, i) => 75 + Math.sin(i / 2 + seed) * 20 + Math.random() * 10);
    
    // For negative trend, reverse and scale the data
    if (!isPositive) {
      return {
        day: dayData.map(v => 100 - (v - 75) / 2),
        week: weekData.map(v => 100 - (v - 75) / 2),
        month: monthData.map(v => 100 - (v - 75) / 2),
        year: yearData.map(v => 100 - (v - 75) / 2)
      };
    }
    
    return { day: dayData, week: weekData, month: monthData, year: yearData };
  };

  // Generate chart data for each metric
  const pnlChartData = getChartDataByTimeframe(1, true);
  const winRateChartData = getChartDataByTimeframe(2, true);
  const tradesChartData = getChartDataByTimeframe(3, true);
  const avgWinChartData = getChartDataByTimeframe(4, true);
  const avgLossChartData = getChartDataByTimeframe(5, false);
  
  return (
    <DashboardContainer>
      <Navbar />

      <MainContent>
        {/* Timeframe Selector */}
        <TimeframeSelector 
          value={timeframe} 
          onChange={setTimeframe} 
        />
        
        {/* Metric Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: {xs: '1fr', sm: '1fr 1fr', md: 'repeat(5, 1fr)'}, gap: 2, mb: 2 }}>
          {isLoadingMetrics ? (
            // Loading skeleton
            Array(5).fill(0).map((_, i) => (
              <Paper 
                key={i}
                sx={{ 
                  p: 1, 
                  bgcolor: theme.palette.mode === 'dark' ? '#212121' : '#fff',
                  height: '100%'
                }}
              >
                <LoadingSkeleton variant="text" width="40%" height={10} />
                <LoadingSkeleton variant="text" width="60%" height={24} />
                <LoadingSkeleton variant="text" width="100%" height={14} />
              </Paper>
            ))
          ) : metricsData ? (
            <>
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
            </>
          ) : (
            <Box sx={{ gridColumn: 'span 5', textAlign: 'center', py: 1.5, fontSize: '0.75rem' }}>
              Failed to load metrics data
            </Box>
          )}
        </Box>

        {/* Charts */}
        <Box sx={{ display: 'grid', gridTemplateColumns: {xs: '1fr', md: '1fr 1fr'}, gap: 2, mb: 2 }}>
          {isLoadingEquity ? (
            <Paper 
              sx={{ 
                p: 1, 
                bgcolor: theme.palette.mode === 'dark' ? '#212121' : '#fff',
              }}
            >
              <LoadingSkeleton variant="text" width="30%" height={10} />
              <LoadingSkeleton variant="rectangular" height={180} />
            </Paper>
          ) : equityData ? (
            <EquityCurveChart data={equityData} />
          ) : (
            <Paper 
              sx={{ 
                p: 1, 
                bgcolor: theme.palette.mode === 'dark' ? '#212121' : '#fff',
                textAlign: 'center',
                fontSize: '0.75rem',
              }}
            >
              Failed to load equity data
            </Paper>
          )}
          
          {isLoadingDrawdown ? (
            <Paper 
              sx={{ 
                p: 1, 
                bgcolor: theme.palette.mode === 'dark' ? '#212121' : '#fff',
              }}
            >
              <LoadingSkeleton variant="text" width="30%" height={10} />
              <LoadingSkeleton variant="rectangular" height={180} />
            </Paper>
          ) : drawdownData ? (
            <DrawdownChart data={drawdownData} />
          ) : (
            <Paper 
              sx={{ 
                p: 1, 
                bgcolor: theme.palette.mode === 'dark' ? '#212121' : '#fff',
                textAlign: 'center',
                fontSize: '0.75rem',
              }}
            >
              Failed to load drawdown data
            </Paper>
          )}
        </Box>

        {/* Calendar and Open Trades */}
        <Box sx={{ display: 'grid', gridTemplateColumns: {xs: '1fr', md: '8fr 4fr'}, gap: 2 }}>
          {isLoadingCalendar ? (
            <Paper 
              sx={{ 
                p: 1, 
                bgcolor: theme.palette.mode === 'dark' ? '#212121' : '#fff',
              }}
            >
              <LoadingSkeleton variant="text" width="30%" height={10} />
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
                {Array(35).fill(0).map((_, i) => (
                  <LoadingSkeleton key={i} variant="rectangular" height={50} />
                ))}
              </Box>
            </Paper>
          ) : (
            <CalendarView monthlyData={formattedCalendarData} />
          )}
          
          {isLoadingTrades ? (
            <Paper 
              sx={{ 
                p: 1, 
                bgcolor: theme.palette.mode === 'dark' ? '#212121' : '#fff',
                height: '100%'
              }}
            >
              <LoadingSkeleton variant="text" width="30%" height={10} />
              <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                {Array(3).fill(0).map((_, i) => (
                  <LoadingSkeleton key={i} variant="rectangular" height={80} />
                ))}
              </Box>
            </Paper>
          ) : openTrades ? (
            <OpenTrades 
              trades={openTrades} 
              onEditTrade={handleEditTrade} 
              onCloseTrade={handleCloseTrade} 
            />
          ) : (
            <Paper 
              sx={{ 
                p: 1, 
                bgcolor: theme.palette.mode === 'dark' ? '#212121' : '#fff',
                textAlign: 'center',
                fontSize: '0.75rem',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              Failed to load open trades
            </Paper>
          )}
        </Box>
      </MainContent>
    </DashboardContainer>
  );
}
