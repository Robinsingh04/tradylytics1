import React from 'react';

interface ChartCardProps {
  title: string;
  timeframe: string;
  children: React.ReactNode;
}

export const ChartCard = ({ title, timeframe, children }: ChartCardProps) => {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <span className="chart-title">{title}</span>
        <div className="timeframe-container">
          <span className="timeframe-button active">{timeframe}</span>
        </div>
      </div>
      <div className="chart-container">
        {children}
      </div>
      
      <style jsx>{`
        .chart-card {
          background-color: #1E1E1E;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
          height: 40vh;
          min-height: 300px;
          max-width: 100%;
          overflow: hidden;
        }
        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 8px;
        }
        .chart-title {
          color: #FFFFFF;
          font-size: 16px;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 70%;
        }
        .timeframe-container {
          display: flex;
          background-color: #2A2A2A;
          border-radius: 4px;
          padding: 2px;
          flex-shrink: 0;
        }
        .timeframe-button {
          color: #FFFFFF;
          font-size: 12px;
          padding: 4px 8px;
          white-space: nowrap;
        }
        .timeframe-button.active {
          background-color: #3A3A3A;
          border-radius: 4px;
        }
        .chart-container {
          height: calc(100% - 48px);
          width: 100%;
          position: relative;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .chart-card {
            height: 35vh;
          }
        }

        @media (max-width: 480px) {
          .chart-card {
            height: 30vh;
          }
          .chart-title {
            max-width: 60%;
          }
        }
      `}</style>
    </div>
  );
}; 