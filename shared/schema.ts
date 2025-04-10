import { pgTable, text, serial, integer, boolean, timestamp, numeric, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Trading data models
export const trades = pgTable("trades", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  symbol: varchar("symbol", { length: 20 }).notNull(),
  direction: varchar("direction", { length: 10 }).notNull(), // 'long' or 'short'
  entryPrice: numeric("entry_price").notNull(),
  currentPrice: numeric("current_price"),
  entryDate: timestamp("entry_date").notNull(),
  exitDate: timestamp("exit_date"),
  pnl: numeric("pnl"),
  pnlPercent: numeric("pnl_percent"),
  status: varchar("status", { length: 20 }).notNull(), // 'open', 'closed'
});

export const insertTradeSchema = createInsertSchema(trades).omit({
  id: true,
});

export type InsertTrade = z.infer<typeof insertTradeSchema>;
export type Trade = typeof trades.$inferSelect;

export const dailyPerformance = pgTable("daily_performance", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: timestamp("date").notNull(),
  pnl: numeric("pnl").notNull(),
  tradesCount: integer("trades_count").notNull(),
  winCount: integer("win_count").notNull(),
  lossCount: integer("loss_count").notNull(),
});

export const insertDailyPerformanceSchema = createInsertSchema(dailyPerformance).omit({
  id: true,
});

export type InsertDailyPerformance = z.infer<typeof insertDailyPerformanceSchema>;
export type DailyPerformance = typeof dailyPerformance.$inferSelect;

export const metrics = pgTable("metrics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  totalPnl: numeric("total_pnl").notNull(),
  pnlChange: numeric("pnl_change"),
  winRate: numeric("win_rate").notNull(),
  winRateChange: numeric("win_rate_change"),
  totalTrades: integer("total_trades").notNull(),
  tradesChange: integer("trades_change"),
  avgWin: numeric("avg_win").notNull(),
  avgWinChange: numeric("avg_win_change"),
  avgLoss: numeric("avg_loss").notNull(),
  avgLossChange: numeric("avg_loss_change"),
  lastUpdated: timestamp("last_updated").notNull()
});

export const insertMetricsSchema = createInsertSchema(metrics).omit({
  id: true,
});

export type InsertMetrics = z.infer<typeof insertMetricsSchema>;
export type Metrics = typeof metrics.$inferSelect;

// Equity and drawdown data points for charts
export const equityHistory = pgTable("equity_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: timestamp("date").notNull(),
  equity: numeric("equity").notNull(),
});

export const insertEquityHistorySchema = createInsertSchema(equityHistory).omit({
  id: true,
});

export type InsertEquityHistory = z.infer<typeof insertEquityHistorySchema>;
export type EquityHistory = typeof equityHistory.$inferSelect;

export const drawdownHistory = pgTable("drawdown_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: timestamp("date").notNull(),
  drawdownPercent: numeric("drawdown_percent").notNull(),
});

export const insertDrawdownHistorySchema = createInsertSchema(drawdownHistory).omit({
  id: true,
});

export type InsertDrawdownHistory = z.infer<typeof insertDrawdownHistorySchema>;
export type DrawdownHistory = typeof drawdownHistory.$inferSelect;
