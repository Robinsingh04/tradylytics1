import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isWeekend, isSameDay } from 'date-fns';
import { DayDetailsPopup } from './DayDetailsPopup';

interface DayData {
  date: Date;
  pnl: number | null;
  tradesCount: number | null;
  isCurrentMonth: boolean;
}

interface CalendarViewProps {
  monthlyData: Array<{
    date: Date;
    pnl: number;
    tradesCount: number;
  }>;
  currentDate?: Date;
}

export function CalendarView({ 
  monthlyData, 
  currentDate = new Date() 
}: CalendarViewProps) {
  const [viewDate, setViewDate] = useState(currentDate);
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  
  // Previous and next month navigation
  const prevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };
  
  // Calculate the start of the calendar grid (might include days from previous month)
  const startDay = new Date(monthStart);
  startDay.setDate(startDay.getDate() - (startDay.getDay() === 0 ? 6 : startDay.getDay() - 1));
  
  // Calculate the end of the calendar grid (might include days from next month)
  const endDay = new Date(monthEnd);
  const daysToAdd = 7 - endDay.getDay();
  endDay.setDate(endDay.getDate() + (endDay.getDay() === 0 ? 0 : daysToAdd));
  
  // Generate all days to display in the calendar
  const calendarDays: DayData[] = eachDayOfInterval({ start: startDay, end: endDay }).map(date => {
    const matchingData = monthlyData.find(d => 
      isSameDay(new Date(d.date), date)
    );
    
    return {
      date,
      pnl: matchingData?.pnl || null,
      tradesCount: matchingData?.tradesCount || null,
      isCurrentMonth: isSameMonth(date, viewDate)
    };
  });
  
  // Generate weeks array for display
  const weeks: DayData[][] = [];
  let days: DayData[] = [];
  
  calendarDays.forEach((day, i) => {
    if (i % 7 === 0 && days.length) { // Use 7 days per week
      weeks.push(days);
      days = [];
    }
    days.push(day);
    if (i === calendarDays.length - 1) {
      weeks.push(days);
    }
  });
  
  // Format currency
  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1000) {
      return `${value > 0 ? '+' : ''}₹${Math.abs(Math.round(value / 100) / 10)}k`;
    }
    return `${value > 0 ? '+' : ''}₹${Math.abs(value)}`;
  };

  // Handle day click
  const handleDayClick = (day: DayData) => {
    if (!day.isCurrentMonth) return; // Don't open modal for days outside current month
    
    // Only show modal for days with data
    if (day.pnl !== null) {
      setSelectedDay(day);
      setIsModalOpen(true);
    }
  };

  // Generate mock data for the day details modal
  const generateDayDetails = (day: DayData) => {
    // In a real app, you would fetch this data from your API
    const pnl = day.pnl || 0;
    const tradeCount = day.tradesCount || 4; // Ensure at least some trades for demo
    
    // For demo purposes, we'll generate some mock data
    const isPositive = pnl >= 0;
    const wins = isPositive ? Math.max(1, Math.ceil(tradeCount * 0.6)) : Math.max(1, Math.floor(tradeCount * 0.4));
    const losses = Math.max(1, tradeCount - wins);
    
    return {
      netPnl: pnl,
      tradeCount: tradeCount,
      winRate: (wins / (wins + losses)) * 100,
      profitFactor: Math.max(0.1, isPositive ? 1.5 : 0.5),
      wins,
      losses,
      instruments: [
        { 
          name: 'NIFTY', 
          trades: Math.max(1, Math.ceil(tradeCount * 0.6)), 
          pnl: Math.round(pnl * 0.7) 
        },
        { 
          name: 'BANKNIFTY', 
          trades: Math.max(1, Math.floor(tradeCount * 0.4)), 
          pnl: Math.round(pnl * 0.3) 
        }
      ],
      timeOfDay: {
        morning: { 
          trades: Math.max(1, Math.ceil(tradeCount * 0.4)), 
          pnl: Math.round(pnl * 0.5) 
        },
        afternoon: { 
          trades: Math.max(1, Math.ceil(tradeCount * 0.4)), 
          pnl: Math.round(pnl * 0.3) 
        },
        evening: { 
          trades: Math.max(1, Math.floor(tradeCount * 0.2)), 
          pnl: Math.round(pnl * 0.2) 
        }
      }
    };
  };
  
  return (
    <div className="calendar-wrapper">
      <div className="card-header">
        <div className="card-title">Monthly Performance</div>
        <div className="month-navigation flex items-center">
          <button className="month-nav-button text-lg sm:text-xl" onClick={prevMonth}>
            &lt;
          </button>
          <span className="current-month text-xs sm:text-sm px-1 sm:px-2">{format(viewDate, 'MMMM yyyy')}</span>
          <button className="month-nav-button text-lg sm:text-xl" onClick={nextMonth}>
            &gt;
          </button>
        </div>
      </div>
      
      <div className="calendar-grid">
        {/* Day headers */}
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
          <div key={index} className="day-header">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {calendarDays.map((day, index) => {
          const dayNumber = format(day.date, 'd');
          const isWeekendDay = isWeekend(day.date);
          const isToday = isSameDay(day.date, new Date());
          
          let dayClass = "calendar-day";
          if (!day.isCurrentMonth) {
            dayClass += " faded";
          }
          
          // Add positive/negative class based on PnL
          if (day.pnl !== null) {
            dayClass += day.pnl > 0 ? " positive" : " negative";
          }
          
          // Add weekend class
          if (isWeekendDay) {
            dayClass += " weekend";
          }
          
          // Add today class
          if (isToday) {
            dayClass += " today";
          }
          
          // Add cursor pointer for clickable days
          if (day.isCurrentMonth) {
            dayClass += " cursor-pointer";
          }
          
          return (
            <div 
              key={index} 
              className={dayClass}
              onClick={() => handleDayClick(day)}
            >
              <div className="day-number">{dayNumber}</div>
              
              {day.isCurrentMonth && isWeekendDay && (
                <div className="day-label">wknd</div>
              )}
              
              {day.isCurrentMonth && day.pnl !== null && (
                <>
                  <div className={`day-pnl ${day.pnl > 0 ? 'positive' : 'negative'}`}>
                    {formatCurrency(day.pnl)}
                  </div>
                  {day.tradesCount && (
                    <div className="day-trades">{day.tradesCount}t</div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Day Details Popup */}
      {selectedDay && (
        <DayDetailsPopup
          date={selectedDay.date}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={generateDayDetails(selectedDay)}
        />
      )}
    </div>
  );
}
