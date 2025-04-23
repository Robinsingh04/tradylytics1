import React from 'react';
import {
  Typography,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Box,
  Slider,
  Grid,
  InputAdornment,
  Paper
} from '@mui/material';
import { RiskParameter } from './types';

interface RiskParametersFormProps {
  riskParameters: RiskParameter;
  onChange: (params: RiskParameter) => void;
}

const stopLossOptions = [
  { value: 'fixed', label: 'Fixed Price' },
  { value: 'atr-based', label: 'ATR-Based' },
  { value: 'volatility-based', label: 'Volatility-Based' },
  { value: 'support/resistance', label: 'Support/Resistance Levels' }
];

const takeProfitOptions = [
  { value: 'fixed', label: 'Fixed Price' },
  { value: 'atr-based', label: 'ATR-Based' },
  { value: 'volatility-based', label: 'Volatility-Based' },
  { value: 'resistance/support', label: 'Resistance/Support Levels' }
];

const RiskParametersForm: React.FC<RiskParametersFormProps> = ({ riskParameters, onChange }) => {
  // Handle field changes
  const handleChange = <K extends keyof RiskParameter>(field: K, value: RiskParameter[K]) => {
    onChange({
      ...riskParameters,
      [field]: value
    });
  };

  return (
    <div className="risk-parameters">
      <Typography variant="h6" sx={{ mb: 2 }}>Risk Parameters</Typography>
      
      <div className="risk-parameter-row">
        <FormControl className="parameter-field">
          <InputLabel>Max Position Size</InputLabel>
          <TextField
            label="Max Position Size"
            type="number"
            value={riskParameters.maxPositionSize}
            onChange={(e) => handleChange('maxPositionSize', Number(e.target.value))}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            helperText="Maximum percentage of account to risk on one position"
          />
        </FormControl>
        
        <FormControl className="parameter-field">
          <InputLabel>Max Risk Per Trade</InputLabel>
          <TextField
            label="Max Risk Per Trade"
            type="number"
            value={riskParameters.maxRiskPerTrade}
            onChange={(e) => handleChange('maxRiskPerTrade', Number(e.target.value))}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
            helperText="Maximum percentage of account to risk on one trade"
          />
        </FormControl>
      </div>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          Risk-Reward Ratio: 1:{riskParameters.targetRiskReward}
        </Typography>
        <Slider
          value={riskParameters.targetRiskReward}
          min={0.5}
          max={5}
          step={0.1}
          marks={[
            { value: 1, label: '1:1' },
            { value: 2, label: '1:2' },
            { value: 3, label: '1:3' },
            { value: 4, label: '1:4' },
            { value: 5, label: '1:5' }
          ]}
          onChange={(_, value) => handleChange('targetRiskReward', value as number)}
        />
        <FormHelperText>
          Target risk-reward ratio for trades (profit potential divided by risk)
        </FormHelperText>
      </Box>
      
      <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>Stop Loss Settings</Typography>
        
        <div className="risk-parameter-row">
          <FormControl className="parameter-field">
            <InputLabel>Stop Loss Type</InputLabel>
            <Select
              value={riskParameters.stopLossType}
              label="Stop Loss Type"
              onChange={(e) => handleChange('stopLossType', e.target.value as RiskParameter['stopLossType'])}
            >
              {stopLossOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl className="parameter-field">
            <InputLabel>
              {riskParameters.stopLossType === 'fixed' ? 'Fixed Amount' :
               riskParameters.stopLossType === 'atr-based' ? 'ATR Multiplier' :
               riskParameters.stopLossType === 'volatility-based' ? 'Volatility Multiple' :
               'Distance (%)'}
            </InputLabel>
            <TextField
              label={
                riskParameters.stopLossType === 'fixed' ? 'Fixed Amount' :
                riskParameters.stopLossType === 'atr-based' ? 'ATR Multiplier' :
                riskParameters.stopLossType === 'volatility-based' ? 'Volatility Multiple' :
                'Distance (%)'
              }
              type="number"
              value={riskParameters.stopLossValue}
              onChange={(e) => handleChange('stopLossValue', Number(e.target.value))}
              InputProps={{
                endAdornment: riskParameters.stopLossType === 'fixed' ? 
                  <InputAdornment position="end">$</InputAdornment> : 
                  undefined
              }}
            />
          </FormControl>
        </div>
      </Paper>
      
      <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
        <Typography variant="subtitle1" gutterBottom>Take Profit Settings</Typography>
        
        <div className="risk-parameter-row">
          <FormControl className="parameter-field">
            <InputLabel>Take Profit Type</InputLabel>
            <Select
              value={riskParameters.takeProfitType}
              label="Take Profit Type"
              onChange={(e) => handleChange('takeProfitType', e.target.value as RiskParameter['takeProfitType'])}
            >
              {takeProfitOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl className="parameter-field">
            <InputLabel>
              {riskParameters.takeProfitType === 'fixed' ? 'Fixed Amount' :
               riskParameters.takeProfitType === 'atr-based' ? 'ATR Multiplier' :
               riskParameters.takeProfitType === 'volatility-based' ? 'Volatility Multiple' :
               'Distance (%)'}
            </InputLabel>
            <TextField
              label={
                riskParameters.takeProfitType === 'fixed' ? 'Fixed Amount' :
                riskParameters.takeProfitType === 'atr-based' ? 'ATR Multiplier' :
                riskParameters.takeProfitType === 'volatility-based' ? 'Volatility Multiple' :
                'Distance (%)'
              }
              type="number"
              value={riskParameters.takeProfitValue}
              onChange={(e) => handleChange('takeProfitValue', Number(e.target.value))}
              InputProps={{
                endAdornment: riskParameters.takeProfitType === 'fixed' ? 
                  <InputAdornment position="end">$</InputAdornment> : 
                  undefined
              }}
            />
          </FormControl>
        </div>
      </Paper>
      
      <div className="risk-info">
        <Typography>
          These parameters help define how much capital to risk on each trade and where to place stop loss and take profit orders. 
          Well-defined risk management rules are crucial for consistent long-term performance.
        </Typography>
      </div>
    </div>
  );
};

export default RiskParametersForm; 