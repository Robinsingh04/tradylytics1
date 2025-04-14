import React, { useState } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  styled,
  useTheme,
  Box,
  Divider
} from '@mui/material';
import { CalendarSelector } from '../components/journaling/CalendarSelector';
import { TradeDetailsTable } from '../components/journaling/TradeDetailsTable';
import { DailyMetricsPanel } from '../components/journaling/DailyMetricsPanel';
import { Trade, DailyMetrics } from '../types/journaling';
import { generateMockTradeData, generateMockMetricsData } from '../utils/mockData';
import '../styles/components/journaling.scss';

const PageContainer = styled(Box)(({ theme }) => ({
  padding: '15px',
  height: 'calc(100vh - 70px)',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#f5f5f5',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: '6px',
  color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#333333',
  fontSize: '1.3rem',
}));

// Styled components for each quadrant
const QuadrantPaper = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(1.5),
  height: '100%',
  overflow: 'hidden',
  borderRadius: '6px',
  backgroundColor: theme.palette.mode === 'dark' ? '#1E1E1E' : '#FFFFFF',
}));

// Styled component specifically for the trade table that spans two quadrants
const TradeTablePaper = styled(QuadrantPaper)(({ theme }) => ({
  gridArea: 'trades',
}));

// Component title styling
const ComponentTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(1),
  paddingBottom: theme.spacing(0.75),
  borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: '0.85rem',
}));

export const JournalingCalendar = () => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [trades, setTrades] = useState<Trade[]>(generateMockTradeData(selectedDate));
  const [metrics, setMetrics] = useState<DailyMetrics>(generateMockMetricsData(selectedDate));

  // Handle date change from calendar
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    // Fetch data for the selected date (using mock data for now)
    setTrades(generateMockTradeData(date));
    setMetrics(generateMockMetricsData(date));
  };

  return (
    <PageContainer>
      <SectionTitle variant="h4">Journaling Calendar</SectionTitle>
      
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { 
          xs: '1fr', 
          md: 'minmax(0, 1fr) 320px' // Use minmax to prevent trade table from shrinking too much
        },
        gridTemplateRows: { 
          xs: 'auto auto auto', 
          md: 'auto auto 1fr' 
        },
        gridTemplateAreas: {
          xs: `
            "calendar"
            "metrics"
            "trades"
          `,
          md: `
            "trades calendar"
            "trades metrics"
            "trades ."
          `
        },
        gap: 2,
        height: 'calc(100% - 40px)',
        m: 0, // Remove outer margin
        p: 0
      }}>
        {/* TOP RIGHT - Calendar */}
        <Box sx={{ 
          gridArea: 'calendar',
          width: { xs: '100%', md: '320px' },
          maxWidth: '100%',
          height: 'fit-content'
        }}>
          <QuadrantPaper 
            elevation={1} 
            className="journaling-paper calendar-panel"
            sx={{ p: 1.5, width: '100%' }}
          >
            <ComponentTitle variant="h6">Select Trading Day</ComponentTitle>
            <CalendarSelector 
              selectedDate={selectedDate} 
              onDateChange={handleDateChange} 
            />
          </QuadrantPaper>
        </Box>
        
        {/* MIDDLE RIGHT - Directly below Calendar - Metrics Panel */}
        <Box sx={{ 
          gridArea: 'metrics',
          width: { xs: '100%', md: '320px' },
          maxWidth: '100%',
          height: 'fit-content'
        }}>
          <QuadrantPaper 
            elevation={1} 
            className="journaling-paper metrics-panel"
            sx={{ p: 1.5, width: '100%' }}
          >
            <ComponentTitle variant="h6">Daily Metrics</ComponentTitle>
            <DailyMetricsPanel metrics={metrics} />
          </QuadrantPaper>
        </Box>
        
        {/* LEFT SIDE - Trade Table */}
        <Box sx={{ 
          gridArea: 'trades',
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0 // Prevent flexbox from overflowing
        }}>
          <TradeTablePaper 
            elevation={1} 
            className="journaling-paper trade-table-panel"
            sx={{ width: '100%' }}
          >
            <ComponentTitle variant="h6">Trade Details</ComponentTitle>
            <TradeDetailsTable trades={trades} />
          </TradeTablePaper>
        </Box>
      </Box>
    </PageContainer>
  );
}; 