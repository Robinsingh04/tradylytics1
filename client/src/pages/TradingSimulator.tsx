import React from 'react';

export const TradingSimulator = () => {
  return (
    <div className="page-container">
      <h1>Trading Simulator</h1>
      <p>Practice trading in a risk-free environment to improve your skills.</p>

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