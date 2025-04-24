import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { LineChart, DataPoint } from './LineChart';
import { useSyncHover } from '../../hooks/useSyncHover';
import styles from '../../styles/components/MetricCard.module.scss';

// Define metric types for styling
export type MetricType = 'profit-loss' | 'win-rate' | 'risk-reward' | 'drawdown' | 'consistency';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  isPositive: boolean;
  isMonetary?: boolean;
  chartData?: DataPoint[];
  syncId?: string;
  suffix?: string;
  prefix?: string;
  color?: string;
  metricType?: MetricType;
}

// Helper function to map metric type to CSS class name
const getMetricClass = (metricType: MetricType): string => {
  switch(metricType) {
    case 'profit-loss': return styles.profitLoss;
    case 'win-rate': return styles.winRate;
    case 'risk-reward': return styles.riskReward;
    case 'drawdown': return styles.drawdown;
    case 'consistency': return styles.consistency;
    default: return '';
  }
};

export const MetricCard = ({ 
  title, 
  value, 
  change, 
  isPositive,
  isMonetary = false,
  chartData = [],
  syncId = 'dashboard-metrics',
  suffix = '',
  prefix = '',
  metricType = 'profit-loss',
  color
}: MetricCardProps) => {
  const { hoveredIndex, setHoveredIndex } = useSyncHover(syncId);

  const handleHover = (index: number | null) => {
    setHoveredIndex(index);
  };

  // Format the change value to show only 2 decimal places
  const formattedChange = Math.abs(change).toFixed(2);

  // Determine color based on metricType if not explicitly provided
  const getColorForMetricType = (): string => {
    if (color) return color;
    
    switch(metricType) {
      case 'profit-loss': return '#4CAF50'; // Green
      case 'win-rate': return '#2196F3';    // Blue
      case 'risk-reward': return '#3F51B5'; // Indigo
      case 'drawdown': return '#F44336';    // Red
      case 'consistency': return '#9C27B0'; // Purple
      default: return '#4CAF50';            // Default green
    }
  };

  // Get the correct color
  const metricColor = getColorForMetricType();

  // Format the value
  const formattedValue = isMonetary
    ? typeof value === 'number'
      ? `₹${value.toLocaleString()}`
      : value
    : prefix + value + suffix;

  return (
    <Card 
      elevation={2}
      className={`${styles.metricCard} ${getMetricClass(metricType)}`}
      sx={{ 
        borderRadius: 2, 
        height: '100%',
        bgcolor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      <CardContent sx={{ p: 2, pb: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box className={styles.metricHeader}>
          <Typography 
            variant="subtitle2" 
            color="textSecondary" 
            className={styles.metricTitle}
          >
            {title}
          </Typography>
          <Box 
            component="span" 
            className={`${styles.metricBadge} ${isPositive ? styles.positive : styles.negative}`}
          >
            {isPositive ? '+' : '-'}{formattedChange}%
          </Box>
        </Box>
        
        <Typography 
          variant="h4" 
          component="div" 
          className={styles.metricValue}
        >
          {formattedValue}
        </Typography>
        
        {chartData.length > 0 && (
          <Box className={styles.chartContainer} sx={{ flex: 1, minHeight: 60, mt: 1 }}>
            <LineChart 
              data={chartData}
              color={metricColor}
              onHover={handleHover}
              hoveredIndex={hoveredIndex}
              syncId={syncId}
              showTooltip={false}
              height={60}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
