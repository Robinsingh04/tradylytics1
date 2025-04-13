import React from 'react';
import { format } from 'date-fns';

interface DayDetailsData {
  netPnl: number;
  tradeCount: number;
  winRate: number;
  profitFactor: number;
  wins: number;
  losses: number;
  instruments: Array<{
    name: string;
    trades: number;
    pnl: number;
  }>;
  timeOfDay: {
    morning: { trades: number; pnl: number };
    afternoon: { trades: number; pnl: number };
    evening: { trades: number; pnl: number };
  };
}

interface DayDetailsPopupProps {
  date: Date;
  isOpen: boolean;
  onClose: () => void;
  data: DayDetailsData;
}

export const DayDetailsPopup: React.FC<DayDetailsPopupProps> = ({
  date,
  isOpen,
  onClose,
  data
}) => {
  if (!isOpen) return null;
  
  const isPositive = data.netPnl >= 0;
  
  // Format currency
  const formatCurrency = (value: number) => {
    const prefix = value >= 0 ? '+' : '';
    return `${prefix}₹${Math.abs(value).toLocaleString('en-IN')}`;
  };
  
  // Format percent
  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };
  
  // Close on background click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <div className="day-details-popup" onClick={handleBackdropClick}>
      <div className="day-details-popup-content">
        <div className="day-details-popup-header">
          <h3>{format(date, 'EEEE, MMMM d, yyyy')}</h3>
          <button className="day-details-popup-close" onClick={onClose}>×</button>
        </div>
        
        <div className="day-details-summary">
          <div className="day-details-stat">
            <div className="stat-label">Net P&L</div>
            <div className={`stat-value ${isPositive ? 'positive' : 'negative'}`}>
              {formatCurrency(data.netPnl)}
            </div>
          </div>
          
          <div className="day-details-stat">
            <div className="stat-label">Trades</div>
            <div className="stat-value">{data.tradeCount}</div>
          </div>
          
          <div className="day-details-stat">
            <div className="stat-label">Win Rate</div>
            <div className="stat-value">{formatPercent(data.winRate)}</div>
          </div>
          
          <div className="day-details-stat">
            <div className="stat-label">Profit Factor</div>
            <div className="stat-value">{data.profitFactor.toFixed(2)}</div>
          </div>
        </div>
        
        <div className="day-details-section">
          <h4>Trade Results</h4>
          <div className="day-details-results">
            <div className="result-item">
              <div className="result-label">Wins</div>
              <div className="result-value positive">{data.wins}</div>
            </div>
            <div className="result-item">
              <div className="result-label">Losses</div>
              <div className="result-value negative">{data.losses}</div>
            </div>
          </div>
        </div>
        
        <div className="day-details-section">
          <h4>Instruments</h4>
          <div className="day-details-instruments">
            {data.instruments.map((instrument, index) => (
              <div key={index} className="instrument-item">
                <div className="instrument-name">{instrument.name}</div>
                <div className="instrument-trades">{instrument.trades} trades</div>
                <div className={`instrument-pnl ${instrument.pnl >= 0 ? 'positive' : 'negative'}`}>
                  {formatCurrency(instrument.pnl)}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="day-details-section">
          <h4>Time of Day</h4>
          <div className="day-details-time">
            <div className="time-item">
              <div className="time-label">Morning</div>
              <div className="time-trades">{data.timeOfDay.morning.trades} trades</div>
              <div className={`time-pnl ${data.timeOfDay.morning.pnl >= 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(data.timeOfDay.morning.pnl)}
              </div>
            </div>
            <div className="time-item">
              <div className="time-label">Afternoon</div>
              <div className="time-trades">{data.timeOfDay.afternoon.trades} trades</div>
              <div className={`time-pnl ${data.timeOfDay.afternoon.pnl >= 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(data.timeOfDay.afternoon.pnl)}
              </div>
            </div>
            <div className="time-item">
              <div className="time-label">Evening</div>
              <div className="time-trades">{data.timeOfDay.evening.trades} trades</div>
              <div className={`time-pnl ${data.timeOfDay.evening.pnl >= 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(data.timeOfDay.evening.pnl)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 