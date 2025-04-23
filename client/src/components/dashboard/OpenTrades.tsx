import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Trade } from "@shared/schema";
import { format } from "date-fns";

interface OpenTradesProps {
  trades?: Trade[];
}

// Generate mock data for open trades
const generateMockTrades = (): Trade[] => {
  const trades = [
    {
      id: 1,
      symbol: 'TCS',
      direction: 'SELL',
      entryPrice: 1523,
      currentPrice: 1547.55,
      quantity: 11,
      entryDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
      pnl: -270.06,
      pnlPercent: -1.61
    },
    {
      id: 2,
      symbol: 'RELIANCE',
      direction: 'BUY',
      entryPrice: 842,
      currentPrice: 880.78,
      quantity: 38,
      entryDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
      pnl: 1473.82,
      pnlPercent: 4.61
    },
    {
      id: 3,
      symbol: 'RELIANCE',
      direction: 'SELL',
      entryPrice: 622,
      currentPrice: 616.89,
      quantity: 51,
      entryDate: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
      pnl: 260.73,
      pnlPercent: 0.82
    },
    {
      id: 4,
      symbol: 'ICICIBANK',
      direction: 'SELL',
      entryPrice: 1713,
      currentPrice: 1607.66,
      quantity: 40,
      entryDate: new Date(new Date().setDate(new Date().getDate() - 8)).toISOString(),
      pnl: 4213.46,
      pnlPercent: 6.15
    },
    {
      id: 5,
      symbol: 'TCS',
      direction: 'SELL',
      entryPrice: 1544,
      currentPrice: 1569.46,
      quantity: 14,
      entryDate: new Date(new Date().setDate(new Date().getDate() - 8)).toISOString(),
      pnl: -356.44,
      pnlPercent: -1.65
    }
  ];
  
  return trades;
};

export const OpenTrades: React.FC<OpenTradesProps> = ({ trades: propTrades }) => {
  const [trades] = useState<Trade[]>(propTrades || generateMockTrades());
  
  const formatCurrency = (value: number) => {
    return `₹${Math.abs(value).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'd MMM, h:mm aaa');
  };
  
  return (
    <Card className="h-full bg-neutral-800 border-neutral-700">
      <CardContent className="p-2 sm:p-3">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h2 className="text-xs sm:text-sm font-medium">Open Trades</h2>
          <span className="text-[10px] sm:text-xs text-neutral-400">
            {trades.length} positions
          </span>
        </div>
        
        <div className="space-y-2 sm:space-y-3 max-h-[300px] sm:max-h-[350px] overflow-y-auto pr-1">
          {trades.length === 0 ? (
            <div className="text-center py-2 sm:py-3 text-neutral-400 text-[10px] sm:text-xs">
              <p>No open trades at the moment</p>
            </div>
          ) : (
            trades.map(trade => {
              const isProfit = trade.pnl > 0;
              
              return (
                <div 
                  key={trade.id} 
                  className={`trade-row border rounded-lg p-2.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 ${
                    isProfit 
                      ? 'bg-green-900/10 border-green-800/30' 
                      : 'bg-red-900/10 border-red-800/30'
                  }`}
                >
                  <div className="trade-details flex flex-col w-full sm:w-auto">
                    <div className="symbol-direction flex items-center gap-1.5 mb-1">
                      <span className="symbol font-medium">{trade.symbol}</span>
                      <span className={`direction text-[10px] py-0.5 px-1.5 rounded-sm ${
                        trade.direction === 'BUY' 
                          ? 'bg-green-900/30 text-green-400' 
                          : 'bg-red-900/30 text-red-400'
                      }`}>
                        {trade.direction}
                      </span>
                    </div>
                    
                    <div className="quantity-date flex items-center gap-2 text-[10px] text-neutral-400 mb-1">
                      <span className="quantity">{trade.quantity} shares</span>
                      <span className="date">{formatDate(trade.entryDate)}</span>
                    </div>
                    
                    <div className="prices flex items-center text-[10px] text-neutral-300">
                      <span className="price">Entry: {formatCurrency(trade.entryPrice)}</span>
                      <span className="separator mx-1">|</span>
                      <span className="price">Current: {formatCurrency(trade.currentPrice)}</span>
                    </div>
                  </div>
                  
                  <div className="trade-pnl-actions flex flex-col sm:items-end w-full sm:w-auto">
                    <div className={`pnl text-xs font-medium mb-1.5 ${
                      isProfit ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {isProfit ? '+' : '-'}{formatCurrency(Math.abs(trade.pnl))}
                      <span className="percent ml-1 text-[10px]">
                        ({isProfit ? '+' : '-'}{Math.abs(trade.pnlPercent).toFixed(2)}%)
                      </span>
                    </div>
                    
                    <div className="actions flex gap-1.5">
                      <button className="edit-btn text-[10px] py-1 px-2 rounded bg-blue-900/20 text-blue-400 hover:bg-blue-900/30">Edit</button>
                      <button className="close-btn text-[10px] py-1 px-2 rounded bg-red-900/20 text-red-400 hover:bg-red-900/30">Close</button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};
