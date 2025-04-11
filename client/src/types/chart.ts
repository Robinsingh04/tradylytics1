/**
 * Basic DataPoint interface for chart data
 */
export interface DataPoint {
  x: number | string;
  y: number;
}

/**
 * Time series data point with date and value
 */
export interface TimeSeriesDataPoint {
  date: string;
  value: number;
}

/**
 * Props for chart components
 */
export interface ChartProps {
  data: DataPoint[] | TimeSeriesDataPoint[];
  height?: number;
  color?: string;
  isLoading?: boolean;
}

/**
 * Props for EquityCurveChart component
 */
export interface EquityCurveChartProps {
  data: TimeSeriesDataPoint[];
  height?: number;
}

/**
 * Props for DrawdownChart component
 */
export interface DrawdownChartProps {
  data: TimeSeriesDataPoint[];
  height?: number;
}

/**
 * Props for MetricCard component
 */
export interface MetricCardProps {
  title: string;
  value: number | string;
  change?: number;
  isPositive?: boolean;
  isMonetary?: boolean;
  chartData?: DataPoint[];
  color?: string;
  suffix?: string;
  prefix?: string;
}

/**
 * Props for OpenTrades component
 */
export interface OpenTradesProps {
  trades: any[];
  onEditTrade?: (tradeId: number) => void;
  onCloseTrade?: (tradeId: number) => void;
}