import React, { useState } from 'react';
import { 
  Typography, 
  Container, 
  Button, 
  Box, 
  Paper, 
  Tabs, 
  Tab,
  Snackbar,
  Alert
} from '@mui/material';
import { Add } from '@mui/icons-material';
import StrategyForm from '../components/strategies/StrategyForm';
import TemplateLibrary from '../components/strategies/TemplateLibrary';
import { Strategy } from '../components/strategies/types';
import { StrategyTemplate } from '../components/strategies/TemplateLibrary';
import { v4 as uuidv4 } from 'uuid';

enum ViewMode {
  LIST,
  CREATE,
  EDIT,
  TEMPLATES
}

const StrategyCreation: React.FC = () => {
  // Mock saved strategies
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [currentStrategy, setCurrentStrategy] = useState<Strategy | undefined>(undefined);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.TEMPLATES);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Create a new empty strategy
  const handleCreateNew = () => {
    setCurrentStrategy(undefined);
    setViewMode(ViewMode.CREATE);
  };

  // Edit existing strategy
  const handleEdit = (strategy: Strategy) => {
    setCurrentStrategy(strategy);
    setViewMode(ViewMode.EDIT);
  };

  // Delete strategy
  const handleDelete = (id: string) => {
    setStrategies(strategies.filter(s => s.id !== id));
    showNotification('Strategy deleted', 'success');
  };

  // Save strategy (new or edited)
  const handleSave = (strategy: Strategy) => {
    if (viewMode === ViewMode.EDIT) {
      // Update existing
      setStrategies(strategies.map(s => s.id === strategy.id ? strategy : s));
      showNotification('Strategy updated successfully', 'success');
    } else {
      // Add new
      setStrategies([...strategies, strategy]);
      showNotification('Strategy created successfully', 'success');
    }
    setViewMode(ViewMode.LIST);
  };

  // Handle template selection
  const handleSelectTemplate = (template: StrategyTemplate) => {
    // Convert template to strategy
    const strategy: Strategy = {
      id: uuidv4(),
      name: template.name,
      description: template.description,
      type: template.type,
      assetClasses: template.assetClasses,
      timeframes: template.timeframes,
      complexity: template.complexity,
      entryRules: [
        {
          id: uuidv4(),
          name: 'Template Entry Rules',
          rules: template.entryRules.map(rule => ({
            id: uuidv4(),
            indicator: 'price', // Default, will be edited by user
            operator: '>' as const,
            value: rule // Use the rule description as placeholder
          })),
          logicalOperator: 'AND'
        }
      ],
      exitRules: [
        {
          id: uuidv4(),
          name: 'Template Exit Rules',
          rules: template.exitRules.map(rule => ({
            id: uuidv4(),
            indicator: 'price', // Default, will be edited by user
            operator: '<' as const,
            value: rule // Use the rule description as placeholder
          })),
          logicalOperator: 'AND'
        }
      ],
      marketConditions: [],
      riskParameters: {
        maxPositionSize: 5,
        maxRiskPerTrade: template.riskParameters.maxRiskPerTrade,
        targetRiskReward: template.riskParameters.targetRiskReward,
        stopLossType: 'fixed',
        stopLossValue: 0,
        takeProfitType: 'fixed',
        takeProfitValue: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setCurrentStrategy(strategy);
    setViewMode(ViewMode.CREATE);
    showNotification('Template applied successfully', 'info');
  };

  // Cancel creation/editing
  const handleCancel = () => {
    setViewMode(ViewMode.LIST);
  };

  // Show notification
  const showNotification = (message: string, severity: 'success' | 'error' | 'info') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  // Close notification
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  // Render based on view mode
  const renderContent = () => {
    switch (viewMode) {
      case ViewMode.CREATE:
      case ViewMode.EDIT:
        return (
          <StrategyForm
            strategy={currentStrategy}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        );
      case ViewMode.TEMPLATES:
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">Strategy Builder</Typography>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<Add />}
                onClick={handleCreateNew}
              >
                Create from Scratch
              </Button>
            </Box>
            
            <TemplateLibrary onSelectTemplate={handleSelectTemplate} />
          </Box>
        );
      case ViewMode.LIST:
      default:
        return (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">My Strategies</Typography>
              <Box>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={() => setViewMode(ViewMode.TEMPLATES)}
                  sx={{ mr: 2 }}
                >
                  Use Template
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<Add />}
                  onClick={handleCreateNew}
                >
                  Create New
                </Button>
              </Box>
            </Box>
            
            {strategies.length === 0 ? (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="textSecondary">
                  You haven't created any strategies yet. Create your first strategy or use a template to get started.
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    onClick={() => setViewMode(ViewMode.TEMPLATES)}
                    sx={{ mr: 2 }}
                  >
                    Browse Templates
                  </Button>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<Add />}
                    onClick={handleCreateNew}
                  >
                    Create New
                  </Button>
                </Box>
              </Paper>
            ) : (
              <div className="strategies-list-container">
                {/* Strategy list table would go here - we'll stub it for now */}
                <Typography>
                  You have {strategies.length} saved {strategies.length === 1 ? 'strategy' : 'strategies'}.
                </Typography>
              </div>
            )}
          </Box>
        );
    }
  };

  return (
    <Container maxWidth="lg" className="strategy-creation-container">
      {renderContent()}
      
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default StrategyCreation; 