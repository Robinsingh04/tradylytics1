import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface EquityCurveChartProps {
  data: Array<{
    date: string;
    equity: number;
  }>;
  timeRanges?: string[];
}

export function EquityCurveChart({ 
  data,
  timeRanges = ['1M', '3M', '6M', '1Y']
}: EquityCurveChartProps) {
  const [activeRange, setActiveRange] = useState('1M');
  
  // Custom tooltip to format the data
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-1 rounded shadow-sm">
          <p className="text-[10px] font-medium">{label}</p>
          <p className="text-[10px] text-primary">
            ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="h-full bg-neutral-800 border-neutral-700">
      <CardContent className="p-2">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xs font-medium">Equity Curve</h2>
          <div className="flex space-x-1">
            {timeRanges.map(range => (
              <button
                key={range}
                className={`text-[10px] px-1.5 py-0.5 rounded ${
                  activeRange === range 
                    ? 'bg-primary text-white' 
                    : 'bg-neutral-100 dark:bg-neutral-700'
                }`}
                onClick={() => setActiveRange(range)}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b71de" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b71de" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 9 }} 
                tickLine={false}
                axisLine={{ stroke: '#e4e7eb' }}
                stroke="#e4e7eb"
              />
              <YAxis 
                tick={{ fontSize: 9 }} 
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                tickLine={false}
                axisLine={false}
                stroke="#e4e7eb"
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="equity" 
                stroke="#3b71de" 
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#equityGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
