// Trade types
export interface Trade {
  id: string;
  openDate: Date;
  symbol: string;
  direction: 'Long' | 'Short';
  instrument: string;
  status: 'Win' | 'Loss';
  closeDate: Date;
  entryPrice: number;
  exitPrice: number;
  stopLoss?: number; // Optional stop-loss for R-multiple calculation
  netPL: number;
  netROI: number;
  setupType: string;
  executionRating: number; // 1-5 scale
  keyCatalyst: string;
  insights: string;
  setups: string[];
  scale: number; // 1-10 scale
  duration: string;
  bestId: string; // Best trading insight ID
}

// Daily metrics types
export interface DailyMetrics {
  date: Date;
  netCumulativePL: number[];
  timestamps: string[];
  profitFactor: number;
  winPercentage: number;
  averageWin: number;
  averageLoss: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
} 