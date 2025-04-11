import React from 'react';

export const TradeHistory = () => {
  return (
    <div className="page-container">
      <h1>Trade History</h1>
      <p>View and analyze all your past trading activities.</p>

      <style jsx>{`
        .page-container {
          padding: 20px;
          color: #FFFFFF;
        }
        h1 {
          margin-bottom: 20px;
          font-size: 24px;
          font-weight: 600;
        }
        p {
          color: #AAAAAA;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}; 