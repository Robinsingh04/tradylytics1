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
  TablePagination
} from '@mui/material';
import { Trade } from '../../types/journaling';
import { format } from 'date-fns';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

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
    padding: '6px 8px',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  }
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: '4px 8px',
  fontSize: '0.65rem',
  borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
  whiteSpace: 'nowrap'
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.02)',
  },
  height: '30px',
}));

const ProfitChip = styled(Chip)<{ profit: boolean }>(({ theme, profit }) => ({
  backgroundColor: profit 
    ? theme.palette.mode === 'dark' ? 'rgba(46, 125, 50, 0.2)' : 'rgba(46, 125, 50, 0.1)'
    : theme.palette.mode === 'dark' ? 'rgba(198, 40, 40, 0.2)' : 'rgba(198, 40, 40, 0.1)',
  color: profit 
    ? theme.palette.mode === 'dark' ? '#81c784' : '#2e7d32'
    : theme.palette.mode === 'dark' ? '#e57373' : '#c62828',
  fontWeight: 600,
  fontSize: '0.65rem',
  height: '18px',
  '& .MuiChip-label': {
    padding: '0 6px',
  },
  '& .MuiChip-icon': {
    fontSize: '0.75rem',
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

const DirectionChip = styled(Chip)(({ theme, color }) => ({
  backgroundColor: color === 'long' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
  color: color === 'long' ? '#34d399' : '#f87171',
  fontWeight: 600,
  height: '20px',
  fontSize: '0.75rem',
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

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
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

  // Column widths
  const columnWidths = {
    symbol: '110px',
    entry: '95px',
    exit: '95px',
    pnl: '80px',
    rMultiple: '90px',
    setupType: '140px',
    duration: '90px',
    execution: '130px',
    catalyst: '140px',
  };

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
              <StyledTableCell>Entry Price</StyledTableCell>
              <StyledTableCell>Exit Price</StyledTableCell>
              <StyledTableCell>Quantity</StyledTableCell>
              <StyledTableCell>P&L</StyledTableCell>
              <StyledTableCell>Strategy</StyledTableCell>
              <StyledTableCell>Setup Quality</StyledTableCell>
              <StyledTableCell>Notes</StyledTableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {trades
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((trade, index) => {
                const profit = trade.profitLoss > 0;
                return (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{trade.symbol}</StyledTableCell>
                    <StyledTableCell>
                      <Chip 
                        label={trade.direction} 
                        size="small"
                        color={trade.direction === 'LONG' ? 'primary' : 'secondary'}
                        sx={{ 
                          fontSize: '0.6rem', 
                          height: '18px',
                          '& .MuiChip-label': {
                            padding: '0 6px',
                          }
                        }}
                      />
                    </StyledTableCell>
                    <StyledTableCell>{new Date(trade.entryTime).toLocaleTimeString()}</StyledTableCell>
                    <StyledTableCell>{new Date(trade.exitTime).toLocaleTimeString()}</StyledTableCell>
                    <StyledTableCell>${trade.entryPrice.toFixed(2)}</StyledTableCell>
                    <StyledTableCell>${trade.exitPrice.toFixed(2)}</StyledTableCell>
                    <StyledTableCell>{trade.quantity}</StyledTableCell>
                    <StyledTableCell>
                      <ProfitChip 
                        profit={profit}
                        label={`${profit ? '+' : ''}$${(trade.profitLoss || 0).toFixed(2)}`}
                        icon={profit ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />}
                        size="small"
                      />
                    </StyledTableCell>
                    <StyledTableCell>{trade.strategy}</StyledTableCell>
                    <StyledTableCell>{trade.setupQuality}/10</StyledTableCell>
                    <StyledTableCell>{trade.notes}</StyledTableCell>
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
    </TableWrapper>
  );
}; 