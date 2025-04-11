import React, { useEffect } from 'react';
import { format } from 'date-fns';
import ReactDOM from 'react-dom';

interface DayDetailsProps {
  date: Date;
  isOpen: boolean;
  onClose: () => void;
  data: {
    netPnl: number;
    tradeCount: number;
    winRate: number;
    profitFactor: number;
    wins: number;
    losses: number;
    instruments: {
      name: string;
      trades: number;
      pnl: number;
    }[];
    timeOfDay: {
      morning: { trades: number; pnl: number };
      afternoon: { trades: number; pnl: number };
      evening: { trades: number; pnl: number };
    };
  };
}

export const DayDetailsPopup: React.FC<DayDetailsProps> = ({ date, isOpen, onClose, data }) => {
  if (!isOpen) return null;
  
  const formatCurrency = (value: number) => {
    return `${value > 0 ? '+' : ''}₹${Math.abs(value)}`;
  };

  const getFormattedDate = (date: Date) => {
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  // Calculate win/loss percentages
  const totalTrades = data.wins + data.losses;
  const winPercentage = totalTrades > 0 ? (data.wins / totalTrades) * 100 : 0;
  const lossPercentage = totalTrades > 0 ? (data.losses / totalTrades) * 100 : 0;

  // Use a portal to render the popup directly in the document body
  const popupContent = (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99999
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: '#121212',
          color: 'white',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          border: '1px solid #333',
          borderRadius: '16px'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px'
          }}
          onClick={onClose}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ padding: '24px 24px 0 24px' }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold',
            marginBottom: '24px'
          }}>{getFormattedDate(date)}</h2>
        </div>

        {/* Main stats grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          padding: '0 24px 24px 24px'
        }}>
          <div>
            <div style={{ color: '#aaa', fontSize: '14px', marginBottom: '8px' }}>
              <span style={{ marginRight: '4px' }}>$</span>Net P&L
            </div>
            <div style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              color: data.netPnl >= 0 ? '#4CAF50' : '#F44336' 
            }}>
              {formatCurrency(data.netPnl)}
            </div>
          </div>
          <div>
            <div style={{ color: '#aaa', fontSize: '14px', marginBottom: '8px' }}>
              <span style={{ marginRight: '4px' }}>↗</span>Trades
            </div>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
              {data.tradeCount}
            </div>
          </div>
          <div>
            <div style={{ color: '#aaa', fontSize: '14px', marginBottom: '8px' }}>
              <span style={{ marginRight: '4px' }}>%</span>Win Rate
            </div>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
              {data.winRate.toFixed(1)}%
            </div>
          </div>
          <div>
            <div style={{ color: '#aaa', fontSize: '14px', marginBottom: '8px' }}>
              <span style={{ marginRight: '4px' }}>↕</span>Profit Factor
            </div>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
              {data.profitFactor.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Win/Loss Distribution with bar chart */}
        <div style={{ padding: '0 24px 24px 24px' }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            marginBottom: '16px',
            color: '#eee' 
          }}>Win/Loss Distribution</h3>
          
          {/* Bar chart container */}
          <div style={{ marginBottom: '16px', position: 'relative' }}>
            <div style={{ 
              height: '12px', 
              backgroundColor: '#4CAF50', 
              width: `${winPercentage}%`,
              borderRadius: '6px',
              position: 'relative'
            }} />
          </div>
          
          {/* Win/Loss labels */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ 
                display: 'inline-block', 
                width: '8px', 
                height: '8px', 
                backgroundColor: '#4CAF50', 
                borderRadius: '50%',
                marginRight: '8px'
              }} />
              <span>Win: {data.wins} ({winPercentage.toFixed(1)}%)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span>Loss: {data.losses} ({lossPercentage.toFixed(1)}%)</span>
              <span style={{ 
                display: 'inline-block', 
                width: '8px', 
                height: '8px', 
                backgroundColor: '#F44336', 
                borderRadius: '50%',
                marginLeft: '8px'
              }} />
            </div>
          </div>
        </div>

        {/* Instrument Performance */}
        <div style={{ padding: '0 24px 24px 24px' }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            marginBottom: '16px',
            color: '#eee' 
          }}>Instrument Performance</h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px'
          }}>
            {data.instruments.map((instrument, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                backgroundColor: '#1A1A1A',
                borderRadius: '6px'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>{instrument.name}</div>
                  <div style={{ color: '#aaa', fontSize: '14px' }}>{instrument.trades} trades</div>
                </div>
                <div style={{ 
                  fontWeight: 'bold', 
                  color: instrument.pnl >= 0 ? '#4CAF50' : '#F44336',
                  fontSize: '18px'
                }}>
                  {formatCurrency(instrument.pnl)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance by Time of Day */}
        <div style={{ padding: '0 24px 24px 24px' }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: 'bold', 
            marginBottom: '16px',
            color: '#eee' 
          }}>Performance by Time of Day</h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px'
          }}>
            <div style={{ 
              padding: '16px',
              backgroundColor: '#1A1A1A',
              borderRadius: '6px'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Morning</div>
              <div style={{ 
                fontWeight: 'bold', 
                color: data.timeOfDay.morning.pnl >= 0 ? '#4CAF50' : '#F44336', 
                marginBottom: '4px',
                fontSize: '18px'
              }}>
                {formatCurrency(data.timeOfDay.morning.pnl)}
              </div>
              <div style={{ color: '#aaa', fontSize: '14px' }}>{data.timeOfDay.morning.trades} trades</div>
            </div>
            
            <div style={{ 
              padding: '16px',
              backgroundColor: '#1A1A1A',
              borderRadius: '6px'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Afternoon</div>
              <div style={{ 
                fontWeight: 'bold', 
                color: data.timeOfDay.afternoon.pnl >= 0 ? '#4CAF50' : '#F44336', 
                marginBottom: '4px',
                fontSize: '18px'
              }}>
                {formatCurrency(data.timeOfDay.afternoon.pnl)}
              </div>
              <div style={{ color: '#aaa', fontSize: '14px' }}>{data.timeOfDay.afternoon.trades} trades</div>
            </div>
            
            <div style={{ 
              padding: '16px',
              backgroundColor: '#1A1A1A',
              borderRadius: '6px'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Evening</div>
              <div style={{ 
                fontWeight: 'bold', 
                color: data.timeOfDay.evening.pnl >= 0 ? '#4CAF50' : '#F44336', 
                marginBottom: '4px',
                fontSize: '18px'
              }}>
                {formatCurrency(data.timeOfDay.evening.pnl)}
              </div>
              <div style={{ color: '#aaa', fontSize: '14px' }}>{data.timeOfDay.evening.trades} trades</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render the popup in the document body
  return ReactDOM.createPortal(
    popupContent,
    document.body
  );
}; 