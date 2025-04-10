import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isWeekend, isSameDay } from 'date-fns';

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
  
  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
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
  
  // Calendar rows (weeks)
  const weeks: DayData[][] = [];
  let days: DayData[] = [];
  
  calendarDays.forEach((day, i) => {
    if (i % 7 === 0 && days.length) {
      weeks.push(days);
      days = [];
    }
    days.push(day);
    if (i === calendarDays.length - 1) {
      weeks.push(days);
    }
  });
  
  return (
    <Card className="h-full bg-neutral-800 border-neutral-700">
      <CardContent className="p-2">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xs font-medium">Monthly Performance</h2>
          <div className="flex items-center space-x-1">
            <button 
              className="p-0.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded"
              onClick={prevMonth}
            >
              <ChevronLeft className="h-3 w-3" />
            </button>
            <span className="text-xs">{format(viewDate, 'MMMM yyyy')}</span>
            <button 
              className="p-0.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded"
              onClick={nextMonth}
            >
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
        
        {/* Days of week */}
        <div className="grid grid-cols-7 mb-1">
          {['M', 'T1', 'W', 'T2', 'F', 'S1', 'S2'].map((day, index) => (
            <div key={index} className="text-[9px] text-neutral-500 dark:text-neutral-400 text-center">
              {day.charAt(0)}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {weeks.map((week, weekIndex) => 
            week.map((day, dayIndex) => {
              const isToday = isSameDay(day.date, new Date());
              const isWeekendDay = isWeekend(day.date);
              
              let dayClass = 'h-full rounded p-0.5 aspect-square';
              
              if (!day.isCurrentMonth) {
                dayClass += ' opacity-50 bg-neutral-100 dark:bg-neutral-700';
              } else if (isWeekendDay) {
                dayClass += ' bg-neutral-100 dark:bg-neutral-700';
              } else if (day.pnl !== null) {
                if (day.pnl > 0) {
                  dayClass += ' bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30';
                } else if (day.pnl < 0) {
                  dayClass += ' bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30';
                } else {
                  dayClass += ' bg-neutral-50 dark:bg-neutral-800';
                }
              } else {
                dayClass += ' bg-neutral-50 dark:bg-neutral-800';
              }
              
              if (isToday) {
                dayClass += ' bg-primary-light/10 dark:bg-primary-dark/20 border-2 border-primary-light dark:border-primary-dark';
              }
              
              return (
                <div key={`${weekIndex}-${dayIndex}`} className="w-full">
                  <div className={dayClass}>
                    <div className="text-[9px] leading-tight">{format(day.date, 'd')}</div>
                    {day.isCurrentMonth && day.pnl !== null && (
                      <div className="mt-0.5 text-center">
                        <div className={`text-[9px] leading-tight font-medium ${day.pnl > 0 ? 'text-positive-light dark:text-positive-dark' : 'text-negative-light dark:text-negative-dark'}`}>
                          {day.pnl > 0 ? '+' : ''}${Math.abs(day.pnl).toFixed(0)}
                        </div>
                        <div className="text-[7px] leading-tight text-neutral-500 dark:text-neutral-400">
                          {day.tradesCount}t
                        </div>
                      </div>
                    )}
                    {day.isCurrentMonth && isWeekendDay && (
                      <div className="mt-0.5 text-center">
                        <div className="text-[7px] leading-tight text-neutral-500 dark:text-neutral-400">
                          wknd
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {/* Legend */}
        <div className="flex justify-end mt-2 text-[9px] space-x-2">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 mr-0.5"></div>
            <span className="text-neutral-500 dark:text-neutral-400">Profit</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 mr-0.5"></div>
            <span className="text-neutral-500 dark:text-neutral-400">Loss</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded bg-neutral-100 dark:bg-neutral-700 mr-0.5"></div>
            <span className="text-neutral-500 dark:text-neutral-400">No Trading</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
