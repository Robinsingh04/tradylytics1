import React from 'react';
import { Box, Typography } from '@mui/material';
import styled from '@emotion/styled';

const ChartContainer = styled(Box)(({ theme }) => ({
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const ChartHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(0.5),
}));

const ChartTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

const ChartBody = styled(Box)({
  flex: 1,
  minHeight: '150px',
  width: '100%',
  position: 'relative',
});

const PerformanceMetricsChart: React.FC = () => {
  const chartOptions = {
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          boxWidth: 12,
          padding: 8,
          font: {
            size: 9,
          },
        },
      },
      tooltip: {
        enabled: true,
        bodyFont: {
          size: 9,
        },
        titleFont: {
          size: 9,
        },
        padding: 6,
      },
    },
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 9,
          },
          padding: 3,
        },
        grid: {
          display: true,
          color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        },
      },
      x: {
        ticks: {
          font: {
            size: 9,
          },
          padding: 3,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>Performance Metrics</ChartTitle>
      </ChartHeader>
      <ChartBody>
        {/* Chart content will be rendered here */}
      </ChartBody>
    </ChartContainer>
  );
};

export default PerformanceMetricsChart; 