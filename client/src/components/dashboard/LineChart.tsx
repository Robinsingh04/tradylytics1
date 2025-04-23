import React, { useRef, useEffect, useState, useCallback } from 'react';

export interface DataPoint {
  value: number;
  timestamp: string; // ISO string format
}

interface LineChartProps {
  data: DataPoint[];
  color: string;
  height?: number;
  showTooltip?: boolean;
  onHover?: (index: number | null) => void;
  hoveredIndex?: number | null;
  syncId?: string;
  valuePrefix?: string;
  valueSuffix?: string;
  areaFill?: boolean;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  color,
  height = 100,
  showTooltip = true,
  onHover,
  hoveredIndex,
  syncId,
  valuePrefix = '',
  valueSuffix = '',
  areaFill = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePoint, setActivePoint] = useState<{ x: number; y: number; value: number; timestamp: string } | null>(null);

  // Format number with appropriate prefix/suffix
  const formatValue = (val: number) => {
    return `${valuePrefix}${val.toLocaleString(undefined, { maximumFractionDigits: 2 })}${valueSuffix}`;
  };

  // Format date for tooltip
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, { 
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate tooltip position to avoid it being cut off at edges
  const getTooltipPosition = (x: number, y: number) => {
    if (!containerRef.current) return { left: x, top: y - 40, position: 'above' };
    
    const rect = containerRef.current.getBoundingClientRect();
    const tooltipWidth = 160; // Increased estimated tooltip width
    const tooltipHeight = 80; // Increased estimated tooltip height
    const arrowOffset = 10; // Offset for the arrow
    const padding = 12; // Increased padding from container edges
    
    // Calculate the initial position
    let left = x;
    let top = y - tooltipHeight - arrowOffset;
    let position = 'above';
    
    // Check if tooltip would be cut off at the top
    if (top < padding) {
      // If there's not enough space above, try placing it below
      const spaceBelow = rect.height - y - arrowOffset;
      
      // If there's enough space below, place it there
      if (spaceBelow >= tooltipHeight + padding) {
        top = y + arrowOffset;
        position = 'below';
      } else {
        // If there's not enough space below either, place it where there's more space
        if (y < rect.height / 2) {
          // More space below
          top = y + arrowOffset;
          position = 'below';
        } else {
          // More space above, adjust to fit with padding
          top = Math.max(padding, y - tooltipHeight - arrowOffset);
          position = 'above';
        }
      }
    }
    
    // Ensure tooltip stays within container horizontally
    left = Math.max(padding + tooltipWidth/2, Math.min(rect.width - padding - tooltipWidth/2, left));
    
    return { left, top, position };
  };

  // Function to draw the chart
  const drawChart = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!data || data.length === 0) {
       ctx.clearRect(0, 0, canvas.width, canvas.height);
       return; // Exit if no data
    }
    
    // Calculate min/max and scales
    const values = data.map(point => point.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    // Add small buffer if min/max are the same to avoid valueRange being 0
    const valueRange = (maxValue - minValue === 0) ? 1 : maxValue - minValue; 
    
    const padding = { top: 4, right: 4, bottom: 4, left: 4 };
    const chartWidth = canvas.width / (window.devicePixelRatio || 1) - padding.left - padding.right;
    const chartHeight = canvas.height / (window.devicePixelRatio || 1) - padding.top - padding.bottom;
    
    // Handle cases with 0 or 1 data point for scaleX
    const scaleX = data.length > 1 ? chartWidth / (data.length - 1) : 0;
    const scaleY = chartHeight / valueRange;
    
    // Create gradient for area fill
    const gradient = ctx.createLinearGradient(0, padding.top, 0, canvas.height / (window.devicePixelRatio || 1) - padding.bottom);
    gradient.addColorStop(0, `${color}30`); // More transparent at top
    gradient.addColorStop(1, `${color}05`); // Almost transparent at bottom
    
    // Start drawing the line
    ctx.beginPath();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    
    // Create the line path
    data.forEach((point, index) => {
      // Ensure point.value is a valid number
      const pointValue = typeof point.value === 'number' && !isNaN(point.value) ? point.value : minValue; 
      const x = padding.left + (index * scaleX);
      const y = chartHeight + padding.top - ((pointValue - minValue) * scaleY);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    // Draw the line
    ctx.shadowColor = `${color}40`;
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 3;
    ctx.stroke();
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    
    // Draw the area under the line if areaFill is true
    if (areaFill) {
      ctx.lineTo(padding.left + ((data.length - 1) * scaleX), chartHeight + padding.top);
      ctx.lineTo(padding.left, chartHeight + padding.top);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();
    }
    
    // Draw hover point effects
    if (hoveredIndex !== null && hoveredIndex !== undefined && hoveredIndex >= 0 && hoveredIndex < data.length) {
      const point = data[hoveredIndex];
      // Ensure point.value is valid before calculations
      const pointValue = typeof point.value === 'number' && !isNaN(point.value) ? point.value : minValue;
      
      // Recalculate x/y for hover point, guarding against NaN/Infinity
      const x = padding.left + (hoveredIndex * scaleX);
      const y = chartHeight + padding.top - ((pointValue - minValue) * scaleY);
      
      if (isFinite(x) && isFinite(y)) { // Check if calculated coordinates are valid
        // Draw vertical line
        ctx.beginPath();
        ctx.strokeStyle = `${color}80`; // Semi-transparent line
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]); // Dashed line
        ctx.moveTo(x, padding.top);
        ctx.lineTo(x, chartHeight + padding.top);
        ctx.stroke();
        ctx.setLineDash([]); // Reset to solid line
        
        // Draw point
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.fillStyle = '#FFFFFF';
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Set active point state
        if (showTooltip) {
           // Also check point.timestamp is a valid string
           const ts = typeof point.timestamp === 'string' ? point.timestamp : new Date().toISOString();
          setActivePoint({
            x,
            y,
            value: pointValue,
            timestamp: ts 
          });
        }
      } else {
         // If coordinates invalid, don't set active point
         setActivePoint(null);
      }
    } else {
      setActivePoint(null);
    }
  }, [data, color, areaFill, hoveredIndex, showTooltip]);

  // Handle mouse move over the chart
  const handleMouseMove = useCallback((e: PointerEvent) => {
    if (!containerRef.current || !data.length || !onHover) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    const padding = { left: 5, right: 5 }; 
    const chartWidth = rect.width - padding.left - padding.right;
    if (data.length <= 1) return;
    const scaleX = chartWidth / (data.length - 1); 
    if (scaleX === 0) return;
    
    const index = Math.round((x - padding.left) / scaleX);
    
    if (index >= 0 && index < data.length) {
      onHover(index);
    }
  }, [data, onHover]);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    if (onHover) {
      onHover(null);
    }
  }, [onHover]);

  // Effect to set up event listeners and draw
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Resize observer for responsiveness
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.target === container) {
          const { width, height } = entry.contentRect;
          const dpr = window.devicePixelRatio || 1;
          
          // Set canvas size with DPR consideration for crisp rendering
          canvas.width = width * dpr;
          canvas.height = height * dpr;
          
          // Set canvas display size
          canvas.style.width = `${width}px`;
          canvas.style.height = `${height}px`;
          
          drawChart();
        }
      }
    });
    
    resizeObserver.observe(container);
    
    // Add event listeners for interactivity
    container.addEventListener('pointermove', handleMouseMove);
    container.addEventListener('pointerleave', handleMouseLeave);
    
    // Initial draw
    drawChart();
    
    // Cleanup
    return () => {
      resizeObserver.disconnect();
      container.removeEventListener('pointermove', handleMouseMove);
      container.removeEventListener('pointerleave', handleMouseLeave);
    };
  }, [drawChart, handleMouseMove, handleMouseLeave]);

  // Redraw when hoveredIndex changes
  useEffect(() => {
    drawChart();
  }, [hoveredIndex, drawChart]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: `${height}px`, 
        position: 'relative', 
        overflow: 'hidden',
        cursor: 'crosshair'
      }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      
      {showTooltip && activePoint && (
        <div 
          className="chart-tooltip" 
          style={{ 
            position: 'absolute',
            backgroundColor: 'rgba(20, 20, 20, 0.9)',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            pointerEvents: 'none',
            zIndex: 10,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            ...getTooltipPosition(activePoint.x, activePoint.y)
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '4px', color: color }}>
            {formatValue(activePoint.value)}
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            {formatDate(activePoint.timestamp)}
          </div>
        </div>
      )}
    </div>
  );
}; 