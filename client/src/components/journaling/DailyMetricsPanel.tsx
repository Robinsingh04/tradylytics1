import React from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  styled, 
  useTheme,
  Paper,
  CircularProgress,
  LinearProgress,
  Divider
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

const MetricsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  height: '100%',
  overflow: 'hidden',
}));

const MetricCard = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : '#FFFFFF',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
  height: '100%',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: theme.shadows[2],
    transform: 'translateY(-1px)'
  }
}));

const MetricTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.65rem',
  fontWeight: 600,
  color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
  marginBottom: theme.spacing(0.75),
}));

// Custom circular progress with label
const CircularProgressWithLabel = ({ 
  value, 
  color, 
  label, 
  size = 60,
  fontSize = '0.9rem',
  labelSize = '0.55rem'
}: { 
  value: number, 
  color: string, 
  label: string,
  size?: number,
  fontSize?: string,
  labelSize?: string
}) => {
  const theme = useTheme();
  const normalizedValue = Math.min(Math.max(0, value), 100);
  
  // Determine background color based on theme
  const bgColor = theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)';
  
  return (
    <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Background Circle */}
      <CircularProgress
        variant="determinate"
        value={100}
        size={size}
        thickness={3}
        sx={{
          color: bgColor,
          position: 'absolute',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
          },
        }}
      />
      
      {/* Value Circle */}
      <CircularProgress
        variant="determinate"
        value={normalizedValue}
        size={size}
        thickness={3}
        sx={{
          color,
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'round',
            transition: 'stroke-dashoffset 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            animation: 'progress 1s ease-out forwards',
            '@keyframes progress': {
              '0%': {
                strokeDashoffset: '276.46px', // Circumference of a 100% circle
              },
              '100%': {
                strokeDashoffset: `${276.46 - (normalizedValue / 100) * 276.46}px`,
              },
            },
          },
        }}
      />
      
      {/* Central value display */}
      <Box
        sx={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="h6"
          component="div"
          color="text.primary"
          sx={{ fontWeight: 700, fontSize, lineHeight: 1.2 }}
        >
          {value.toFixed(1)}
        </Typography>
        <Typography
          variant="caption"
          component="div"
          color="text.secondary"
          sx={{ fontSize: labelSize, marginTop: '1px' }}
        >
          {label}
        </Typography>
      </Box>
    </Box>
  );
};

export const DailyMetricsPanel = ({ metrics }: DailyMetricsPanelProps) => {
  const theme = useTheme();
  
  // Generate cumulative P&L data for chart
  const plData = metrics.timestamps.map((time, index) => ({
    time,
    pnl: metrics.netCumulativePL[index],
  }));
  
  // Determine if metrics show positive results
  const finalPnL = metrics.netCumulativePL[metrics.netCumulativePL.length - 1];
  const isProfitable = metrics.profitFactor >= 1;
  const isWinRateGood = metrics.winPercentage >= 50;
  
  return (
    <MetricsContainer>
      <Grid container spacing={1.5} sx={{ flex: 1, minHeight: 0, height: '100%' }}>
        {/* P&L Chart */}
        <Grid item xs={12} sx={{ height: '40%' }}>
          <MetricCard sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <MetricTitle>Net Cumulative P&L</MetricTitle>
            <Box sx={{ flex: 1, width: '100%', overflow: 'hidden', minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={plData}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorPnL" x1="0" y1="0" x2="0" y2="1">
                      <stop 
                        offset="5%" 
                        stopColor={finalPnL >= 0 ? "#34d399" : "#f87171"} 
                        stopOpacity={0.8}
                      />
                      <stop 
                        offset="95%" 
                        stopColor={finalPnL >= 0 ? "#34d399" : "#f87171"} 
                        stopOpacity={0.2}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 8 }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    tick={{ fontSize: 8 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                    width={30}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'P&L']}
                    labelFormatter={(label) => `Time: ${label}`}
                    contentStyle={{
                      backgroundColor: theme.palette.mode === 'dark' ? '#1A1A1A' : '#FFFFFF',
                      border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
                      borderRadius: 6,
                      fontSize: '0.65rem',
                      padding: '6px 9px',
                      boxShadow: '0 3px 4px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
                  <Area 
                    type="monotone" 
                    dataKey="pnl" 
                    stroke={finalPnL >= 0 ? "#34d399" : "#f87171"} 
                    strokeWidth={1.5}
                    fillOpacity={1}
                    fill="url(#colorPnL)"
                    animationDuration={1000}
                    animationEasing="ease-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </MetricCard>
        </Grid>
        
        {/* Metrics Cards Row */}
        <Grid item xs={12} sx={{ height: '60%' }}>
          <Grid container spacing={1.5} sx={{ height: '100%' }}>
            <Grid item xs={6} sx={{ height: '50%' }}>
              <MetricCard>
                <MetricTitle>Profit Factor</MetricTitle>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  flex: 1,
                  gap: 1.5
                }}>
                  <CircularProgressWithLabel 
                    value={Math.min(metrics.profitFactor * 10, 100)} 
                    color={isProfitable ? '#34d399' : '#f87171'} 
                    label="Profit Factor"
                  />
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'flex-start'
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      bgcolor: isProfitable ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                      color: isProfitable ? '#34d399' : '#f87171',
                      px: 1,
                      py: 0.375,
                      borderRadius: 0.75,
                      mb: 0.75
                    }}>
                      {isProfitable ? (
                        <TrendingUpIcon fontSize="small" sx={{ mr: 0.375, fontSize: '0.9rem' }} />
                      ) : (
                        <TrendingDownIcon fontSize="small" sx={{ mr: 0.375, fontSize: '0.9rem' }} />
                      )}
                      <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.65rem' }}>
                        {isProfitable ? 'Profitable' : 'Unprofitable'}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.55rem' }}>
                      Ratio of gross profits to gross losses
                    </Typography>
                  </Box>
                </Box>
              </MetricCard>
            </Grid>
            
            <Grid item xs={6} sx={{ height: '50%' }}>
              <MetricCard>
                <MetricTitle>Win Percentage</MetricTitle>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  flex: 1,
                  gap: 1.5
                }}>
                  <CircularProgressWithLabel 
                    value={metrics.winPercentage} 
                    color={isWinRateGood ? '#34d399' : '#f87171'} 
                    label="%"
                  />
                  <Box>
                    <Typography 
                      variant="body2" 
                      sx={{
                        display: 'inline-block',
                        bgcolor: isWinRateGood ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                        color: isWinRateGood ? '#34d399' : '#f87171',
                        px: 1,
                        py: 0.375,
                        borderRadius: 0.75,
                        mb: 0.75,
                        fontWeight: 600,
                        fontSize: '0.65rem'
                      }}
                    >
                      {metrics.winningTrades} wins, {metrics.losingTrades} losses
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: '0.55rem' }}>
                      Percentage of winning trades
                    </Typography>
                  </Box>
                </Box>
              </MetricCard>
            </Grid>
            
            <Grid item xs={12} sx={{ height: '50%' }}>
              <MetricCard>
                <MetricTitle>Average Win/Loss</MetricTitle>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', gap: 1.5 }}>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                      <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.65rem' }}>Average Win</Typography>
                      <Typography variant="body2" fontWeight={700} color="#34d399" sx={{ fontSize: '0.65rem' }}>${metrics.averageWin.toFixed(2)}</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={100}
                      sx={{ 
                        height: 6, 
                        borderRadius: 3, 
                        backgroundColor: 'rgba(52, 211, 153, 0.2)',
                        '.MuiLinearProgress-bar': {
                          backgroundColor: '#34d399',
                          borderRadius: 3,
                        }
                      }}
                    />
                  </Box>
                  
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                      <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.65rem' }}>Average Loss</Typography>
                      <Typography variant="body2" fontWeight={700} color="#f87171" sx={{ fontSize: '0.65rem' }}>${metrics.averageLoss.toFixed(2)}</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={100}
                      sx={{ 
                        height: 6, 
                        borderRadius: 3, 
                        backgroundColor: 'rgba(248, 113, 113, 0.2)',
                        '.MuiLinearProgress-bar': {
                          backgroundColor: '#f87171',
                          borderRadius: 3,
                        }
                      }}
                    />
                  </Box>
                  
                  <Divider sx={{ my: 0.375 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontSize: '0.65rem' }}>Win/Loss Ratio:</Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: 700,
                        color: metrics.averageWin > metrics.averageLoss ? '#34d399' : '#f87171',
                        bgcolor: metrics.averageWin > metrics.averageLoss ? 'rgba(52, 211, 153, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                        px: 1,
                        py: 0.375,
                        borderRadius: 0.75,
                        fontSize: '0.75rem'
                      }}
                    >
                      {(metrics.averageWin / (metrics.averageLoss || 1)).toFixed(2)}:1
                    </Typography>
                  </Box>
                </Box>
              </MetricCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </MetricsContainer>
  );
}; 