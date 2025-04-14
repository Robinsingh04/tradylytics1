import { Trade, DailyMetrics } from '../types/journaling';
import { format, addHours, subHours, addMinutes } from 'date-fns';

// Generate mock trade data for a given date
export const generateMockTradeData = (date: Date): Trade[] => {
  const numTrades = Math.floor(Math.random() * 5) + 3; // 3-7 trades
  const trades: Trade[] = [];
  
  const instruments = ['Stock', 'Option', 'Future', 'Forex', 'Crypto'];
  const setups = ['Breakout', 'Pullback', 'Support/Resistance', 'Gap Fill', 'Trend Continuation', 'Reversal', 'News Play'];
  const setupTypes = ['Momentum', 'Reversal', 'Breakout', 'Pullback', 'Support/Resistance', 'Trend Continuation'];
  const catalysts = ['Earnings', 'Economic Data', 'Technical Pattern', 'News', 'Sector Move', 'Market Momentum', 'Volume Spike'];
  
  // Target win rate (you can adjust this to match the image - about 28.6%)
  const targetWinRate = 0.286; // ~28.6% win rate
  
  for (let i = 0; i < numTrades; i++) {
    // More realistic win/loss distribution
    const isWin = Math.random() < targetWinRate;
    const direction = Math.random() > 0.5 ? 'Long' : 'Short';
    
    // Trading hours
    const openTime = addMinutes(addHours(new Date(date.setHours(0, 0, 0, 0)), 9 + Math.floor(Math.random() * 6)), Math.floor(Math.random() * 60));
    const durationMinutes = 15 + Math.floor(Math.random() * 120); // 15-135 minutes
    const closeTime = addMinutes(openTime, durationMinutes);
    
    const symbol = ['AAPL', 'MSFT', 'AMZN', 'TSLA', 'GOOGL', 'META', 'NFLX', 'SPY', 'QQQ'][Math.floor(Math.random() * 9)];
    const entryPrice = parseFloat((50 + Math.random() * 200).toFixed(2));
    
    // Calculate exit price based on win/loss status and direction
    // Ensure average win ($160) is smaller than average loss ($388.20) - about 0.41:1 ratio
    let netPL;
    if (isWin) {
      netPL = 120 + Math.random() * 80; // $120-$200 for winning trades
    } else {
      netPL = -(280 + Math.random() * 220); // -$280 to -$500 for losing trades 
    }
    netPL = parseFloat(netPL.toFixed(2));
    
    // Calculate exit price based on P&L
    let exitPrice;
    if (direction === 'Long') {
      exitPrice = parseFloat((entryPrice + (netPL / 100)).toFixed(2));
    } else {
      exitPrice = parseFloat((entryPrice - (netPL / 100)).toFixed(2));
    }
    
    // Calculate stop loss price
    let stopLoss = null;
    if (Math.random() > 0.2) { // 80% of trades have stop loss
      if (direction === 'Long') {
        stopLoss = entryPrice - (entryPrice * (0.5 + Math.random()) / 100);
      } else {
        stopLoss = entryPrice + (entryPrice * (0.5 + Math.random()) / 100);
      }
      stopLoss = parseFloat(stopLoss.toFixed(2));
    }
    
    // NetROI calculation (as a percentage)
    const netROI = direction === 'Long' ? 
      parseFloat(((exitPrice - entryPrice) / entryPrice * 100).toFixed(2)) :
      parseFloat(((entryPrice - exitPrice) / entryPrice * 100).toFixed(2));
    
    // Random setups (1-3)
    const numSetups = 1 + Math.floor(Math.random() * 3);
    const tradeSetups: string[] = [];
    for (let j = 0; j < numSetups; j++) {
      const setup = setups[Math.floor(Math.random() * setups.length)];
      if (!tradeSetups.includes(setup)) {
        tradeSetups.push(setup);
      }
    }
    
    // Setup type and catalyst
    const setupType = setupTypes[Math.floor(Math.random() * setupTypes.length)];
    const keyCatalyst = catalysts[Math.floor(Math.random() * catalysts.length)];
    
    // Execution rating (1-5)
    const executionRating = isWin ? 
      3 + Math.floor(Math.random() * 3) : // 3-5 for wins
      1 + Math.floor(Math.random() * 3);  // 1-3 for losses
    
    trades.push({
      id: `T-${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}-${i + 1}`,
      openDate: openTime,
      symbol,
      direction,
      instrument: instruments[Math.floor(Math.random() * instruments.length)],
      status: isWin ? 'Win' : 'Loss',
      closeDate: closeTime,
      entryPrice,
      exitPrice,
      stopLoss,
      netPL,
      netROI,
      setupType,
      executionRating,
      keyCatalyst,
      insights: isWin ? 
        'Followed the trading plan and managed risk well.' : 
        'Entered too early, should have waited for confirmation.',
      setups: tradeSetups,
      scale: Math.floor(Math.random() * 10) + 1, // 1-10
      duration: `${durationMinutes}m`,
      bestId: `ID-${Math.floor(Math.random() * 1000)}`,
    });
  }
  
  // Sort by open date
  return trades.sort((a, b) => a.openDate.getTime() - b.openDate.getTime());
};

// Generate mock metrics data for a given date
export const generateMockMetricsData = (date: Date): DailyMetrics => {
  // Create consistent mock data to match the screenshot
  const timestamps = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
  
  // Decreasing P&L curve (starts at -4.76, ends around -12.0)
  const netCumulativePL = [-4.76, -4.76, -6.0, -8.0, -10.0, -11.0, -11.5, -12.0];
  
  // Fixed values to match the screenshot
  const profitFactor = 4.8;
  const winPercentage = 33.3;
  const winningTrades = 2;
  const losingTrades = 4;
  const averageWin = 138.94;
  const averageLoss = 427.38;
  
  return {
    date,
    netCumulativePL,
    timestamps,
    profitFactor,
    winPercentage,
    averageWin,
    averageLoss,
    totalTrades: winningTrades + losingTrades,
    winningTrades,
    losingTrades,
  };
};

// Original dynamic mock data generation - keeping for reference
export const generateDynamicMockMetricsData = (date: Date): DailyMetrics => {
  const mockTrades = generateMockTradeData(date);
  const winningTrades = mockTrades.filter(trade => trade.status === 'Win').length;
  const losingTrades = mockTrades.filter(trade => trade.status === 'Loss').length;
  
  // Generate cumulative P&L over time
  const timestamps: string[] = [];
  const netCumulativePL: number[] = [];
  let runningPL = 0;
  
  // Create data points for each hour of the trading day
  for (let hour = 9; hour <= 16; hour++) {
    const timePoint = addHours(new Date(date.setHours(0, 0, 0, 0)), hour);
    timestamps.push(format(timePoint, 'HH:mm'));
    
    // Only add P&L for trades that completed by this time
    const tradesCompletedByThisTime = mockTrades.filter(
      trade => trade.closeDate.getHours() <= hour
    );
    
    runningPL = tradesCompletedByThisTime.reduce(
      (sum, trade) => sum + trade.netPL, 
      0
    );
    
    netCumulativePL.push(parseFloat(runningPL.toFixed(2)));
  }
  
  // Calculate average win and loss
  const winningTradeValues = mockTrades
    .filter(trade => trade.status === 'Win')
    .map(trade => trade.netPL);
  
  const losingTradeValues = mockTrades
    .filter(trade => trade.status === 'Loss')
    .map(trade => Math.abs(trade.netPL)); // Ensure losses are positive values
  
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
  
  // Calculate win percentage properly
  const winPercentage = (winningTrades + losingTrades) > 0 ? 
    parseFloat(((winningTrades / (winningTrades + losingTrades)) * 100).toFixed(1)) :
    0;
  
  return {
    date,
    netCumulativePL,
    timestamps,
    profitFactor,
    winPercentage,
    averageWin,
    averageLoss, 
    totalTrades: mockTrades.length,
    winningTrades,
    losingTrades,
  };
}; 