import React from 'react';

export const JournalingCalendar = () => {
  return (
    <div className="page-container">
      <h1>Journaling Calendar</h1>
      <p>Track your trading activities and insights on a daily basis.</p>

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