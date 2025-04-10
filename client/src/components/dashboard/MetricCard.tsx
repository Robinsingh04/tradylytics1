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
  width: 28,
  height: 28,
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
      const activeElements = chart.getActiveElements();
      
      // Only update if we don't already have the right point active
      if (activeElements.length === 0 || activeElements[0].index !== activeIndex) {
        chart.setActiveElements([{
          datasetIndex: 0,
          index: activeIndex
        }]);
        
        // Force the tooltip to update
        chart.tooltip?.setActiveElements([{
          datasetIndex: 0,
          index: activeIndex
        }], { x: 0, y: 0 });
        
        chart.update();
      }
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
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
        min: Math.min(...chartData) * 0.95,
        max: Math.max(...chartData) * 1.05,
      },
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 0,
      },
      line: {
        tension: 0.3,
        borderWidth: 2,
      },
    },
    onHover: handleHover,
  };

  // Prepare chart data
  const data = {
    labels,
    datasets: [
      {
        data: chartData,
        borderColor: chartColor,
        backgroundColor: 'transparent',
        borderWidth: 2,
        fill: false,
        pointBackgroundColor: chartColor,
        pointBorderColor: chartColor,
      },
    ],
  };

  return (
    <StyledCard>
      <StyledCardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <IconWrapper>
            <Typography fontSize="1rem" fontWeight={500}>
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
