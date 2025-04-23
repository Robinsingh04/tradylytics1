// Strategy interfaces and types

export type AssetClass = 'stocks' | 'forex' | 'crypto' | 'futures' | 'options';
export type TimeFrame = 'intraday' | 'swing' | 'position';
export type StrategyType = 'momentum' | 'mean-reversion' | 'breakout' | 'trend-following' | 'volatility' | 'custom';
export type RuleOperator = '>' | '<' | '>=' | '<=' | '==' | 'crosses above' | 'crosses below' | 'is above' | 'is below';
export type Complexity = 'beginner' | 'intermediate' | 'advanced';

export interface Rule {
  id: string;
  indicator: string;
  parameter?: number;
  timeframe?: string;
  operator: RuleOperator;
  value: number | string;
}

export interface RuleGroup {
  id: string;
  name: string;
  rules: Rule[];
  logicalOperator: 'AND' | 'OR';
}

export interface MarketCondition {
  id: string;
  name: string;
  description: string;
  indicator: string;
  operator: RuleOperator;
  value: number | string;
}

export interface RiskParameter {
  maxPositionSize: number;
  maxRiskPerTrade: number;
  targetRiskReward: number;
  stopLossType: 'fixed' | 'atr-based' | 'volatility-based' | 'support/resistance';
  stopLossValue: number;
  takeProfitType: 'fixed' | 'atr-based' | 'volatility-based' | 'resistance/support';
  takeProfitValue: number;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  type: StrategyType;
  assetClasses: AssetClass[];
  timeframes: TimeFrame[];
  complexity: Complexity;
  entryRules: RuleGroup[];
  exitRules: RuleGroup[];
  marketConditions: MarketCondition[];
  riskParameters: RiskParameter;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IndicatorOption {
  value: string;
  label: string;
  description: string;
  category: 'trend' | 'momentum' | 'volatility' | 'volume' | 'support/resistance' | 'custom';
  parameters?: {
    name: string;
    defaultValue: number;
    min?: number;
    max?: number;
  }[];
}

// Predefined indicator options
export const indicatorOptions: IndicatorOption[] = [
  {
    value: 'sma',
    label: 'Simple Moving Average (SMA)',
    description: 'Average price over a specific period',
    category: 'trend',
    parameters: [
      { name: 'period', defaultValue: 20, min: 1, max: 200 }
    ]
  },
  {
    value: 'ema',
    label: 'Exponential Moving Average (EMA)',
    description: 'Weighted average price with more emphasis on recent prices',
    category: 'trend',
    parameters: [
      { name: 'period', defaultValue: 20, min: 1, max: 200 }
    ]
  },
  {
    value: 'macd',
    label: 'MACD',
    description: 'Moving Average Convergence Divergence',
    category: 'momentum',
    parameters: [
      { name: 'fast period', defaultValue: 12, min: 1, max: 50 },
      { name: 'slow period', defaultValue: 26, min: 1, max: 100 },
      { name: 'signal period', defaultValue: 9, min: 1, max: 50 }
    ]
  },
  {
    value: 'rsi',
    label: 'Relative Strength Index (RSI)',
    description: 'Momentum oscillator measuring speed and change of price movements',
    category: 'momentum',
    parameters: [
      { name: 'period', defaultValue: 14, min: 1, max: 50 }
    ]
  },
  {
    value: 'bollinger',
    label: 'Bollinger Bands',
    description: 'Volatility bands placed above and below a moving average',
    category: 'volatility',
    parameters: [
      { name: 'period', defaultValue: 20, min: 1, max: 100 },
      { name: 'std dev', defaultValue: 2, min: 0.5, max: 5 }
    ]
  },
  {
    value: 'atr',
    label: 'Average True Range (ATR)',
    description: 'Market volatility indicator',
    category: 'volatility',
    parameters: [
      { name: 'period', defaultValue: 14, min: 1, max: 50 }
    ]
  },
  {
    value: 'volume',
    label: 'Volume',
    description: 'Trading volume',
    category: 'volume'
  },
  {
    value: 'obv',
    label: 'On-Balance Volume (OBV)',
    description: 'Momentum indicator that uses volume flow',
    category: 'volume'
  },
  {
    value: 'support',
    label: 'Support Level',
    description: 'Price level where downward movement tends to halt',
    category: 'support/resistance'
  },
  {
    value: 'resistance',
    label: 'Resistance Level',
    description: 'Price level where upward movement tends to halt',
    category: 'support/resistance'
  },
  {
    value: 'price',
    label: 'Price',
    description: 'Current market price',
    category: 'custom'
  },
  {
    value: 'candlestick',
    label: 'Candlestick Pattern',
    description: 'Specific candlestick formations',
    category: 'custom'
  }
];

// Predefined rule operator options by indicator type
export const operatorOptions: Record<string, RuleOperator[]> = {
  default: ['>', '<', '>=', '<=', '=='],
  oscillator: ['>', '<', '>=', '<=', '==', 'crosses above', 'crosses below', 'is above', 'is below'],
  moving_average: ['crosses above', 'crosses below', 'is above', 'is below'],
  price: ['>', '<', '>=', '<=', '=='],
  pattern: ['==']
};

// Mapping indicators to their operator type
export const indicatorOperatorMapping: Record<string, keyof typeof operatorOptions> = {
  sma: 'moving_average',
  ema: 'moving_average',
  macd: 'oscillator',
  rsi: 'oscillator',
  bollinger: 'oscillator',
  atr: 'default',
  volume: 'default',
  obv: 'default',
  support: 'price',
  resistance: 'price',
  price: 'price',
  candlestick: 'pattern'
}; 