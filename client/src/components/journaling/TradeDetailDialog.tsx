import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Chip,
  Divider,
  Grid,
  Rating,
  LinearProgress,
  Paper,
  styled,
  useTheme,
  Stack,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { 
  ArrowUpward, 
  ArrowDownward, 
  Timeline, 
  ShowChart, 
  BarChart, 
  Speed, 
  Timer, 
  InfoOutlined, 
  LabelOutlined, 
  Category,
  Psychology,
  Article,
  AssessmentOutlined,
  NewspaperOutlined,
  ExpandMore,
  TrackChanges,
  PersonOutlined,
  ListAlt
} from '@mui/icons-material';
import { Trade } from '../../types/journaling';
import { format } from 'date-fns';

interface TradeDetailDialogProps {
  trade: Trade | null;
  open: boolean;
  onClose: () => void;
}

// Styled components for the dialog
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    maxWidth: '100vw',
    maxHeight: '100vh',
    width: '100%',
    height: '100%',
    margin: 0,
    borderRadius: 0,
    overflow: 'hidden',
    backgroundColor: theme.palette.mode === 'dark' ? '#1A1A1A' : '#FFFFFF',
    transform: 'scale(0.75)',
    transformOrigin: 'center',
  }
}));

const DialogHeader = styled(DialogTitle)(({ theme }) => ({
  padding: '16px 32px',
  backgroundColor: theme.palette.mode === 'dark' ? '#111111' : '#F5F5F5',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
}));

const StyledChip = styled(Chip)<{ isprofit?: string }>(({ theme, isprofit }) => ({
  fontWeight: 700,
  height: '24px',
  padding: '0 8px',
  backgroundColor: isprofit === 'true'
    ? theme.palette.mode === 'dark' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)'
    : theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
  color: isprofit === 'true'
    ? theme.palette.mode === 'dark' ? '#4ade80' : '#22c55e'
    : theme.palette.mode === 'dark' ? '#f87171' : '#ef4444',
  '& .MuiChip-icon': {
    color: 'inherit',
  }
}));

const DetailPaper = styled(Paper)(({ theme }) => ({
  padding: '24px',
  height: '100%',
  borderRadius: '12px',
  backgroundColor: theme.palette.mode === 'dark' ? '#222222' : '#F9F9F9',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  marginBottom: '16px',
  display: 'flex',
  alignItems: 'center',
  color: theme.palette.mode === 'dark' ? '#E0E0E0' : '#333333',
  '& svg': {
    marginRight: '8px',
    fontSize: '1.2rem',
    color: theme.palette.mode === 'dark' ? '#BBBBBB' : '#666666',
  }
}));

const DetailLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.mode === 'dark' ? '#AAAAAA' : '#666666',
  marginBottom: '4px',
}));

const DetailValue = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 500,
  color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#333333',
}));

const RMultipleChip = styled(Chip)<{ value: number }>(({ theme, value }) => ({
  backgroundColor: value >= 2 
    ? theme.palette.mode === 'dark' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)'
    : value >= 1 
      ? theme.palette.mode === 'dark' ? 'rgba(250, 204, 21, 0.2)' : 'rgba(250, 204, 21, 0.1)'
      : theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
  color: value >= 2 
    ? theme.palette.mode === 'dark' ? '#4ade80' : '#22c55e' 
    : value >= 1 
      ? theme.palette.mode === 'dark' ? '#facc15' : '#eab308'
      : theme.palette.mode === 'dark' ? '#f87171' : '#ef4444',
  fontWeight: 600,
  height: '24px',
  fontSize: '0.75rem',
}));

// Helper function to calculate R-Multiple
const calculateRMultiple = (trade: Trade): number | null => {
  if (!trade.stopLoss) return null;
  
  const entryPrice = trade.entryPrice;
  const exitPrice = trade.exitPrice;
  const stopLoss = trade.stopLoss;
  
  // For long trades: R = (Exit - Entry) / (Entry - StopLoss)
  // For short trades: R = (Entry - Exit) / (StopLoss - Entry)
  if (trade.direction === 'Long') {
    const risk = entryPrice - stopLoss;
    if (risk <= 0) return null; // Invalid stop loss
    const reward = exitPrice - entryPrice;
    return parseFloat((reward / risk).toFixed(2));
  } else {
    const risk = stopLoss - entryPrice;
    if (risk <= 0) return null; // Invalid stop loss
    const reward = entryPrice - exitPrice;
    return parseFloat((reward / risk).toFixed(2));
  }
};

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
      id={`trade-tabpanel-${index}`}
      aria-labelledby={`trade-tab-${index}`}
      {...other}
      style={{ height: 'calc(100vh - 280px)', overflowY: 'auto' }}
    >
      {value === index && (
        <Box sx={{ pt: 3, pb: 5 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `trade-tab-${index}`,
    'aria-controls': `trade-tabpanel-${index}`,
  };
}

export const TradeDetailDialog: React.FC<TradeDetailDialogProps> = ({
  trade,
  open,
  onClose,
}) => {
  const theme = useTheme();
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (!trade) return null;

  const isLong = trade.direction === 'Long';
  const isProfitable = trade.netPL > 0;
  const rMultiple = calculateRMultiple(trade);
  const isPriceHigher = isLong 
    ? trade.exitPrice > trade.entryPrice 
    : trade.exitPrice < trade.entryPrice;

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      fullScreen
      className="trade-detail-dialog"
    >
      <DialogHeader>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              {trade.symbol}
              <StyledChip
                size="small"
                label={isLong ? 'LONG' : 'SHORT'}
                icon={isLong ? <TrendingUpIcon /> : <TrendingDownIcon />}
                sx={{ ml: 1 }}
                isprofit={isLong ? 'true' : 'false'}
              />
              <StyledChip
                size="small"
                label={trade.status}
                icon={isProfitable ? <ArrowUpward /> : <ArrowDownward />}
                sx={{ ml: 1 }}
                isprofit={isProfitable ? 'true' : 'false'}
              />
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {format(new Date(trade.openDate), 'MMM dd, yyyy')} • {trade.instrument}
            </Typography>
          </Box>
        </Box>
        <IconButton aria-label="close" onClick={onClose} size="medium">
          <CloseIcon />
        </IconButton>
      </DialogHeader>

      <DialogContent sx={{ p: 4 }}>
        {/* Overview Section - Always visible */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <DetailPaper elevation={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={3}>
                  <Box>
                    <DetailLabel sx={{ fontSize: '0.875rem' }}>Entry Date & Time</DetailLabel>
                    <DetailValue sx={{ fontSize: '1rem' }}>
                      {format(new Date(trade.openDate), 'MMM dd, yyyy')} at {format(new Date(trade.openDate), 'HH:mm:ss')}
                    </DetailValue>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box>
                    <DetailLabel sx={{ fontSize: '0.875rem' }}>Exit Date & Time</DetailLabel>
                    <DetailValue sx={{ fontSize: '1rem' }}>
                      {format(new Date(trade.closeDate), 'MMM dd, yyyy')} at {format(new Date(trade.closeDate), 'HH:mm:ss')}
                    </DetailValue>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box>
                    <DetailLabel sx={{ fontSize: '0.875rem' }}>Duration</DetailLabel>
                    <DetailValue sx={{ fontSize: '1rem' }}>{trade.duration}</DetailValue>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Box>
                    <DetailLabel sx={{ fontSize: '0.875rem' }}>Position Size</DetailLabel>
                    <DetailValue sx={{ fontSize: '1rem' }}>{trade.positionSize || 'N/A'}</DetailValue>
                  </Box>
                </Grid>
              </Grid>
            </DetailPaper>
          </Grid>
        </Grid>

        {/* Tabs Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="trade details tabs"
            variant="scrollable"
            scrollButtons="auto"
            sx={{ 
              '& .MuiTab-root': { 
                fontSize: '0.95rem',
                minHeight: '48px',
                px: 3
              }
            }}
          >
            <Tab label="Trade Details" icon={<ShowChart />} iconPosition="start" {...a11yProps(0)} />
            <Tab label="Performance" icon={<BarChart />} iconPosition="start" {...a11yProps(1)} />
            <Tab label="Market Context" icon={<NewspaperOutlined />} iconPosition="start" {...a11yProps(2)} />
            <Tab label="Strategy" icon={<TrackChanges />} iconPosition="start" {...a11yProps(3)} />
            <Tab label="Psychology" icon={<Psychology />} iconPosition="start" {...a11yProps(4)} />
            <Tab label="Journal" icon={<Article />} iconPosition="start" {...a11yProps(5)} />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {/* Tab 1: Trade Details */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <DetailPaper elevation={0}>
                <SectionTitle>
                  <ShowChart fontSize="small" />
                  Entry Details
                </SectionTitle>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <DetailLabel>Entry Price</DetailLabel>
                      <DetailValue>${trade.entryPrice.toFixed(2)}</DetailValue>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <DetailLabel>Stop Loss (Planned)</DetailLabel>
                      <DetailValue>
                        {trade.stopLoss ? `$${trade.stopLoss.toFixed(2)}` : 'Not Set'}
                      </DetailValue>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <DetailLabel>Take Profit (Planned)</DetailLabel>
                      <DetailValue>
                        {trade.takeProfitLevel ? `$${trade.takeProfitLevel.toFixed(2)}` : 'Not Set'}
                      </DetailValue>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <DetailLabel>Entry Time</DetailLabel>
                      <DetailValue>{format(new Date(trade.openDate), 'HH:mm:ss')}</DetailValue>
                    </Box>
                  </Grid>
                </Grid>
              </DetailPaper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <DetailPaper elevation={0}>
                <SectionTitle>
                  <ShowChart fontSize="small" />
                  Exit Details
                </SectionTitle>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <DetailLabel>Exit Price</DetailLabel>
                      <DetailValue sx={{ 
                        color: isPriceHigher 
                          ? theme.palette.mode === 'dark' ? '#4ade80' : '#22c55e' 
                          : theme.palette.mode === 'dark' ? '#f87171' : '#ef4444',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        ${trade.exitPrice.toFixed(2)}
                        {isPriceHigher ? <ArrowUpward fontSize="small" sx={{ ml: 0.5 }} /> : <ArrowDownward fontSize="small" sx={{ ml: 0.5 }} />}
                      </DetailValue>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <DetailLabel>Actual Stop Loss</DetailLabel>
                      <DetailValue>
                        {trade.actualStopLoss ? `$${trade.actualStopLoss.toFixed(2)}` : 'Not Triggered'}
                      </DetailValue>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <DetailLabel>Profit/Loss</DetailLabel>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <StyledChip
                          label={`${isProfitable ? '+' : ''}$${trade.netPL.toFixed(2)}`}
                          icon={isProfitable ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
                          isprofit={isProfitable ? 'true' : 'false'}
                        />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <DetailLabel>Exit Time</DetailLabel>
                      <DetailValue>{format(new Date(trade.closeDate), 'HH:mm:ss')}</DetailValue>
                    </Box>
                  </Grid>
                </Grid>
              </DetailPaper>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 2: Performance Analysis */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <DetailPaper elevation={0}>
                <SectionTitle>
                  <BarChart fontSize="small" />
                  Performance Metrics
                </SectionTitle>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <DetailLabel>Profit & Loss</DetailLabel>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <StyledChip
                          label={`${isProfitable ? '+' : ''}$${trade.netPL.toFixed(2)}`}
                          icon={isProfitable ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
                          isprofit={isProfitable ? 'true' : 'false'}
                        />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <DetailLabel>ROI</DetailLabel>
                      <DetailValue sx={{ 
                        color: isProfitable 
                          ? theme.palette.mode === 'dark' ? '#4ade80' : '#22c55e' 
                          : theme.palette.mode === 'dark' ? '#f87171' : '#ef4444',
                      }}>
                        {isProfitable ? '+' : ''}{trade.netROI.toFixed(2)}%
                      </DetailValue>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <DetailLabel>R-Multiple</DetailLabel>
                      {rMultiple !== null ? (
                        <RMultipleChip 
                          label={`${rMultiple}R`}
                          size="small"
                          value={rMultiple}
                        />
                      ) : (
                        <DetailValue>N/A</DetailValue>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <DetailLabel>Risk-Reward Ratio</DetailLabel>
                      <DetailValue>
                        {trade.riskRewardRatio ? `${trade.riskRewardRatio}:1` : 'N/A'}
                      </DetailValue>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <DetailLabel>Account Risk %</DetailLabel>
                      <DetailValue>
                        {trade.accountRiskPercentage ? `${trade.accountRiskPercentage}%` : 'N/A'}
                      </DetailValue>
                    </Box>
                  </Grid>
                </Grid>
              </DetailPaper>
            </Grid>
            <Grid item xs={12} md={6}>
              <DetailPaper elevation={0}>
                <SectionTitle>
                  <Speed fontSize="small" />
                  Advanced Metrics
                </SectionTitle>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <DetailLabel>Max Favorable Excursion (MFE)</DetailLabel>
                      <DetailValue>
                        {trade.mfe ? `$${trade.mfe.toFixed(2)}` : 'N/A'}
                      </DetailValue>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <DetailLabel>Max Adverse Excursion (MAE)</DetailLabel>
                      <DetailValue>
                        {trade.mae ? `$${trade.mae.toFixed(2)}` : 'N/A'}
                      </DetailValue>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <DetailLabel>Efficiency Ratio</DetailLabel>
                      <DetailValue>
                        {trade.efficiencyRatio ? `${(trade.efficiencyRatio * 100).toFixed(2)}%` : 'N/A'}
                      </DetailValue>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <DetailLabel>Setup Quality</DetailLabel>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating 
                          value={trade.scale / 2} 
                          precision={0.5} 
                          max={5}
                          readOnly 
                          size="large"
                        />
                        <Typography 
                          variant="body1" 
                          sx={{ ml: 1, fontWeight: 600 }}
                        >
                          {trade.scale}/10
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <DetailLabel>Execution Rating</DetailLabel>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Rating 
                          value={trade.executionRating} 
                          max={5}
                          readOnly 
                          size="large"
                        />
                        <Typography 
                          variant="body1" 
                          sx={{ ml: 1, fontWeight: 600 }}
                        >
                          {trade.executionRating}/5
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </DetailPaper>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 3: Market Context */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <DetailPaper elevation={0}>
                <SectionTitle>
                  <NewspaperOutlined fontSize="small" />
                  Market Conditions
                </SectionTitle>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box>
                      <DetailLabel>Market Sentiment</DetailLabel>
                      <DetailValue>
                        {trade.marketSentiment || 'Not recorded'}
                      </DetailValue>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <DetailLabel>Sector Performance</DetailLabel>
                      <DetailValue>
                        {trade.sectorPerformance || 'Not recorded'}
                      </DetailValue>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <DetailLabel>Relevant News</DetailLabel>
                      {trade.relevantNews && trade.relevantNews.length > 0 ? (
                        <Box component="ul" sx={{ pl: 3, mt: 1 }}>
                          {trade.relevantNews.map((news, index) => (
                            <Box component="li" key={index}>
                              <Typography variant="body1">{news}</Typography>
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <DetailValue>No relevant news recorded</DetailValue>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </DetailPaper>
            </Grid>
            <Grid item xs={12} md={6}>
              {/* Reserved for AI market analysis or chart visualization in the future */}
              <DetailPaper elevation={0}>
                <SectionTitle>
                  <AssessmentOutlined fontSize="small" />
                  AI Market Analysis
                </SectionTitle>
                <Box sx={{ py: 3, px: 2 }}>
                  <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                    AI-powered market analysis will be available in a future update. This will include pattern recognition,
                    support/resistance identification, and "what-if" scenario analysis.
                  </Typography>
                </Box>
              </DetailPaper>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 4: Strategy & Execution */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <DetailPaper elevation={0}>
                <SectionTitle>
                  <TrackChanges fontSize="small" />
                  Strategy Details
                </SectionTitle>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box>
                      <DetailLabel>Strategy Type</DetailLabel>
                      <DetailValue>
                        <Chip 
                          label={trade.setupType}
                          size="medium"
                          sx={{
                            backgroundColor: 'rgba(14, 165, 233, 0.1)',
                            color: theme.palette.mode === 'dark' ? '#7dd3fc' : '#0ea5e9',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            height: '32px',
                          }}
                        />
                      </DetailValue>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <DetailLabel>Setup Patterns</DetailLabel>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 1 }}>
                        {trade.setups.map((setup, index) => (
                          <Chip 
                            key={index}
                            label={setup}
                            size="medium"
                            sx={{
                              backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)',
                              color: theme.palette.mode === 'dark' ? '#FFFFFF' : '#333333',
                              fontSize: '0.875rem',
                              height: '30px',
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <DetailLabel>Key Catalyst</DetailLabel>
                      <DetailValue>
                        <Chip 
                          label={trade.keyCatalyst}
                          size="medium"
                          sx={{
                            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.1)',
                            color: theme.palette.mode === 'dark' ? '#c4b5fd' : '#8b5cf6',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            height: '32px',
                          }}
                        />
                      </DetailValue>
                    </Box>
                  </Grid>
                </Grid>
              </DetailPaper>
            </Grid>
            <Grid item xs={12} md={6}>
              <DetailPaper elevation={0}>
                <SectionTitle>
                  <Timeline fontSize="small" />
                  Trade Analysis
                </SectionTitle>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box>
                      <DetailLabel>Insights & Notes</DetailLabel>
                      <Paper variant="outlined" sx={{ p: 2, mt: 1, borderRadius: '8px', backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)' }}>
                        <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                          {trade.insights}
                        </Typography>
                      </Paper>
                    </Box>
                  </Grid>
                </Grid>
              </DetailPaper>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 5: Psychological Factors */}
        <TabPanel value={tabValue} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <DetailPaper elevation={0}>
                <SectionTitle>
                  <Psychology fontSize="small" />
                  Psychological State
                </SectionTitle>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Box>
                      <DetailLabel>Emotional State</DetailLabel>
                      <DetailValue>
                        {trade.emotionalState || 'Not recorded'}
                      </DetailValue>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box>
                      <DetailLabel>Confidence Level</DetailLabel>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {trade.confidenceLevel ? (
                          <>
                            <Rating 
                              value={trade.confidenceLevel} 
                              max={5}
                              readOnly 
                              size="large"
                            />
                            <Typography 
                              variant="body1" 
                              sx={{ ml: 1, fontWeight: 600 }}
                            >
                              {trade.confidenceLevel}/5
                            </Typography>
                          </>
                        ) : (
                          <DetailValue>Not recorded</DetailValue>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <DetailLabel>Psychological Challenges</DetailLabel>
                      <Paper variant="outlined" sx={{ p: 2, mt: 1, borderRadius: '8px', backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)' }}>
                        <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                          {trade.psychologicalChallenges || 'No psychological challenges recorded'}
                        </Typography>
                      </Paper>
                    </Box>
                  </Grid>
                </Grid>
              </DetailPaper>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 6: Journal */}
        <TabPanel value={tabValue} index={5}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <DetailPaper elevation={0}>
                <SectionTitle>
                  <Article fontSize="small" />
                  Trade Journal
                </SectionTitle>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Accordion 
                      defaultExpanded 
                      elevation={0}
                      sx={{ 
                        backgroundColor: 'transparent',
                        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                        borderRadius: '8px',
                        '&:before': { display: 'none' },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        sx={{ minHeight: '56px' }}
                      >
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Pre-Trade Plan</Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ pt: 1, pb: 3 }}>
                        <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                          {trade.tradePlan || 'No pre-trade plan recorded'}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  </Grid>
                  <Grid item xs={12}>
                    <Accordion 
                      defaultExpanded 
                      elevation={0}
                      sx={{ 
                        backgroundColor: 'transparent',
                        border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                        borderRadius: '8px',
                        '&:before': { display: 'none' },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                        sx={{ minHeight: '56px' }}
                      >
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Post-Trade Reflection</Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ pt: 1, pb: 3 }}>
                        <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                          {trade.postTradeReflection || 'No post-trade reflection recorded'}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <DetailLabel>Identified Mistakes</DetailLabel>
                      {trade.mistakesIdentified && trade.mistakesIdentified.length > 0 ? (
                        <Box component="ul" sx={{ pl: 3, mt: 1 }}>
                          {trade.mistakesIdentified.map((mistake, index) => (
                            <Box component="li" key={index}>
                              <Typography variant="body1" sx={{ lineHeight: 1.6 }}>{mistake}</Typography>
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <DetailValue>No mistakes identified or recorded</DetailValue>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <DetailLabel>Tags</DetailLabel>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 1 }}>
                        {trade.tags && trade.tags.length > 0 ? (
                          trade.tags.map((tag, index) => (
                            <Chip 
                              key={index}
                              label={tag}
                              size="medium"
                              sx={{
                                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)',
                                color: theme.palette.mode === 'dark' ? '#93c5fd' : '#3b82f6',
                                fontSize: '0.875rem',
                                height: '30px',
                              }}
                            />
                          ))
                        ) : (
                          <Typography variant="body1">No tags</Typography>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <DetailLabel>Future Adjustments</DetailLabel>
                      <Paper variant="outlined" sx={{ p: 2, mt: 1, borderRadius: '8px', backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)' }}>
                        <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                          {trade.futureAdjustments || 'No adjustment plans recorded'}
                        </Typography>
                      </Paper>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <DetailLabel>Skills to Improve</DetailLabel>
                      {trade.skillsToImprove && trade.skillsToImprove.length > 0 ? (
                        <Box component="ul" sx={{ pl: 3, mt: 1 }}>
                          {trade.skillsToImprove.map((skill, index) => (
                            <Box component="li" key={index}>
                              <Typography variant="body1" sx={{ lineHeight: 1.6 }}>{skill}</Typography>
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <DetailValue>No specific skills identified for improvement</DetailValue>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </DetailPaper>
            </Grid>
          </Grid>
        </TabPanel>
      </DialogContent>
    </StyledDialog>
  );
}; 