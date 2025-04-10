import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trade } from "@shared/schema";
import { format } from "date-fns";

interface OpenTradesProps {
  trades: Trade[];
  onEditTrade: (tradeId: number) => void;
  onCloseTrade: (tradeId: number) => void;
}

export function OpenTrades({ 
  trades, 
  onEditTrade, 
  onCloseTrade 
}: OpenTradesProps) {
  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-medium">Open Trades</h2>
          <span className="text-xs bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded">
            {trades.length} position{trades.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {trades.map(trade => {
            const isProfit = parseFloat(trade.pnl?.toString() || '0') > 0;
            const pnlValue = parseFloat(trade.pnl?.toString() || '0');
            const pnlPercentValue = parseFloat(trade.pnlPercent?.toString() || '0');
            
            return (
              <div 
                key={trade.id}
                className={`border-l-4 ${
                  isProfit 
                    ? 'border-positive-light dark:border-positive-dark' 
                    : 'border-negative-light dark:border-negative-dark'
                } bg-neutral-50 dark:bg-neutral-700/20 p-3 rounded-r`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium text-sm">{trade.symbol}</span>
                      <span className={`ml-2 px-1.5 py-0.5 ${
                        trade.direction.toLowerCase() === 'long'
                          ? 'bg-positive-light/10 dark:bg-positive-dark/20 text-positive-light dark:text-positive-dark'
                          : 'bg-negative-light/10 dark:bg-negative-dark/20 text-negative-light dark:text-negative-dark'
                      } rounded text-xs`}>
                        {trade.direction}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      Opened {format(new Date(trade.entryDate), 'MMM d, h:mm a')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      isProfit
                        ? 'text-positive-light dark:text-positive-dark'
                        : 'text-negative-light dark:text-negative-dark'
                    }`}>
                      {isProfit ? '+' : ''}{pnlValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} ({isProfit ? '+' : ''}{pnlPercentValue.toFixed(2)}%)
                    </div>
                    <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      <span>Entry: {parseFloat(trade.entryPrice.toString()).toFixed(4)}</span>
                      <span className="mx-1">|</span>
                      <span>Current: {parseFloat(trade.currentPrice?.toString() || '0').toFixed(4)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between mt-2">
                  <div className="flex space-x-2">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="text-xs h-7"
                      onClick={() => onEditTrade(trade.id)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => onCloseTrade(trade.id)}
                    >
                      Close
                    </Button>
                  </div>
                  <div className="flex items-center">
                    <span className={`w-1.5 h-1.5 ${
                      isProfit
                        ? 'bg-positive-light dark:bg-positive-dark'
                        : 'bg-negative-light dark:bg-negative-dark'
                    } rounded-full`}></span>
                    <span className="text-xs ml-1 text-neutral-500 dark:text-neutral-400">
                      In {isProfit ? 'profit' : 'loss'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          
          {trades.length === 0 && (
            <div className="text-center py-6 text-neutral-400">
              <p>No open trades at the moment</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
