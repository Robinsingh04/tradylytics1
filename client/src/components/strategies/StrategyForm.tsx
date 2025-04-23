import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Divider,
  Paper,
  Box,
  FormControlLabel,
  Checkbox,
  Chip,
  Grid,
  Tab,
  Tabs
} from '@mui/material';
import { 
  Save, 
  Delete, 
  TrendingUp, 
  SwapHoriz, 
  BarChart,
  AccessTime
} from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import RuleBuilder from './RuleBuilder';
import AssetClassSelection from './AssetClassSelection';
import RiskParametersForm from './RiskParametersForm';
import MarketConditionForm from './MarketConditionForm';
import {
  Strategy,
  StrategyType,
  TimeFrame,
  Complexity,
  RuleGroup,
  AssetClass
} from './types';

interface StrategyFormProps {
  strategy?: Strategy;
  onSave: (strategy: Strategy) => void;
  onCancel: () => void;
}

// Initial strategy template
const getInitialStrategy = (): Strategy => ({
  id: uuidv4(),
  name: '',
  description: '',
  type: 'custom',
  assetClasses: [],
  timeframes: ['intraday'],
  complexity: 'intermediate',
  entryRules: [],
  exitRules: [],
  marketConditions: [],
  riskParameters: {
    maxPositionSize: 5,
    maxRiskPerTrade: 1,
    targetRiskReward: 2,
    stopLossType: 'fixed',
    stopLossValue: 0,
    takeProfitType: 'fixed',
    takeProfitValue: 0
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

const strategyTypes = [
  { value: 'momentum', label: 'Momentum', icon: <TrendingUp /> },
  { value: 'mean-reversion', label: 'Mean Reversion', icon: <SwapHoriz /> },
  { value: 'breakout', label: 'Breakout', icon: <TrendingUp /> },
  { value: 'trend-following', label: 'Trend Following', icon: <TrendingUp /> },
  { value: 'volatility', label: 'Volatility', icon: <BarChart /> },
  { value: 'custom', label: 'Custom', icon: null }
];

const timeframeOptions = [
  { value: 'intraday', label: 'Intraday', icon: <AccessTime /> },
  { value: 'swing', label: 'Swing', icon: <AccessTime /> },
  { value: 'position', label: 'Position', icon: <AccessTime /> }
];

const complexityOptions = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`strategy-tabpanel-${index}`}
      aria-labelledby={`strategy-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `strategy-tab-${index}`,
    'aria-controls': `strategy-tabpanel-${index}`,
  };
}

const StrategyForm: React.FC<StrategyFormProps> = ({ 
  strategy: initialStrategy, 
  onSave, 
  onCancel 
}) => {
  const [strategy, setStrategy] = useState<Strategy>(initialStrategy || getInitialStrategy());
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = <K extends keyof Strategy>(field: K, value: Strategy[K]) => {
    setStrategy(prev => ({
      ...prev,
      [field]: value,
      updatedAt: new Date()
    }));
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleTimeframeToggle = (timeframe: TimeFrame) => {
    if (strategy.timeframes.includes(timeframe)) {
      handleChange('timeframes', strategy.timeframes.filter(t => t !== timeframe));
    } else {
      handleChange('timeframes', [...strategy.timeframes, timeframe]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(strategy);
  };

  return (
    <form onSubmit={handleSubmit} className="strategy-form-container">
      <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          {initialStrategy ? 'Edit Strategy' : 'Create New Strategy'}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Strategy Name"
              value={strategy.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Strategy Type</InputLabel>
              <Select
                value={strategy.type}
                label="Strategy Type"
                onChange={(e) => handleChange('type', e.target.value as StrategyType)}
              >
                {strategyTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {type.icon && <Box sx={{ mr: 1 }}>{type.icon}</Box>}
                      {type.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <TextField
          fullWidth
          label="Description"
          value={strategy.description}
          onChange={(e) => handleChange('description', e.target.value)}
          multiline
          rows={3}
          margin="normal"
        />

        <Box sx={{ display: 'flex', mt: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ minWidth: 200 }}>
            <Typography variant="subtitle2" gutterBottom>
              Timeframes
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {timeframeOptions.map((option) => (
                <Chip
                  key={option.value}
                  icon={option.icon}
                  label={option.label}
                  onClick={() => handleTimeframeToggle(option.value as TimeFrame)}
                  color={strategy.timeframes.includes(option.value as TimeFrame) ? 'primary' : 'default'}
                />
              ))}
            </Box>
          </Box>

          <Box sx={{ minWidth: 200 }}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Complexity</InputLabel>
              <Select
                value={strategy.complexity}
                label="Complexity"
                onChange={(e) => handleChange('complexity', e.target.value as Complexity)}
                size="small"
              >
                {complexityOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="strategy configuration tabs">
          <Tab label="Entry Rules" {...a11yProps(0)} />
          <Tab label="Exit Rules" {...a11yProps(1)} />
          <Tab label="Risk Parameters" {...a11yProps(2)} />
          <Tab label="Market Conditions" {...a11yProps(3)} />
          <Tab label="Asset Classes" {...a11yProps(4)} />
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        <RuleBuilder
          title="Entry Rules"
          ruleGroups={strategy.entryRules}
          onChange={(ruleGroups) => handleChange('entryRules', ruleGroups)}
        />
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <RuleBuilder
          title="Exit Rules"
          ruleGroups={strategy.exitRules}
          onChange={(ruleGroups) => handleChange('exitRules', ruleGroups)}
        />
      </TabPanel>

      <TabPanel value={activeTab} index={2}>
        <RiskParametersForm
          riskParameters={strategy.riskParameters}
          onChange={(params) => handleChange('riskParameters', params)}
        />
      </TabPanel>

      <TabPanel value={activeTab} index={3}>
        <MarketConditionForm
          conditions={strategy.marketConditions}
          onChange={(conditions) => handleChange('marketConditions', conditions)}
        />
      </TabPanel>

      <TabPanel value={activeTab} index={4}>
        <AssetClassSelection
          selectedAssets={strategy.assetClasses}
          onChange={(assets) => handleChange('assetClasses', assets)}
        />
      </TabPanel>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          type="submit"
          startIcon={<Save />}
          disabled={!strategy.name || strategy.entryRules.length === 0 || strategy.assetClasses.length === 0}
        >
          Save Strategy
        </Button>
      </Box>
    </form>
  );
};

export default StrategyForm; 