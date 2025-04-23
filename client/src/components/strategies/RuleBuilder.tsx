import React, { useState } from 'react';
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
  Tooltip,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel
} from '@mui/material';
import {
  Add,
  Delete,
  Info
} from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import {
  Rule,
  RuleGroup,
  indicatorOptions,
  operatorOptions,
  indicatorOperatorMapping
} from './types';

interface RuleBuilderProps {
  title: string;
  ruleGroups: RuleGroup[];
  onChange: (ruleGroups: RuleGroup[]) => void;
}

const RuleBuilder: React.FC<RuleBuilderProps> = ({ title, ruleGroups, onChange }) => {
  // Add a new rule to a group
  const handleAddRule = (groupId: string) => {
    const updatedGroups = ruleGroups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          rules: [
            ...group.rules,
            {
              id: uuidv4(),
              indicator: '',
              operator: '>' as const,
              value: ''
            }
          ]
        };
      }
      return group;
    });
    
    onChange(updatedGroups);
  };

  // Delete a rule from a group
  const handleDeleteRule = (groupId: string, ruleId: string) => {
    const updatedGroups = ruleGroups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          rules: group.rules.filter(rule => rule.id !== ruleId)
        };
      }
      return group;
    });
    
    onChange(updatedGroups);
  };

  // Add a new rule group
  const handleAddGroup = () => {
    onChange([
      ...ruleGroups,
      {
        id: uuidv4(),
        name: `Group ${ruleGroups.length + 1}`,
        rules: [
          {
            id: uuidv4(),
            indicator: '',
            operator: '>' as const,
            value: ''
          }
        ],
        logicalOperator: 'AND'
      }
    ]);
  };

  // Delete a rule group
  const handleDeleteGroup = (groupId: string) => {
    onChange(ruleGroups.filter(group => group.id !== groupId));
  };

  // Update rule field
  const handleRuleChange = (
    groupId: string,
    ruleId: string,
    field: keyof Rule,
    value: string | number
  ) => {
    const updatedGroups = ruleGroups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          rules: group.rules.map(rule => {
            if (rule.id === ruleId) {
              const updatedRule = { ...rule, [field]: value };
              
              // Reset operator if indicator changes to ensure compatibility
              if (field === 'indicator') {
                const operatorType = indicatorOperatorMapping[value as string] || 'default';
                updatedRule.operator = operatorOptions[operatorType][0];
              }
              
              return updatedRule;
            }
            return rule;
          })
        };
      }
      return group;
    });
    
    onChange(updatedGroups);
  };

  // Update group's logical operator
  const handleLogicalOperatorChange = (groupId: string, value: 'AND' | 'OR') => {
    const updatedGroups = ruleGroups.map(group => {
      if (group.id === groupId) {
        return { ...group, logicalOperator: value };
      }
      return group;
    });
    
    onChange(updatedGroups);
  };

  // Get available operators for a specific indicator
  const getOperatorsForIndicator = (indicator: string) => {
    const operatorType = indicatorOperatorMapping[indicator] || 'default';
    return operatorOptions[operatorType] || operatorOptions.default;
  };

  // Get indicator details
  const getIndicatorDetails = (indicator: string) => {
    return indicatorOptions.find(option => option.value === indicator);
  };

  return (
    <div className="rule-builder">
      <div className="rule-header">
        <Typography variant="h6" className="rule-type">{title}</Typography>
        <Tooltip title="Rules define when to enter or exit a trade">
          <IconButton size="small">
            <Info fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>

      {ruleGroups.length === 0 ? (
        <Typography variant="body2" color="textSecondary" sx={{ my: 2 }}>
          No rules defined. Add a rule group to get started.
        </Typography>
      ) : (
        ruleGroups.map((group, groupIndex) => (
          <Box key={group.id} className="rule-group" sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ mr: 2 }}>
                  Group {groupIndex + 1}
                </Typography>
                
                {groupIndex > 0 && (
                  <FormControl size="small" sx={{ minWidth: 80 }}>
                    <RadioGroup
                      row
                      value={group.logicalOperator}
                      onChange={(e) => handleLogicalOperatorChange(group.id, e.target.value as 'AND' | 'OR')}
                    >
                      <FormControlLabel value="AND" control={<Radio size="small" />} label="AND" />
                      <FormControlLabel value="OR" control={<Radio size="small" />} label="OR" />
                    </RadioGroup>
                  </FormControl>
                )}
              </Box>
              
              {ruleGroups.length > 1 && (
                <IconButton 
                  size="small" 
                  onClick={() => handleDeleteGroup(group.id)}
                  color="error"
                >
                  <Delete fontSize="small" />
                </IconButton>
              )}
            </Box>
            
            {group.rules.map((rule, ruleIndex) => (
              <div key={rule.id} className="rule-row">
                <FormControl className="rule-indicator" size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Indicator</InputLabel>
                  <Select
                    value={rule.indicator}
                    label="Indicator"
                    onChange={(e) => handleRuleChange(group.id, rule.id, 'indicator', e.target.value)}
                  >
                    {indicatorOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                {rule.indicator && getIndicatorDetails(rule.indicator)?.parameters && (
                  <FormControl size="small" sx={{ width: 120 }}>
                    <InputLabel>{getIndicatorDetails(rule.indicator)?.parameters?.[0].name}</InputLabel>
                    <TextField
                      type="number"
                      size="small"
                      label={getIndicatorDetails(rule.indicator)?.parameters?.[0].name}
                      value={rule.parameter || getIndicatorDetails(rule.indicator)?.parameters?.[0].defaultValue || ''}
                      onChange={(e) => handleRuleChange(group.id, rule.id, 'parameter', parseInt(e.target.value))}
                      inputProps={{
                        min: getIndicatorDetails(rule.indicator)?.parameters?.[0].min,
                        max: getIndicatorDetails(rule.indicator)?.parameters?.[0].max
                      }}
                    />
                  </FormControl>
                )}
                
                {rule.indicator && (
                  <FormControl className="rule-operator" size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Condition</InputLabel>
                    <Select
                      value={rule.operator}
                      label="Condition"
                      onChange={(e) => handleRuleChange(group.id, rule.id, 'operator', e.target.value)}
                    >
                      {getOperatorsForIndicator(rule.indicator).map((op) => (
                        <MenuItem key={op} value={op}>
                          {op}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
                
                {rule.indicator && (
                  <FormControl className="rule-value" size="small" sx={{ width: 120 }}>
                    <TextField
                      label="Value"
                      size="small"
                      value={rule.value}
                      onChange={(e) => handleRuleChange(group.id, rule.id, 'value', e.target.value)}
                    />
                  </FormControl>
                )}
                
                <div className="rule-actions">
                  <IconButton 
                    size="small" 
                    onClick={() => handleDeleteRule(group.id, rule.id)}
                    disabled={group.rules.length <= 1}
                    color="error"
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </div>
              </div>
            ))}
            
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => handleAddRule(group.id)}
              size="small"
              className="add-rule-btn"
            >
              Add Condition
            </Button>
          </Box>
        ))
      )}

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={handleAddGroup}
        size="small"
        color="primary"
        sx={{ mt: 2 }}
      >
        Add Rule Group
      </Button>
    </div>
  );
};

export default RuleBuilder; 