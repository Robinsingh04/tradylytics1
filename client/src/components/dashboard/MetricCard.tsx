import { useState, useEffect } from 'react';
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

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string | number;
  isPositive: boolean;
  isMonetary?: boolean;
  chartData?: number[];
}

const StyledCard = styled(MuiCard)(({ theme }) => ({
  height: '100%',
  backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#ffffff',
  boxShadow: theme.shadows[1],
  border: `1px solid ${theme.palette.mode === 'dark' ? '#333333' : '#e0e0e0'}`,
  overflow: 'hidden',
}));

const StyledCardContent = styled(MuiCardContent)({
  padding: 12,
  '&:last-child': {
    paddingBottom: 12,
  },
});

export function MetricCard({ 
  title, 
  value, 
  change, 
  isPositive, 
  isMonetary = false,
  chartData = [30, 45, 65, 40, 70, 90]
}: MetricCardProps) {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const formattedValue = isMonetary 
    ? typeof value === 'string' ? value : `$${value.toLocaleString()}`
    : value;

  const formattedChange = typeof change === 'string' 
    ? change 
    : isMonetary 
      ? `${isPositive ? '+' : ''}${change}%` 
      : `${isPositive ? '+' : ''}${change}`;

  const positiveColor = theme.palette.mode === 'dark' ? '#66bb6a' : '#4caf50';
  const negativeColor = theme.palette.mode === 'dark' ? '#e57373' : '#f44336';
  const changeColor = isPositive ? positiveColor : negativeColor;
  const valueColor = isMonetary ? changeColor : undefined;

  // Determine which bars should be colored
  const barCount = chartData.length;
  const coloredBarsCount = Math.ceil(barCount / 2);
  
  return (
    <StyledCard>
      <StyledCardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography 
              fontSize="10px" 
              fontWeight={500}
              color={theme.palette.mode === 'dark' ? 'text.secondary' : 'text.disabled'}
            >
              {title}
            </Typography>
            <Typography 
              variant="subtitle1" 
              fontWeight={700}
              fontSize="1rem"
              sx={{ color: valueColor }}
            >
              {formattedValue}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', color: changeColor }}>
            {isPositive ? (
              <ArrowUpwardIcon sx={{ fontSize: 14 }} />
            ) : (
              <ArrowDownwardIcon sx={{ fontSize: 14 }} />
            )}
            <Typography 
              fontSize="10px" 
              fontWeight={500} 
              sx={{ ml: 0.5 }}
            >
              {formattedChange}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 1, height: 16, display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
          <Box sx={{ flex: 1, display: 'flex', gap: '1px' }}>
            {chartData.map((height, index) => (
              <Box 
                key={index}
                sx={{
                  height: `${height}%`,
                  flex: 1,
                  alignSelf: 'flex-end',
                  borderRadius: '1px',
                  bgcolor: index >= barCount - coloredBarsCount 
                    ? isPositive 
                      ? positiveColor
                      : negativeColor
                    : theme.palette.mode === 'dark' ? '#333333' : '#f0f0f0',
                  minHeight: 2,
                }}
              />
            ))}
          </Box>
        </Box>
      </StyledCardContent>
    </StyledCard>
  );
}
