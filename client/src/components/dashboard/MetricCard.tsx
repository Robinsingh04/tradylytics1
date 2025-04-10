import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Card as MuiCard, 
  CardContent as MuiCardContent,
  Box,
  Typography,
  useTheme
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { styled } from '@mui/material/styles';
import { useSyncHover } from '../../hooks/use-sync-hover';

// Import Chart.js utilities
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend,
  ChartEvent,
  ActiveElement,
  TooltipItem,
  ChartTypeRegistry
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend
);

// Define data point interface
export interface ChartDataPoint {
  value: number;
  label: string;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string | number;
  isPositive: boolean;
  isMonetary?: boolean;
  chartData?: number[];
  color?: string;
  prefix?: string;
  suffix?: string;
}

const StyledCard = styled(MuiCard)(({ theme }) => ({
  height: '100%',
  backgroundColor: theme.palette.mode === 'dark' ? '#111' : '#ffffff',
  boxShadow: 'none',
  border: `1px solid ${theme.palette.mode === 'dark' ? '#1d1d1d' : '#e0e0e0'}`,
  borderRadius: '8px',
  overflow: 'hidden',
}));

const StyledCardContent = styled(MuiCardContent)({
  padding: 14,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:last-child': {
    paddingBottom: 14,
  },
});

const IconWrapper = styled(Box)(({ theme }) => ({
  width: 24,
  height: 24,
  borderRadius: '50%',
  backgroundColor: theme.palette.mode === 'dark' ? '#1d1d1d' : '#f0f0f0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 8,
}));

export function MetricCard({ 
  title, 
  value, 
  change, 
  isPositive, 
  isMonetary = false,
  chartData = [30, 45, 65, 40, 70, 90, 85, 95, 80, 90, 100, 90],
  color,
  prefix = '',
  suffix = '',
}: MetricCardProps) {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);
  const chartRef = useRef<ChartJS | null>(null);
  const { activeIndex, setActiveIndex } = useSyncHover();
  
  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle sync hover effect
  useEffect(() => {
    const chart = chartRef.current;
    
    if (chart && activeIndex !== null) {
      // Get current active elements
      const activeElements = chart.getActiveElements();
      
      // Only update if we don't already have the right point active
      if (activeElements.length === 0 || activeElements[0].index !== activeIndex) {
        try {
          // Set active elements (the visible point)
          chart.setActiveElements([{
            datasetIndex: 0,
            index: activeIndex
          }]);
          
          // Force the tooltip to update
          if (chart.tooltip) {
            chart.tooltip.setActiveElements([{
              datasetIndex: 0,
              index: activeIndex
            }], { x: 0, y: 0 });
          }
          
          // Update the chart
          chart.update('none'); // Use 'none' to prevent animation
        } catch (error) {
          console.log('Chart hover sync error:', error);
        }
      }
    } else if (chart && activeIndex === null) {
      // Clear active elements when no hover
      chart.setActiveElements([]);
      chart.update('none');
    }
  }, [activeIndex]);

  const handleHover = useCallback(
    (event: ChartEvent, elements: ActiveElement[]) => {
      if (elements.length > 0) {
        setActiveIndex(elements[0].index);
      } else {
        setActiveIndex(null);
      }
    },
    [setActiveIndex]
  );

  if (!mounted) return null;

  const formattedValue = isMonetary 
    ? typeof value === 'string' ? value : `₹${value.toLocaleString()}`
    : `${prefix}${value}${suffix}`;

  const formattedChange = typeof change === 'string' 
    ? change 
    : `${isPositive ? '+' : ''}${change}%`;

  const positiveColor = '#00c853';
  const negativeColor = '#ff5252';
  const chartColor = color || (isPositive ? positiveColor : negativeColor);
  const changeColor = isPositive ? positiveColor : negativeColor;

  // Generate chart labels (12 months)
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Configure chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
      hover: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
        min: Math.min(...chartData) * 0.9,
        max: Math.max(...chartData) * 1.05,
        beginAtZero: false,
      },
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 4,
        hoverBorderWidth: 1,
      },
      line: {
        tension: 0.4,
        borderWidth: 1.5,
        fill: false,
      },
    },
    onHover: handleHover,
  };

  // Create gradient
  const createGradientFill = (ctx: any, color: string) => {
    if (!ctx) return 'transparent';
    
    const gradient = ctx.createLinearGradient(0, 0, 0, 100);
    gradient.addColorStop(0, `${color}33`); // 20% opacity
    gradient.addColorStop(1, `${color}00`); // 0% opacity
    return gradient;
  };

  // Prepare chart data
  const data = {
    labels,
    datasets: [
      {
        data: chartData,
        borderColor: chartColor,
        backgroundColor: (context: any) => {
          const chart = context.chart;
          const { ctx } = chart;
          return createGradientFill(ctx, chartColor);
        },
        borderWidth: 1.5,
        fill: true,
        pointBackgroundColor: chartColor,
        pointBorderColor: chartColor,
        pointHoverRadius: 2,
        pointHoverBackgroundColor: chartColor,
        pointHoverBorderColor: '#fff',
        tension: 0.4,
      },
    ],
  };

  return (
    <StyledCard>
      <StyledCardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <IconWrapper sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }}>
            <Typography fontSize="0.9rem" fontWeight={500} sx={{ color: chartColor }}>
              {title.charAt(0)}
            </Typography>
          </IconWrapper>
          <Typography
            fontSize="0.7rem"
            fontWeight={500}
            color={theme.palette.mode === 'dark' ? 'text.secondary' : 'text.primary'}
          >
            {title}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
          <Typography
            variant="h6"
            fontWeight={600}
            fontSize="1.1rem"
            sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}
          >
            {formattedValue}
          </Typography>
          <Typography
            fontSize="0.7rem"
            fontWeight={600}
            sx={{ color: changeColor, display: 'flex', alignItems: 'center' }}
          >
            {isPositive ? (
              <ArrowUpwardIcon sx={{ fontSize: 12, mr: 0.3 }} />
            ) : (
              <ArrowDownwardIcon sx={{ fontSize: 12, mr: 0.3 }} />
            )}
            {formattedChange}
          </Typography>
        </Box>
        
        <Box sx={{ flex: 1, minHeight: 50 }}>
          <Line 
            data={data} 
            options={options}
            style={{ height: '100%' }}
            ref={(ref: any) => {
              // Access the underlying Chart.js instance
              if (ref) {
                chartRef.current = ref.current;
              }
            }}
          />
        </Box>
      </StyledCardContent>
    </StyledCard>
  );
}
