import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get metrics
  app.get('/api/metrics', async (req, res) => {
    try {
      const metrics = await storage.getMetrics(1); // Default to user ID 1 for demo
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch metrics' });
    }
  });

  // Get open trades
  app.get('/api/trades/open', async (req, res) => {
    try {
      const trades = await storage.getOpenTrades(1); // Default to user ID 1 for demo
      res.json(trades);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch open trades' });
    }
  });

  // Get equity history
  app.get('/api/equity-history', async (req, res) => {
    try {
      const history = await storage.getEquityHistory(1); // Default to user ID 1 for demo
      const formattedHistory = history.map(item => ({
        date: new Date(item.date).toISOString().split('T')[0],
        equity: Number(item.equity.toString())
      }));
      res.json(formattedHistory);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch equity history' });
    }
  });

  // Get drawdown history
  app.get('/api/drawdown-history', async (req, res) => {
    try {
      const history = await storage.getDrawdownHistory(1); // Default to user ID 1 for demo
      const formattedHistory = history.map(item => ({
        date: new Date(item.date).toISOString().split('T')[0],
        drawdown: Number(item.drawdownPercent.toString())
      }));
      res.json(formattedHistory);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch drawdown history' });
    }
  });

  // Get daily performance data
  app.get('/api/daily-performance', async (req, res) => {
    try {
      const performance = await storage.getDailyPerformance(1); // Default to user ID 1 for demo
      res.json(performance);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch daily performance' });
    }
  });

  // Edit trade
  app.patch('/api/trades/:id', async (req, res) => {
    try {
      const tradeId = parseInt(req.params.id);
      const updatedTrade = await storage.updateTrade(tradeId, req.body);
      res.json(updatedTrade);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update trade' });
    }
  });

  // Close trade
  app.post('/api/trades/:id/close', async (req, res) => {
    try {
      const tradeId = parseInt(req.params.id);
      const closedTrade = await storage.closeTrade(tradeId, req.body);
      res.json(closedTrade);
    } catch (error) {
      res.status(500).json({ message: 'Failed to close trade' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
