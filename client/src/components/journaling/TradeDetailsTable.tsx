import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip,
  Box,
  styled,
  useTheme,
  Rating,
  Typography,
  TablePagination,
  Stack,
  LinearProgress,
  Badge
} from '@mui/material';
import { Trade } from '../../types/journaling';
import { format } from 'date-fns';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { ArrowUpward, ArrowDownward, CheckCircle, Cancel, Timeline, ShowChart } from '@mui/icons-material';
import { TradeDetailDialog } from './TradeDetailDialog';

interface TradeDetailsTableProps {
  trades: Trade[];
}

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: '100%',
  '& .MuiTable-root': {
    borderCollapse: 'separate',
    borderSpacing: 0,
  }
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  '& .MuiTableCell-head': {
    backgroundColor: theme.palette.mode === 'dark' ? '#2D2D2D' : '#F0F0F0',
    fontWeight: 600,
    fontSize: '0.65rem',
    padding: '8px 10px',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  }
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: '6px 10px',
  fontSize: '0.65rem',
  borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
  whiteSpace: 'nowrap'
}));

const StyledTableRow = styled(TableRow)<{ isbuy?: string, issell?: string }>(({ theme, isbuy, issell }) => ({
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
  },
  height: '36px',
  transition: 'all 0.2s ease',
  borderLeft: isbuy === 'true' ? `3px solid ${theme.palette.mode === 'dark' ? '#4ade80' : '#22c55e'}` : 
              issell === 'true' ? `3px solid ${theme.palette.mode === 'dark' ? '#f87171' : '#ef4444'}` : 'none',
  cursor: 'pointer',
}));

// Styled profit/loss chip with improved colors
const ProfitChip = styled(Chip)<{ profit: boolean }>(({ theme, profit }) => ({
  backgroundColor: profit 
    ? theme.palette.mode === 'dark' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)'
    : theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
  color: profit 
    ? theme.palette.mode === 'dark' ? '#4ade80' : '#22c55e'
    : theme.palette.mode === 'dark' ? '#f87171' : '#ef4444',
  fontWeight: 700,
  fontSize: '0.65rem',
  height: '20px',
  '& .MuiChip-label': {
    padding: '0 6px',
  },
  '& .MuiChip-icon': {
    fontSize: '0.75rem',
    marginLeft: '2px',
  }
}));

const StyledPagination = styled(TablePagination)(({ theme }) => ({
  '& .MuiTablePagination-toolbar': {
    minHeight: '36px',
    paddingLeft: '8px',
    paddingRight: '8px',
  },
  '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
    fontSize: '0.65rem',
  },
  '& .MuiTablePagination-select': {
    fontSize: '0.65rem',
  }
}));

// Direction chip with improved styles
const DirectionChip = styled(Box)<{ islong: string }>(({ theme, islong }) => ({
  backgroundColor: islong === 'true'
    ? theme.palette.mode === 'dark' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.1)'
    : theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)',
  color: islong === 'true'
    ? theme.palette.mode === 'dark' ? '#4ade80' : '#22c55e'
    : theme.palette.mode === 'dark' ? '#f87171' : '#ef4444',
  fontWeight: 700,
  fontSize: '0.7rem',
  padding: '3px 8px',
  borderRadius: '4px',
  display: 'inline-flex',
  alignItems: 'center',
  '& svg': {
    fontSize: '0.85rem',
    marginRight: '3px',
  }
}));

const SetupChip = styled(Chip)(({ theme }) => ({
  marginRight: theme.spacing(0.5),
  marginBottom: theme.spacing(0.5),
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
  fontSize: '0.7rem',
  height: '18px',
}));

const CatalystChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(147, 51, 234, 0.2)' : 'rgba(147, 51, 234, 0.1)',
  color: theme.palette.mode === 'dark' ? '#d8b4fe' : '#9333ea',
  fontSize: '0.75rem',
  height: '20px',
}));

const TableWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%', 
  flex: 1,
  overflow: 'hidden',
}));

// Rating component for execution quality
const ExecutionRating = styled(Rating)(({ theme }) => ({
  fontSize: '0.8rem',
  '& .MuiRating-iconFilled': {
    color: theme.palette.mode === 'dark' ? '#f59e0b' : '#f59e0b',
  },
  '& .MuiRating-iconEmpty': {
    color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
  }
}));

// Price change indicator
const PriceChange = styled(Box)<{ ishigher: string }>(({ theme, ishigher }) => ({
  color: ishigher === 'true'
    ? theme.palette.mode === 'dark' ? '#4ade80' : '#22c55e'
    : theme.palette.mode === 'dark' ? '#f87171' : '#ef4444',
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  fontSize: '0.65rem',
  '& svg': {
    fontSize: '0.8rem',
    marginLeft: '2px'
  }
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
    return reward / risk;
  } else {
    const risk = stopLoss - entryPrice;
    if (risk <= 0) return null; // Invalid stop loss
    const reward = entryPrice - exitPrice;
    return reward / risk;
  }
};

export const TradeDetailsTable = ({ trades }: TradeDetailsTableProps) => {
  const theme = useTheme();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectedTrade, setSelectedTrade] = React.useState<Trade | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleTradeClick = (trade: Trade) => {
    setSelectedTrade(trade);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  if (trades.length === 0) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Typography variant="body1" color="text.secondary">
          No trades found for this date
        </Typography>
      </Box>
    );
  }

  return (
    <TableWrapper>
      <StyledTableContainer>
        <Table stickyHeader size="small">
          <StyledTableHead>
            <TableRow>
              <StyledTableCell>Symbol</StyledTableCell>
              <StyledTableCell>Direction</StyledTableCell>
              <StyledTableCell>Entry Time</StyledTableCell>
              <StyledTableCell>Exit Time</StyledTableCell>
              <StyledTableCell>Entry/Exit Prices</StyledTableCell>
              <StyledTableCell>Quantity</StyledTableCell>
              <StyledTableCell>P&L</StyledTableCell>
              <StyledTableCell>ROI</StyledTableCell>
              <StyledTableCell>Strategy</StyledTableCell>
              <StyledTableCell>Execution</StyledTableCell>
              <StyledTableCell>Notes</StyledTableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {trades
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((trade, index) => {
                const profit = trade.netPL > 0;
                const isLong = trade.direction === 'Long';

                // For entry/exit price comparison
                const isPriceHigher = isLong 
                  ? trade.exitPrice > trade.entryPrice 
                  : trade.exitPrice < trade.entryPrice;
                
                return (
                  <StyledTableRow 
                    key={index} 
                    isbuy={isLong ? 'true' : 'false'} 
                    issell={!isLong ? 'true' : 'false'}
                    onClick={() => handleTradeClick(trade)}
                    hover
                  >
                    <StyledTableCell sx={{ fontWeight: 600 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Badge 
                          color={trade.status === 'Win' ? 'success' : 'error'} 
                          variant="dot" 
                          sx={{ mr: 1 }}
                        />
                        {trade.symbol}
                      </Box>
                    </StyledTableCell>
                    
                    <StyledTableCell>
                      <DirectionChip islong={isLong ? 'true' : 'false'}>
                        {isLong ? <TrendingUpIcon /> : <TrendingDownIcon />}
                        {trade.direction.toUpperCase()}
                      </DirectionChip>
                    </StyledTableCell>
                    
                    <StyledTableCell>
                      {format(new Date(trade.openDate), 'HH:mm:ss')}
                    </StyledTableCell>
                    
                    <StyledTableCell>
                      {format(new Date(trade.closeDate), 'HH:mm:ss')}
                    </StyledTableCell>
                    
                    <StyledTableCell>
                      <Stack spacing={0.5}>
                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 500 }}>
                          ${trade.entryPrice.toFixed(2)}
                        </Typography>
                        <PriceChange ishigher={isPriceHigher ? 'true' : 'false'}>
                          ${trade.exitPrice.toFixed(2)}
                          {isPriceHigher ? <ArrowUpward /> : <ArrowDownward />}
                        </PriceChange>
                      </Stack>
                    </StyledTableCell>
                    
                    <StyledTableCell>{trade.quantity || 100}</StyledTableCell>
                    
                    <StyledTableCell>
                      <ProfitChip 
                        profit={profit}
                        label={`${profit ? '+' : ''}$${(trade.netPL || 0).toFixed(2)}`}
                        icon={profit ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
                        size="small"
                      />
                    </StyledTableCell>

                    <StyledTableCell>
                      <Typography
                        sx={{
                          color: profit 
                            ? theme.palette.mode === 'dark' ? '#4ade80' : '#22c55e'
                            : theme.palette.mode === 'dark' ? '#f87171' : '#ef4444',
                          fontWeight: 700,
                          fontSize: '0.65rem'
                        }}
                      >
                        {profit ? '+' : ''}{trade.netROI?.toFixed(2)}%
                      </Typography>
                    </StyledTableCell>
                    
                    <StyledTableCell>
                      <Chip 
                        label={trade.setupType} 
                        size="small"
                        sx={{ 
                          fontSize: '0.6rem', 
                          height: '18px',
                          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(14, 165, 233, 0.15)' : 'rgba(14, 165, 233, 0.1)',
                          color: theme.palette.mode === 'dark' ? '#7dd3fc' : '#0ea5e9',
                          fontWeight: 600,
                          '& .MuiChip-label': { padding: '0 6px' }
                        }}
                      />
                    </StyledTableCell>
                    
                    <StyledTableCell>
                      <ExecutionRating 
                        value={trade.executionRating} 
                        readOnly 
                        precision={0.5} 
                        size="small" 
                      />
                    </StyledTableCell>
                    
                    <StyledTableCell>
                      <Typography sx={{ fontSize: '0.65rem', maxWidth: '150px', whiteSpace: 'normal', lineHeight: 1.2 }}>
                        {trade.insights}
                      </Typography>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
          </TableBody>
        </Table>
      </StyledTableContainer>
      <StyledPagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={trades.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <TradeDetailDialog 
        trade={selectedTrade}
        open={dialogOpen}
        onClose={handleDialogClose}
      />
    </TableWrapper>
  );
}; 