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
  takeProfitLevel?: number; // Planned take profit level
  actualStopLoss?: number; // Actual stop-loss if different from planned
  positionSize: number; // Maximum position size held
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
  // Advanced metrics
  mfe?: number; // Maximum Favorable Excursion
  mae?: number; // Maximum Adverse Excursion
  efficiencyRatio?: number; // Actual profit vs maximum potential
  riskRewardRatio?: number; // Planned risk-reward ratio
  accountRiskPercentage?: number; // Percentage of account risked
  
  // Market context
  marketSentiment?: string; // Overall market sentiment
  relevantNews?: string[]; // Relevant news events
  sectorPerformance?: string; // Sector/industry performance
  
  // Psychological factors
  emotionalState?: string; // Emotional state during trade
  confidenceLevel?: number; // Confidence level (1-5)
  psychologicalChallenges?: string; // Notes on psychological challenges
  
  // Journaling
  tradePlan?: string; // Pre-trade plan
  postTradeReflection?: string; // Post-trade reflection
  mistakesIdentified?: string[]; // Identified mistakes
  tags?: string[]; // Tags for categorization
  
  // Improvement plan
  futureAdjustments?: string; // Specific adjustments for similar setups
  skillsToImprove?: string[]; // Skills to develop
  followUpTasks?: string[]; // Follow-up tasks
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