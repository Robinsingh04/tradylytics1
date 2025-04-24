import React from 'react';
import { 
  Box, 
  Typography, 
  useTheme,
  Paper,
  CircularProgress,
  LinearProgress,
  Divider,
  Grid
} from '@mui/material';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  ReferenceLine
} from 'recharts';
import { DailyMetrics } from '../../types/journaling';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

interface DailyMetricsPanelProps {
  metrics: DailyMetrics;
}

export const DailyMetricsPanel = ({ metrics }: DailyMetricsPanelProps) => {
  const theme = useTheme();
  
  // Generate chart data - limit to ensure it fits in the small container
  const chartData = metrics.timestamps.map((time, index) => ({
    time: time.length > 4 ? time.substring(0, 4) : time, // Make times even more compact
    pnl: metrics.netCumulativePL[index],
  }));
  
  // Format tick values to be more compact
  const formatYAxisTick = (value: number) => {
    if (Math.abs(value) >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toFixed(0);
  };
  
  // Determine min and max PnL values for domain calculation
  const minPnL = Math.min(...metrics.netCumulativePL);
  const maxPnL = Math.max(...metrics.netCumulativePL);
  
  // Determine positive/negative metrics
  const finalPnL = metrics.netCumulativePL[metrics.netCumulativePL.length - 1] || 0;
  const isProfitable = metrics.profitFactor >= 1;
  const isWinRateGood = metrics.winPercentage >= 50;
  
  // Calculate win/loss ratio safely
  const calculateWinLossRatio = () => {
    if (metrics.averageLoss === 0 || isNaN(metrics.averageLoss)) {
      return metrics.averageWin > 0 ? 3 : 0; // Cap at 3 for better visualization
    }
    return parseFloat((metrics.averageWin / metrics.averageLoss).toFixed(2));
  };
  
  const winLossRatio = calculateWinLossRatio();
  const isWinLossRatioGood = winLossRatio >= 1;
  
  // Colors for positive/negative values
  const positiveColor = '#34d399'; // Green
  const negativeColor = '#f87171'; // Red
  
  // Basic styling
  const cardStyle = {
    backgroundColor: theme.palette.mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
    border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
    borderRadius: '4px',
    padding: '12px',
    height: '100%',
    width: '100%'
  };
  
  const titleStyle = {
    fontSize: '0.65rem',
    fontWeight: 600,
    color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
    marginBottom: '8px'
  };
  
  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {/* P&L Chart - Full Width */}
      <Paper elevation={0} sx={{...cardStyle, padding: '4px 4px 4px 4px'}}>
        <Typography sx={{...titleStyle, mb: 0.5}}>Net Cumulative P&L</Typography>
        <Box sx={{ width: '100%', height: '120px', position: 'relative', overflow: 'visible' }} className="pnl-chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 0, right: 0, left: 10, bottom: 0 }}
              style={{ overflow: 'visible' }}
            >
              <defs>
                <linearGradient id="colorPnL" x1="0" y1="0" x2="0" y2="1">
                  <stop 
                    offset="5%" 
                    stopColor={finalPnL >= 0 ? positiveColor : negativeColor} 
                    stopOpacity={0.8}
                  />
                  <stop 
                    offset="95%" 
                    stopColor={finalPnL >= 0 ? positiveColor : negativeColor} 
                    stopOpacity={0.2}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} strokeWidth={0.5} />
              <XAxis 
                dataKey="time" 
                height={15}
                tick={{ fontSize: 9 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={15}
                padding={{ left: 0, right: 0 }}
              />
              <YAxis 
                tick={{ fontSize: 9 }}
                tickLine={false}
                axisLine={false}
                width={20}
                tickFormatter={formatYAxisTick}
                domain={[minPnL - 1, maxPnL + 1]}
                tickCount={5}
                allowDecimals={false}
                padding={{ top: 0, bottom: 0 }}
                dx={-5}
              />
              <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" strokeWidth={0.5} />
              <Area 
                type="monotone" 
                dataKey="pnl" 
                stroke={finalPnL >= 0 ? positiveColor : negativeColor} 
                strokeWidth={1}
                fillOpacity={0.8}
                fill="url(#colorPnL)"
                isAnimationActive={false}
                dot={false}
              />
              <Tooltip 
                contentStyle={{ 
                  fontSize: '10px', 
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: theme.palette.mode === 'dark' ? '#2D2D2D' : '#FFFFFF'
                }}
                formatter={(value) => [`$${Number(value).toFixed(2)}`, 'P&L']}
                labelFormatter={(value) => `Time: ${value}`}
                wrapperStyle={{ zIndex: 100 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
      
      {/* Two metrics side by side */}
      <Grid container spacing={1.5} sx={{ width: '100%', m: 0 }}>
        {/* Profit Factor - Left */}
        <Grid item xs={6} sx={{ p: 0, pr: 0.75 }}>
          <Paper elevation={0} sx={cardStyle}>
            <Typography sx={titleStyle}>Profit Factor</Typography>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '85px' }}>
              <div style={{ position: 'relative', width: '60px', height: '60px' }}>
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={60}
                  thickness={3}
                  sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
                />
                <CircularProgress
                  variant="determinate"
                  value={Math.min(metrics.profitFactor * 20, 100)}
                  size={60}
                  thickness={3}
                  sx={{ 
                    color: isProfitable ? positiveColor : negativeColor,
                    position: 'absolute',
                    left: 0,
                    top: 0
                  }}
                />
                <div style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  bottom: 0, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center'
                }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', lineHeight: 1 }}>
                    {metrics.profitFactor.toFixed(1)}
                  </Typography>
                  <Typography sx={{ fontSize: '0.55rem', color: 'text.secondary' }}>
                    Profit Factor
                  </Typography>
                </div>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                backgroundColor: isProfitable ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                color: isProfitable ? positiveColor : negativeColor,
                padding: '2px 6px',
                borderRadius: '6px',
                marginTop: '6px',
                whiteSpace: 'nowrap'
              }}>
                {isProfitable ? (
                  <TrendingUpIcon sx={{ marginRight: '2px', fontSize: '0.8rem' }} />
                ) : (
                  <TrendingDownIcon sx={{ marginRight: '2px', fontSize: '0.8rem' }} />
                )}
                <Typography sx={{ fontWeight: 600, fontSize: '0.6rem' }}>
                  {isProfitable ? 'Profitable' : 'Unprofitable'}
                </Typography>
              </div>
            </div>
          </Paper>
        </Grid>
        
        {/* Win Percentage - Right */}
        <Grid item xs={6} sx={{ p: 0, pl: 0.75 }}>
          <Paper elevation={0} sx={cardStyle}>
            <Typography sx={titleStyle}>Win Percentage</Typography>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '85px' }}>
              <div style={{ position: 'relative', width: '60px', height: '60px' }}>
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={60}
                  thickness={3}
                  sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}
                />
                <CircularProgress
                  variant="determinate"
                  value={metrics.winPercentage}
                  size={60}
                  thickness={3}
                  sx={{ 
                    color: isWinRateGood ? positiveColor : negativeColor,
                    position: 'absolute',
                    left: 0,
                    top: 0
                  }}
                />
                <div style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  bottom: 0, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center'
                }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', lineHeight: 1 }}>
                    {metrics.winPercentage.toFixed(1)}
                  </Typography>
                  <Typography sx={{ fontSize: '0.55rem', color: 'text.secondary' }}>
                    %
                  </Typography>
                </div>
              </div>
              <div style={{ 
                display: 'inline-block',
                backgroundColor: isWinRateGood ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                color: isWinRateGood ? positiveColor : negativeColor,
                padding: '2px 6px',
                borderRadius: '6px',
                marginTop: '6px',
                whiteSpace: 'nowrap'
              }}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.6rem' }}>
                  {metrics.winningTrades}/{metrics.totalTrades} trades
                </Typography>
              </div>
            </div>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Average Win/Loss - Full Width */}
      <Paper elevation={0} sx={cardStyle}>
        <Typography sx={titleStyle}>Average Win/Loss</Typography>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <Typography sx={{ fontWeight: 600, fontSize: '0.65rem' }}>
                Average Win
              </Typography>
              <Typography sx={{ fontWeight: 700, color: positiveColor, fontSize: '0.65rem' }}>
                ${metrics.averageWin.toFixed(2)}
              </Typography>
            </div>
            <LinearProgress
              variant="determinate"
              value={100}
              sx={{ 
                height: 6, 
                borderRadius: 3, 
                backgroundColor: 'rgba(52, 211, 153, 0.2)',
                '.MuiLinearProgress-bar': {
                  backgroundColor: positiveColor,
                  borderRadius: 3,
                }
              }}
            />
          </div>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <Typography sx={{ fontWeight: 600, fontSize: '0.65rem' }}>
                Average Loss
              </Typography>
              <Typography sx={{ fontWeight: 700, color: negativeColor, fontSize: '0.65rem' }}>
                ${metrics.averageLoss.toFixed(2)}
              </Typography>
            </div>
            <LinearProgress
              variant="determinate"
              value={100}
              sx={{ 
                height: 6, 
                borderRadius: 3, 
                backgroundColor: 'rgba(248, 113, 113, 0.2)',
                '.MuiLinearProgress-bar': {
                  backgroundColor: negativeColor,
                  borderRadius: 3,
                }
              }}
            />
          </div>
          
          <Divider sx={{ my: '2px' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '0.65rem' }}>
              Win/Loss Ratio:
            </Typography>
            <div style={{ 
              backgroundColor: isWinLossRatioGood ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)',
              color: isWinLossRatioGood ? positiveColor : negativeColor,
              padding: '3px 8px',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '0.75rem'
            }}>
              {winLossRatio.toFixed(2) + ":1"}
            </div>
          </div>
        </div>
      </Paper>
    </Box>
  );
};