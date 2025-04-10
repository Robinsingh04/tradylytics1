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

  return (
    <DashboardContainer>
      <Navbar />

      <MainContent>
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
                title="Total PnL"
                value={parseFloat(metricsData.totalPnl.toString())}
                change={parseFloat(metricsData.pnlChange?.toString() || '0')}
                isPositive={parseFloat(metricsData.totalPnl.toString()) > 0}
                isMonetary={true}
                chartData={[20, 25, 30, 40, 35, 45, 50, 40, 50, 60, 70, 65]}
              />
              <MetricCard
                title="Win Rate"
                value={`${parseFloat(metricsData.winRate.toString()).toFixed(1)}%`}
                change={parseFloat(metricsData.winRateChange?.toString() || '0')}
                isPositive={parseFloat(metricsData.winRateChange?.toString() || '0') > 0}
                chartData={[30, 35, 40, 45, 50, 55, 50, 45, 50, 55, 60, 65]}
              />
              <MetricCard
                title="Total Trades"
                value={metricsData.totalTrades}
                change={metricsData.tradesChange || 0}
                isPositive={(metricsData.tradesChange || 0) > 0}
                chartData={[10, 15, 20, 25, 30, 25, 20, 25, 30, 35, 40, 45]}
              />
              <MetricCard
                title="Avg. Win"
                value={parseFloat(metricsData.avgWin.toString())}
                change={parseFloat(metricsData.avgWinChange?.toString() || '0')}
                isPositive={parseFloat(metricsData.avgWinChange?.toString() || '0') > 0}
                isMonetary={true}
                chartData={[40, 45, 50, 55, 50, 45, 50, 55, 60, 65, 70, 75]}
              />
              <MetricCard
                title="Avg. Loss"
                value={parseFloat(metricsData.avgLoss.toString())}
                change={parseFloat(metricsData.avgLossChange?.toString() || '0')}
                isPositive={parseFloat(metricsData.avgLossChange?.toString() || '0') > 0}
                isMonetary={true}
                chartData={[60, 55, 50, 45, 40, 45, 40, 35, 30, 25, 20, 15]}
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
