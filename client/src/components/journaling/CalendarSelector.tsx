import React, { useState } from 'react';
import { 
  styled, 
  useTheme, 
  Box,
  Typography,
  IconButton,
  Paper
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { format, addMonths, subMonths, isSameMonth, isSameDay, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isToday } from 'date-fns';

interface CalendarSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const CalendarWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  overflow: 'hidden',
  padding: theme.spacing(0.5),
  width: '100%',
  maxWidth: '280px',
  margin: '0 auto',
}));

const CalendarContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  padding: theme.spacing(0.5),
  width: '100%',
}));

export const CalendarSelector = ({ 
  selectedDate, 
  onDateChange 
}: CalendarSelectorProps) => {
  const theme = useTheme();
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate));
  
  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  
  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const handleDateClick = (day: Date) => {
    onDateChange(day);
  };
  
  const renderDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    
    const rows = [];
    let days = [];
    let day = startDate;
    
    // Render day headers
    const dayHeaders = daysOfWeek.map(dayName => (
      <div key={dayName} className="weekday">
        {dayName}
      </div>
    ));
    
    rows.push(
      <div className="weekday-header" key="header">
        {dayHeaders}
      </div>
    );
    
    // Calculate grid
    const grid = [];
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = new Date(day);
        const isSelected = isSameDay(day, selectedDate);
        const isCurrentMonthDay = isSameMonth(day, currentMonth);
        const isTodayDay = isToday(day);
        
        grid.push(
          <div 
            key={day.toString()} 
            onClick={() => handleDateClick(cloneDay)}
            className={`calendar-day ${isSelected ? 'selected' : ''} ${isTodayDay ? 'today' : ''} ${!isCurrentMonthDay ? 'other-month' : ''}`}
          >
            {format(day, 'd')}
          </div>
        );
        
        day = addDays(day, 1);
      }
    }
    
    rows.push(
      <div className="calendar-grid" key="grid">
        {grid}
      </div>
    );
    
    return rows;
  };

  return (
    <CalendarWrapper className="calendar-selector">
      <div className="calendar-header">
        <IconButton 
          onClick={handlePrevMonth} 
          size="small"
          className="nav-button"
          sx={{ width: '24px', height: '24px' }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: '0.75rem' }} />
        </IconButton>
        <Typography variant="h6" className="month-title" sx={{ fontSize: '0.85rem' }}>
          {format(currentMonth, 'MMMM yyyy')}
        </Typography>
        <IconButton 
          onClick={handleNextMonth} 
          size="small"
          className="nav-button"
          sx={{ width: '24px', height: '24px' }}
        >
          <ArrowForwardIosIcon sx={{ fontSize: '0.75rem' }} />
        </IconButton>
      </div>
      
      <CalendarContent className="calendar-content">
        {renderDays()}
      </CalendarContent>
      
      <Paper elevation={0} className="date-summary">
        <div>
          <div className="date-label">Selected Date</div>
          <div className="date-value">{format(selectedDate, 'MMMM d, yyyy')}</div>
        </div>
        <div>
          <div className="date-label">Day</div>
          <div className="date-value">{format(selectedDate, 'EEEE')}</div>
        </div>
      </Paper>
    </CalendarWrapper>
  );
}; 