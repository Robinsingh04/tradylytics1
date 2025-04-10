import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string | number;
  isPositive: boolean;
  isMonetary?: boolean;
  chartData?: number[];
}

export function MetricCard({ 
  title, 
  value, 
  change, 
  isPositive, 
  isMonetary = false,
  chartData = [30, 45, 65, 40, 70, 90]
}: MetricCardProps) {
  const [mounted, setMounted] = useState(false);

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const formattedValue = isMonetary 
    ? typeof value === 'string' ? value : `$${value.toLocaleString()}`
    : value;

  const formattedChange = typeof change === 'string' 
    ? change 
    : isMonetary 
      ? `${isPositive ? '+' : ''}${change}%` 
      : `${isPositive ? '+' : ''}${change}`;

  const changeColor = isPositive ? 'text-[#4caf50] dark:text-[#66bb6a]' : 'text-[#f44336] dark:text-[#e57373]';
  const valueColor = isMonetary 
    ? (isPositive ? 'text-[#4caf50] dark:text-[#66bb6a]' : 'text-[#f44336] dark:text-[#e57373]')
    : '';

  // Determine which bars should be colored
  const barCount = chartData.length;
  const coloredBarsCount = Math.ceil(barCount / 2);
  
  return (
    <Card className="metric-card h-full bg-neutral-800 border-neutral-700">
      <CardContent className="p-2">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] text-muted-foreground font-medium">{title}</p>
            <p className={`text-base font-bold ${valueColor}`}>{formattedValue}</p>
          </div>
          <div className={`flex items-center ${changeColor}`}>
            {isPositive ? (
              <ArrowUpIcon className="w-3 h-3" />
            ) : (
              <ArrowDownIcon className="w-3 h-3" />
            )}
            <span className="text-[10px] font-medium ml-1">{formattedChange}</span>
          </div>
        </div>
        <div className="mt-1 h-4 flex items-end overflow-hidden">
          <div className="flex-1 flex space-x-px">
            {chartData.map((height, index) => (
              <div 
                key={index}
                className={`h-1 ${
                  index >= barCount - coloredBarsCount 
                    ? isPositive 
                      ? 'bg-[#4caf50] dark:bg-[#66bb6a]' 
                      : 'bg-[#f44336] dark:bg-[#e57373]'
                    : 'bg-neutral-100 dark:bg-neutral-700'
                } flex-1 self-end rounded-sm`}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
