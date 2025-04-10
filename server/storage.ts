import { 
  users, type User, type InsertUser,
  trades, type Trade, type InsertTrade,
  dailyPerformance, type DailyPerformance, type InsertDailyPerformance,
  metrics, type Metrics, type InsertMetrics,
  equityHistory, type EquityHistory, type InsertEquityHistory,
  drawdownHistory, type DrawdownHistory, type InsertDrawdownHistory
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Trading journal operations
  getOpenTrades(userId: number): Promise<Trade[]>;
  updateTrade(tradeId: number, tradeData: Partial<Trade>): Promise<Trade>;
  closeTrade(tradeId: number, closeData: { exitPrice: number, exitDate: Date }): Promise<Trade>;
  getMetrics(userId: number): Promise<Metrics>;
  getEquityHistory(userId: number): Promise<EquityHistory[]>;
  getDrawdownHistory(userId: number): Promise<DrawdownHistory[]>;
  getDailyPerformance(userId: number): Promise<DailyPerformance[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private trades: Map<number, Trade>;
  private dailyPerformance: Map<number, DailyPerformance>;
  private userMetrics: Map<number, Metrics>;
  private userEquityHistory: Map<number, EquityHistory[]>;
  private userDrawdownHistory: Map<number, DrawdownHistory[]>;
  currentId: number;
  tradeId: number;
  performanceId: number;
  metricsId: number;
  equityHistoryId: number;
  drawdownHistoryId: number;

  constructor() {
    this.users = new Map();
    this.trades = new Map();
    this.dailyPerformance = new Map();
    this.userMetrics = new Map();
    this.userEquityHistory = new Map();
    this.userDrawdownHistory = new Map();
    this.currentId = 1;
    this.tradeId = 1;
    this.performanceId = 1;
    this.metricsId = 1;
    this.equityHistoryId = 1;
    this.drawdownHistoryId = 1;
    
    // Initialize with demo data
    this.initializeDemoData();
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getOpenTrades(userId: number): Promise<Trade[]> {
    return Array.from(this.trades.values())
      .filter(trade => trade.userId === userId && trade.status === 'open');
  }

  async updateTrade(tradeId: number, tradeData: Partial<Trade>): Promise<Trade> {
    const trade = this.trades.get(tradeId);
    if (!trade) {
      throw new Error('Trade not found');
    }
    const updatedTrade = { ...trade, ...tradeData };
    this.trades.set(tradeId, updatedTrade);
    return updatedTrade;
  }

  async closeTrade(tradeId: number, closeData: { exitPrice: number, exitDate: Date }): Promise<Trade> {
    const trade = this.trades.get(tradeId);
    if (!trade) {
      throw new Error('Trade not found');
    }
    
    // Calculate PnL
    const entryPrice = parseFloat(trade.entryPrice.toString());
    const exitPrice = closeData.exitPrice;
    const pnl = trade.direction === 'long' 
      ? (exitPrice - entryPrice) * 100 // Simplified calculation
      : (entryPrice - exitPrice) * 100;
    
    const pnlPercent = trade.direction === 'long'
      ? ((exitPrice - entryPrice) / entryPrice) * 100
      : ((entryPrice - exitPrice) / entryPrice) * 100;
    
    const updatedTrade: Trade = {
      ...trade,
      exitDate: closeData.exitDate,
      status: 'closed',
      pnl,
      pnlPercent,
    };
    
    this.trades.set(tradeId, updatedTrade);
    return updatedTrade;
  }

  async getMetrics(userId: number): Promise<Metrics> {
    const metrics = this.userMetrics.get(userId);
    if (!metrics) {
      throw new Error('Metrics not found for user');
    }
    return metrics;
  }

  async getEquityHistory(userId: number): Promise<EquityHistory[]> {
    const history = this.userEquityHistory.get(userId);
    if (!history) {
      throw new Error('Equity history not found for user');
    }
    return history;
  }

  async getDrawdownHistory(userId: number): Promise<DrawdownHistory[]> {
    const history = this.userDrawdownHistory.get(userId);
    if (!history) {
      throw new Error('Drawdown history not found for user');
    }
    return history;
  }

  async getDailyPerformance(userId: number): Promise<DailyPerformance[]> {
    return Array.from(this.dailyPerformance.values())
      .filter(perf => perf.userId === userId);
  }

  // Demo data initialization for development
  private initializeDemoData() {
    // Add demo user
    const user: User = {
      id: 1,
      username: 'trader',
      password: 'password'
    };
    this.users.set(user.id, user);

    // Add demo metrics
    const demoMetrics: Metrics = {
      id: this.metricsId++,
      userId: 1,
      totalPnl: 12450,
      pnlChange: 4.5,
      winRate: 67.3,
      winRateChange: 2.1,
      totalTrades: 183,
      tradesChange: 12,
      avgWin: 342,
      avgWinChange: -1.2,
      avgLoss: -125,
      avgLossChange: 3.8,
      lastUpdated: new Date()
    };
    this.userMetrics.set(1, demoMetrics);

    // Add demo trades
    const demoTrades: Trade[] = [
      {
        id: this.tradeId++,
        userId: 1,
        symbol: 'EURUSD',
        direction: 'long',
        entryPrice: 1.0865,
        currentPrice: 1.0948,
        entryDate: new Date(2023, 0, 14, 9, 45),
        exitDate: null,
        pnl: 124.50,
        pnlPercent: 0.76,
        status: 'open'
      },
      {
        id: this.tradeId++,
        userId: 1,
        symbol: 'GOLD',
        direction: 'short',
        entryPrice: 2035.67,
        currentPrice: 2044.42,
        entryDate: new Date(2023, 0, 15, 11, 23),
        exitDate: null,
        pnl: -78.25,
        pnlPercent: -0.43,
        status: 'open'
      },
      {
        id: this.tradeId++,
        userId: 1,
        symbol: 'BTCUSD',
        direction: 'long',
        entryPrice: 42156.78,
        currentPrice: 42676.25,
        entryDate: new Date(2023, 0, 15, 8, 17),
        exitDate: null,
        pnl: 312.40,
        pnlPercent: 1.23,
        status: 'open'
      }
    ];

    for (const trade of demoTrades) {
      this.trades.set(trade.id, trade);
    }

    // Add equity history data (recent 30 days)
    const equityHistoryData: EquityHistory[] = [];
    let baseEquity = 10000;
    const now = new Date();
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      
      // Random fluctuation between -2% and +3%
      const change = baseEquity * (Math.random() * 0.05 - 0.02);
      baseEquity += change;
      
      equityHistoryData.push({
        id: this.equityHistoryId++,
        userId: 1,
        date,
        equity: Math.max(baseEquity, 5000) // Ensure equity doesn't go below 5000
      });
    }
    
    this.userEquityHistory.set(1, equityHistoryData);

    // Add drawdown history data (recent 30 days)
    const drawdownHistoryData: DrawdownHistory[] = [];
    let maxEquity = baseEquity;
    
    for (let i = 0; i < equityHistoryData.length; i++) {
      const equity = parseFloat(equityHistoryData[i].equity.toString());
      maxEquity = Math.max(maxEquity, equity);
      const drawdown = ((equity - maxEquity) / maxEquity) * 100;
      
      drawdownHistoryData.push({
        id: this.drawdownHistoryId++,
        userId: 1,
        date: new Date(equityHistoryData[i].date),
        drawdownPercent: drawdown
      });
    }
    
    this.userDrawdownHistory.set(1, drawdownHistoryData);

    // Add daily performance data for January 2023
    const dailyPerformanceData: DailyPerformance[] = [
      { id: this.performanceId++, userId: 1, date: new Date(2023, 0, 1), pnl: 243, tradesCount: 5, winCount: 3, lossCount: 2 },
      { id: this.performanceId++, userId: 1, date: new Date(2023, 0, 2), pnl: -125, tradesCount: 3, winCount: 1, lossCount: 2 },
      { id: this.performanceId++, userId: 1, date: new Date(2023, 0, 3), pnl: 187, tradesCount: 4, winCount: 3, lossCount: 1 },
      { id: this.performanceId++, userId: 1, date: new Date(2023, 0, 6), pnl: 321, tradesCount: 6, winCount: 4, lossCount: 2 },
      { id: this.performanceId++, userId: 1, date: new Date(2023, 0, 7), pnl: 156, tradesCount: 5, winCount: 3, lossCount: 2 },
      { id: this.performanceId++, userId: 1, date: new Date(2023, 0, 8), pnl: -92, tradesCount: 2, winCount: 0, lossCount: 2 },
      { id: this.performanceId++, userId: 1, date: new Date(2023, 0, 9), pnl: 210, tradesCount: 4, winCount: 3, lossCount: 1 },
      { id: this.performanceId++, userId: 1, date: new Date(2023, 0, 10), pnl: 175, tradesCount: 3, winCount: 2, lossCount: 1 },
      { id: this.performanceId++, userId: 1, date: new Date(2023, 0, 13), pnl: -145, tradesCount: 4, winCount: 1, lossCount: 3 },
      { id: this.performanceId++, userId: 1, date: new Date(2023, 0, 14), pnl: 283, tradesCount: 5, winCount: 4, lossCount: 1 },
      { id: this.performanceId++, userId: 1, date: new Date(2023, 0, 15), pnl: 196, tradesCount: 3, winCount: 2, lossCount: 1 }
    ];

    for (const perf of dailyPerformanceData) {
      this.dailyPerformance.set(perf.id, perf);
    }
  }
}

export const storage = new MemStorage();
