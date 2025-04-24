import { Trade, DailyMetrics } from '../types/journaling';
import { format } from 'date-fns';

/**
 * Calculate daily metrics from trade data
 * @param trades Array of trades for the selected date
 * @param date Selected date
 * @returns DailyMetrics object with calculated metrics
 */
export const calculateDailyMetrics = (trades: Trade[], date: Date): DailyMetrics => {
  if (!trades.length) {
    // Return empty metrics if no trades
    return createEmptyMetrics(date);
  }

  // Sort trades by close date
  const sortedTrades = [...trades].sort((a, b) => a.closeDate.getTime() - b.closeDate.getTime());
  
  // Generate timestamps for each hour of the trading day
  const timestamps: string[] = [];
  const netCumulativePL: number[] = [];
  let runningPL = 0;
  
  // Create data points for each hour of the trading day (9 AM to 4 PM)
  for (let hour = 9; hour <= 16; hour++) {
    const timePoint = new Date(date);
    timePoint.setHours(hour, 0, 0, 0);
    timestamps.push(format(timePoint, 'HH:mm'));
    
    // Only add P&L for trades that completed by this time
    const tradesCompletedByThisTime = sortedTrades.filter(
      trade => trade.closeDate.getHours() <= hour
    );
    
    runningPL = tradesCompletedByThisTime.reduce(
      (sum, trade) => sum + trade.netPL, 
      0
    );
    
    netCumulativePL.push(parseFloat(runningPL.toFixed(2)));
  }
  
  // Separate winning and losing trades
  const winningTrades = sortedTrades.filter(trade => trade.status === 'Win');
  const losingTrades = sortedTrades.filter(trade => trade.status === 'Loss');
  
  // Calculate average win and loss
  const winningTradeValues = winningTrades.map(trade => trade.netPL);
  const losingTradeValues = losingTrades.map(trade => Math.abs(trade.netPL)); // Use absolute value for losses
  
  const averageWin = winningTradeValues.length ? 
    parseFloat((winningTradeValues.reduce((sum, val) => sum + val, 0) / winningTradeValues.length).toFixed(2)) : 
    0;
  
  const averageLoss = losingTradeValues.length ? 
    parseFloat((losingTradeValues.reduce((sum, val) => sum + val, 0) / losingTradeValues.length).toFixed(2)) : 
    0;
  
  // Calculate profit factor (gross profits / gross losses)
  const totalWins = winningTradeValues.reduce((sum, val) => sum + val, 0);
  const totalLosses = losingTradeValues.reduce((sum, val) => sum + val, 0);
  
  let profitFactor;
  if (totalLosses === 0) {
    profitFactor = totalWins > 0 ? 3 : 0; // Cap at 3 for better visualization
  } else {
    profitFactor = parseFloat((totalWins / totalLosses).toFixed(2));
  }
  
  // Calculate win percentage
  const winPercentage = sortedTrades.length > 0 ? 
    parseFloat(((winningTrades.length / sortedTrades.length) * 100).toFixed(1)) :
    0;
  
  return {
    date,
    netCumulativePL,
    timestamps,
    profitFactor,
    winPercentage,
    averageWin,
    averageLoss, 
    totalTrades: sortedTrades.length,
    winningTrades: winningTrades.length,
    losingTrades: losingTrades.length,
  };
};

/**
 * Create empty metrics object when no trades are available
 */
const createEmptyMetrics = (date: Date): DailyMetrics => {
  const timestamps = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
  const netCumulativePL = Array(timestamps.length).fill(0);
  
  return {
    date,
    netCumulativePL,
    timestamps,
    profitFactor: 0,
    winPercentage: 0,
    averageWin: 0,
    averageLoss: 0,
    totalTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
  };
}; 