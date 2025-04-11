import React from 'react';

interface DayProps {
  date: number;
  isActive?: boolean;
  hasActivity?: boolean;
}

const Day = ({ date, isActive, hasActivity }: DayProps) => (
  <button 
    className={`day-cell ${isActive ? 'active' : ''} ${hasActivity ? 'has-activity' : ''}`}
  >
    <span className="day-text">{date}</span>
  </button>
);

export const MonthlyCalendar = () => {
  const currentDate = new Date();
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <span className="calendar-title">Monthly Performance</span>
        <span className="month-year">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
      </div>
      
      <div className="calendar-grid">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
          <div key={index} className="day-header">
            <span className="day-header-text">{day}</span>
          </div>
        ))}
        
        {days.map((day) => (
          <Day 
            key={day} 
            date={day}
            isActive={day === currentDate.getDate()}
            hasActivity={Math.random() > 0.7} // Example activity indicator
          />
        ))}
      </div>

      <style jsx>{`
        .calendar-container {
          background-color: #1E1E1E;
          border-radius: 8px;
          padding: 16px;
          margin: 8px;
        }
        .calendar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .calendar-title {
          color: #FFFFFF;
          font-size: 16px;
          font-weight: 600;
        }
        .month-year {
          color: #AAAAAA;
          font-size: 14px;
        }
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        }
        .day-header {
          padding: 8px 0;
          text-align: center;
        }
        .day-header-text {
          color: #AAAAAA;
          font-size: 12px;
        }
        .day-cell {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: none;
          border-radius: 4px;
          cursor: pointer;
          padding: 0;
          color: #FFFFFF;
          font-size: 14px;
        }
        .day-cell:hover {
          background-color: #2A2A2A;
        }
        .day-cell.active {
          background-color: #2196F3;
        }
        .day-cell.has-activity {
          border: 1px solid #4CAF50;
        }
      `}</style>
    </div>
  );
}; 