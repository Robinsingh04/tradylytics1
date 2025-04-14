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
  
  for (let i = 0; i < numTrades; i++) {
    const isWin = Math.random() > 0.4; // 60% win rate
    const direction = Math.random() > 0.5 ? 'Long' : 'Short';
    const openTime = addMinutes(addHours(date, 9 + Math.floor(Math.random() * 6)), Math.floor(Math.random() * 60));
    const durationMinutes = 15 + Math.floor(Math.random() * 120); // 15-135 minutes
    const closeTime = addMinutes(openTime, durationMinutes);
    const symbol = ['AAPL', 'MSFT', 'AMZN', 'TSLA', 'GOOGL', 'META', 'NFLX', 'SPY', 'QQQ'][Math.floor(Math.random() * 9)];
    const entryPrice = parseFloat((50 + Math.random() * 200).toFixed(2));
    
    // Calculate exit price based on win/loss status and direction
    let percentChange;
    if (direction === 'Long') {
      percentChange = isWin ? 
        (0.5 + Math.random() * 2.5) / 100 : // 0.5% to 3% gain for long win
        (-2.5 - Math.random() * 1.5) / 100; // -2.5% to -4% loss for long loss
    } else {
      percentChange = isWin ? 
        (-0.5 - Math.random() * 2.5) / 100 : // -0.5% to -3% for short win (price went down)
        (2.5 + Math.random() * 1.5) / 100;  // 2.5% to 4% for short loss (price went up)
    }
    
    const exitPrice = parseFloat((entryPrice * (1 + percentChange)).toFixed(2));
    
    // Calculate stop loss price (between entry and exit for losses, beyond exit for wins)
    let stopLoss = null;
    if (Math.random() > 0.2) { // 80% of trades have stop loss
      if (direction === 'Long') {
        stopLoss = isWin ? 
          entryPrice - (entryPrice * (0.5 + Math.random()) / 100) : // 0.5-1.5% below entry for wins
          exitPrice - (entryPrice * (0.2 + Math.random() * 0.3) / 100); // Slightly below exit for losses
      } else {
        stopLoss = isWin ?
          entryPrice + (entryPrice * (0.5 + Math.random()) / 100) : // 0.5-1.5% above entry for wins
          exitPrice + (entryPrice * (0.2 + Math.random() * 0.3) / 100); // Slightly above exit for losses
      }
      stopLoss = parseFloat(stopLoss.toFixed(2));
    }
    
    // Calculate NetPL based on direction
    let netPL;
    if (direction === 'Long') {
      netPL = parseFloat(((exitPrice - entryPrice) * 100).toFixed(2));
    } else {
      netPL = parseFloat(((entryPrice - exitPrice) * 100).toFixed(2));
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
    .map(trade => trade.netPL);
  
  const averageWin = winningTradeValues.length ? 
    parseFloat((winningTradeValues.reduce((sum, val) => sum + val, 0) / winningTradeValues.length).toFixed(2)) : 
    0;
  
  const averageLoss = losingTradeValues.length ? 
    parseFloat((losingTradeValues.reduce((sum, val) => sum + val, 0) / losingTradeValues.length).toFixed(2)) : 
    0;
  
  // Calculate profit factor (absolute value of wins / losses)
  const totalWins = winningTradeValues.reduce((sum, val) => sum + val, 0);
  const totalLosses = Math.abs(losingTradeValues.reduce((sum, val) => sum + val, 0));
  const profitFactor = totalLosses === 0 ? 
    totalWins > 0 ? 100 : 0 : // If no losses but some wins, set to maximum
    parseFloat((totalWins / totalLosses).toFixed(2));
  
  return {
    date,
    netCumulativePL,
    timestamps,
    profitFactor,
    winPercentage: parseFloat(((winningTrades / (winningTrades + losingTrades)) * 100).toFixed(1)),
    averageWin,
    averageLoss: Math.abs(averageLoss), // Use absolute value for easier comparison
    totalTrades: mockTrades.length,
    winningTrades,
    losingTrades,
  };
}; 