import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { EquityCurveChart } from '@/components/dashboard/EquityCurveChart';
import { DrawdownChart } from '@/components/dashboard/DrawdownChart';
import { CalendarView } from '@/components/dashboard/CalendarView';
import { OpenTrades } from '@/components/dashboard/OpenTrades';
import { ThemeToggle } from '@/components/dashboard/ThemeToggle';
import '@/styles/dashboard.scss';
import { format, parseISO } from 'date-fns';
import { Metrics, Trade, DailyPerformance } from '@shared/schema';

export default function Dashboard() {
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
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
      {/* Header */}
      <header className="bg-white dark:bg-neutral-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-lg font-medium">Trading Dashboard</h1>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {isLoadingMetrics ? (
            // Loading skeleton
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-4 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
            ))
          ) : metricsData ? (
            <>
              <MetricCard
                title="Total PnL"
                value={parseFloat(metricsData.totalPnl.toString())}
                change={parseFloat(metricsData.pnlChange?.toString() || '0')}
                isPositive={parseFloat(metricsData.totalPnl.toString()) > 0}
                isMonetary={true}
              />
              <MetricCard
                title="Win Rate"
                value={`${parseFloat(metricsData.winRate.toString()).toFixed(1)}%`}
                change={parseFloat(metricsData.winRateChange?.toString() || '0')}
                isPositive={parseFloat(metricsData.winRateChange?.toString() || '0') > 0}
              />
              <MetricCard
                title="Total Trades"
                value={metricsData.totalTrades}
                change={metricsData.tradesChange || 0}
                isPositive={(metricsData.tradesChange || 0) > 0}
              />
              <MetricCard
                title="Avg. Win"
                value={parseFloat(metricsData.avgWin.toString())}
                change={parseFloat(metricsData.avgWinChange?.toString() || '0')}
                isPositive={parseFloat(metricsData.avgWinChange?.toString() || '0') > 0}
                isMonetary={true}
              />
              <MetricCard
                title="Avg. Loss"
                value={parseFloat(metricsData.avgLoss.toString())}
                change={parseFloat(metricsData.avgLossChange?.toString() || '0')}
                isPositive={parseFloat(metricsData.avgLossChange?.toString() || '0') > 0}
                isMonetary={true}
              />
            </>
          ) : (
            <div className="col-span-5 text-center py-6">Failed to load metrics data</div>
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {isLoadingEquity ? (
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-4 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </div>
          ) : equityData ? (
            <EquityCurveChart data={equityData} />
          ) : (
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-4 text-center">
              Failed to load equity data
            </div>
          )}
          
          {isLoadingDrawdown ? (
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-4 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
              <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </div>
          ) : drawdownData ? (
            <DrawdownChart data={drawdownData} />
          ) : (
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-4 text-center">
              Failed to load drawdown data
            </div>
          )}
        </div>

        {/* Calendar and Open Trades */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {isLoadingCalendar ? (
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-4 animate-pulse lg:col-span-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
              <div className="grid grid-cols-7 gap-1">
                {Array(35).fill(0).map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
          ) : (
            <div className="lg:col-span-2">
              <CalendarView monthlyData={formattedCalendarData} />
            </div>
          )}
          
          {isLoadingTrades ? (
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-4 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
              <div className="space-y-3">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
          ) : openTrades ? (
            <OpenTrades 
              trades={openTrades} 
              onEditTrade={handleEditTrade} 
              onCloseTrade={handleCloseTrade} 
            />
          ) : (
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-4 text-center">
              Failed to load open trades
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
