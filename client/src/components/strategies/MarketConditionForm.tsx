import React from 'react';
import {
  Typography,
  Box,
  TextField,
  MenuItem,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Card,
  CardContent,
  Divider,
  Paper
} from '@mui/material';
import {
  Add,
  Delete,
  TrendingUp,
  TrendingDown,
  ShowChart
} from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import {
  MarketCondition,
  RuleOperator
} from './types';

interface MarketConditionFormProps {
  conditions: MarketCondition[];
  onChange: (conditions: MarketCondition[]) => void;
}

const marketIndicators = [
  { value: 'overall_trend', label: 'Overall Market Trend', icon: <TrendingUp /> },
  { value: 'volatility', label: 'Market Volatility (VIX)', icon: <ShowChart /> },
  { value: 'sector_performance', label: 'Sector Performance', icon: <TrendingUp /> },
  { value: 'market_breadth', label: 'Market Breadth', icon: <ShowChart /> },
  { value: 'relative_volume', label: 'Relative Volume', icon: <ShowChart /> }
];

const marketConditionOperators: RuleOperator[] = ['>', '<', '>=', '<=', '==', 'is above', 'is below'];

const MarketConditionForm: React.FC<MarketConditionFormProps> = ({ conditions, onChange }) => {
  // Add a new market condition
  const handleAddCondition = () => {
    onChange([
      ...conditions,
      {
        id: uuidv4(),
        name: `Condition ${conditions.length + 1}`,
        description: '',
        indicator: 'overall_trend',
        operator: '>' as RuleOperator,
        value: ''
      }
    ]);
  };

  // Remove a market condition
  const handleRemoveCondition = (id: string) => {
    onChange(conditions.filter(condition => condition.id !== id));
  };

  // Update a market condition field
  const handleUpdateCondition = (
    id: string, 
    field: keyof MarketCondition, 
    value: string | number
  ) => {
    onChange(
      conditions.map(condition => 
        condition.id === id
          ? { ...condition, [field]: value }
          : condition
      )
    );
  };

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Market Conditions</Typography>
        <Button 
          variant="outlined" 
          startIcon={<Add />} 
          onClick={handleAddCondition}
          size="small"
        >
          Add Condition
        </Button>
      </Box>

      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        Define market conditions when this strategy should be active
      </Typography>

      {conditions.length === 0 ? (
        <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
          <Typography variant="body2" color="textSecondary" textAlign="center">
            No market conditions specified. This strategy will be active in all market conditions.
          </Typography>
        </Paper>
      ) : (
        conditions.map((condition, index) => (
          <Card key={condition.id} sx={{ mb: 2, boxShadow: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <TextField
                  label="Condition Name"
                  value={condition.name}
                  onChange={(e) => handleUpdateCondition(condition.id, 'name', e.target.value)}
                  sx={{ flexGrow: 1, mr: 2 }}
                  size="small"
                />
                <IconButton 
                  onClick={() => handleRemoveCondition(condition.id)}
                  color="error"
                  size="small"
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>

              <TextField
                label="Description"
                value={condition.description}
                onChange={(e) => handleUpdateCondition(condition.id, 'description', e.target.value)}
                fullWidth
                multiline
                rows={2}
                sx={{ mb: 2 }}
                size="small"
              />

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <FormControl sx={{ minWidth: 200, flexGrow: 1 }} size="small">
                  <InputLabel>Market Indicator</InputLabel>
                  <Select
                    value={condition.indicator}
                    label="Market Indicator"
                    onChange={(e) => handleUpdateCondition(condition.id, 'indicator', e.target.value)}
                  >
                    {marketIndicators.map((indicator) => (
                      <MenuItem key={indicator.value} value={indicator.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {indicator.icon}
                          <Box sx={{ ml: 1 }}>{indicator.label}</Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 120 }} size="small">
                  <InputLabel>Condition</InputLabel>
                  <Select
                    value={condition.operator}
                    label="Condition"
                    onChange={(e) => handleUpdateCondition(condition.id, 'operator', e.target.value as RuleOperator)}
                  >
                    {marketConditionOperators.map((op) => (
                      <MenuItem key={op} value={op}>
                        {op}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Value"
                  value={condition.value}
                  onChange={(e) => handleUpdateCondition(condition.id, 'value', e.target.value)}
                  sx={{ minWidth: 100 }}
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        ))
      )}
      
      {conditions.length > 0 && (
        <FormHelperText>
          All specified market conditions must be met for the strategy to be active.
        </FormHelperText>
      )}
    </div>
  );
};

export default MarketConditionForm; 