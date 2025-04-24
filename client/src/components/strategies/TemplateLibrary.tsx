import React from 'react';
import { 
  Typography, 
  Card, 
  CardContent, 
  CardActions, 
  Button,
  Grid,
  Chip
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  SwapHoriz, 
  AttachMoney,
  AccountBalance,
  CurrencyBitcoin,
  Timeline
} from '@mui/icons-material';

// Define the strategy template type
export interface StrategyTemplate {
  id: string;
  name: string;
  description: string;
  type: 'momentum' | 'mean-reversion' | 'breakout' | 'trend-following' | 'volatility';
  assetClasses: ('stocks' | 'forex' | 'crypto' | 'futures' | 'options')[];
  complexity: 'beginner' | 'intermediate' | 'advanced';
  timeframes: ('intraday' | 'swing' | 'position')[];
  entryRules: string[];
  exitRules: string[];
  riskParameters: {
    maxRiskPerTrade: number;
    targetRiskReward: number;
  };
}

// Predefined template data
const templateData: StrategyTemplate[] = [
  {
    id: 'template-1',
    name: 'Simple Moving Average Crossover',
    description: 'A classic trend-following strategy that uses the crossover of two moving averages to identify trend changes.',
    type: 'trend-following',
    assetClasses: ['stocks', 'forex', 'futures'],
    complexity: 'beginner',
    timeframes: ['swing', 'position'],
    entryRules: [
      'Fast MA (20-period) crosses above Slow MA (50-period) for Long',
      'Fast MA (20-period) crosses below Slow MA (50-period) for Short'
    ],
    exitRules: [
      'Fast MA crosses back below Slow MA for Long positions',
      'Fast MA crosses back above Slow MA for Short positions',
      'Fixed profit target or stop loss reached'
    ],
    riskParameters: {
      maxRiskPerTrade: 1,
      targetRiskReward: 2
    }
  },
  {
    id: 'template-2',
    name: 'RSI Mean Reversion',
    description: 'A mean reversion strategy that looks for overbought and oversold conditions using the Relative Strength Index.',
    type: 'mean-reversion',
    assetClasses: ['stocks', 'forex'],
    complexity: 'intermediate',
    timeframes: ['intraday', 'swing'],
    entryRules: [
      'RSI below 30 for Long positions',
      'RSI above 70 for Short positions',
      'Wait for RSI to turn (confirm reversal)'
    ],
    exitRules: [
      'RSI crosses above 50 for Long positions',
      'RSI crosses below 50 for Short positions',
      'Fixed stop loss or time-based exit'
    ],
    riskParameters: {
      maxRiskPerTrade: 1.5,
      targetRiskReward: 1.5
    }
  },
  {
    id: 'template-3',
    name: 'Breakout with Volume Confirmation',
    description: 'A breakout strategy that uses volume confirmation to identify valid breakouts from consolidation patterns.',
    type: 'breakout',
    assetClasses: ['stocks', 'futures'],
    complexity: 'intermediate',
    timeframes: ['intraday', 'swing'],
    entryRules: [
      'Price breaks above resistance with 20% or more increase in volume',
      'Price breaks below support with 20% or more increase in volume',
      'Enter on the close of the breakout candle'
    ],
    exitRules: [
      'Price reaches measured move target (height of pattern)',
      'Price closes back inside the pattern (failure)',
      'Trailing stop after partial profit taken'
    ],
    riskParameters: {
      maxRiskPerTrade: 1,
      targetRiskReward: 2.5
    }
  },
  {
    id: 'template-4',
    name: 'Momentum with MACD Confirmation',
    description: 'A momentum strategy that uses MACD to confirm trend direction and momentum.',
    type: 'momentum',
    assetClasses: ['stocks', 'crypto', 'futures'],
    complexity: 'intermediate',
    timeframes: ['swing'],
    entryRules: [
      'Price making higher highs and higher lows',
      'MACD line crosses above signal line',
      'MACD histogram increasing'
    ],
    exitRules: [
      'MACD line crosses below signal line',
      'Price makes a lower low',
      'Trailing stop or fixed profit target'
    ],
    riskParameters: {
      maxRiskPerTrade: 1.5,
      targetRiskReward: 2
    }
  },
  {
    id: 'template-5',
    name: 'Volatility Breakout (Bollinger Bands)',
    description: 'A volatility-based strategy that trades breakouts from periods of low volatility.',
    type: 'volatility',
    assetClasses: ['forex', 'futures', 'crypto'],
    complexity: 'advanced',
    timeframes: ['intraday', 'swing'],
    entryRules: [
      'Bollinger Band width contracts to recent lows (low volatility)',
      'Price breaks outside the bands with strong momentum',
      'Enter in the direction of the breakout'
    ],
    exitRules: [
      'Price reaches twice the average daily range',
      'Price reverses and crosses the opposite band',
      'Time-based exit or trailing stop'
    ],
    riskParameters: {
      maxRiskPerTrade: 1,
      targetRiskReward: 3
    }
  }
];

interface TemplateLibraryProps {
  onSelectTemplate: (template: StrategyTemplate) => void;
}

// Asset class icons mapping
const assetClassIcons: Record<string, React.ReactNode> = {
  stocks: <AttachMoney />,
  forex: <AccountBalance />,
  crypto: <CurrencyBitcoin />,
  futures: <Timeline />,
  options: <SwapHoriz />
};

// Strategy type icons mapping
const strategyTypeIcons: Record<string, React.ReactNode> = {
  momentum: <TrendingUp />,
  'mean-reversion': <SwapHoriz />,
  breakout: <TrendingUp />,
  'trend-following': <TrendingUp />,
  volatility: <TrendingDown />
};

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ onSelectTemplate }) => {
  return (
    <div className="template-library">
      <Typography variant="h5">Strategy Templates</Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        Choose a template as a starting point for your strategy
      </Typography>

      <div className="templates-grid">
        {templateData.map((template) => (
          <Card key={template.id} className="template-card">
            <CardContent>
              <Typography className="template-title" variant="h6">
                {template.name}
              </Typography>
              <Typography className="template-description" variant="body2">
                {template.description}
              </Typography>
              
              <div className="template-meta">
                <div className="meta-item">
                  {strategyTypeIcons[template.type]}
                  <Typography variant="body2">
                    Type: {template.type.replace('-', ' ')}
                  </Typography>
                </div>
                
                <div className="meta-item">
                  <Timeline />
                  <Typography variant="body2">
                    Timeframes: {template.timeframes.join(', ')}
                  </Typography>
                </div>
                
                <div className="meta-item">
                  <Typography variant="body2">
                    Risk-reward: 1:{template.riskParameters.targetRiskReward}
                  </Typography>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '12px' }}>
                {template.assetClasses.map((assetClass) => (
                  <Chip
                    key={assetClass}
                    size="small"
                    icon={assetClassIcons[assetClass] as React.ReactElement}
                    label={assetClass}
                    sx={{ textTransform: 'capitalize' }}
                  />
                ))}
                <Chip 
                  size="small" 
                  label={template.complexity} 
                  color={
                    template.complexity === 'beginner' ? 'success' : 
                    template.complexity === 'intermediate' ? 'warning' : 
                    'error'
                  }
                  sx={{ textTransform: 'capitalize' }}
                />
              </div>
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                color="primary" 
                onClick={() => onSelectTemplate(template)}
              >
                Use Template
              </Button>
              <Button size="small">View Details</Button>
            </CardActions>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplateLibrary; 