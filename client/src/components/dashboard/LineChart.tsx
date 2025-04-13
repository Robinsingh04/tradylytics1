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
  valueSuffix = ''
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
    
    // If no data, don't draw
    if (!data.length) return;
    
    // Calculate min and max values for scaling
    const values = data.map(point => point.value);
    const minValue = Math.min(...values) * 0.98; // Reduce padding
    const maxValue = Math.max(...values) * 1.02; // Reduce padding
    const valueRange = maxValue - minValue;
    
    // Reduce padding
    const padding = { top: 4, right: 4, bottom: 4, left: 4 };
    const chartWidth = canvas.width / (window.devicePixelRatio || 1) - padding.left - padding.right;
    const chartHeight = canvas.height / (window.devicePixelRatio || 1) - padding.top - padding.bottom;
    
    // Scale factor
    const scaleX = chartWidth / (data.length - 1);
    const scaleY = valueRange === 0 ? 0 : chartHeight / valueRange;
    
    // Create gradient for area fill
    const gradient = ctx.createLinearGradient(0, padding.top, 0, canvas.height / (window.devicePixelRatio || 1) - padding.bottom);
    gradient.addColorStop(0, `${color}30`); // More transparent at top
    gradient.addColorStop(1, `${color}05`); // Almost transparent at bottom
    
    // Start drawing the line
    ctx.beginPath();
    // Enable anti-aliasing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    // Line style
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    
    // Create the line path
    data.forEach((point, index) => {
      const x = padding.left + (index * scaleX);
      // Invert y to draw from bottom to top
      const y = chartHeight + padding.top - ((point.value - minValue) * scaleY);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    // Draw the line with shadow for depth
    ctx.shadowColor = `${color}40`;
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 3;
    ctx.stroke();
    
    // Reset shadow for fill
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // Draw the area under the line
    ctx.lineTo(padding.left + ((data.length - 1) * scaleX), chartHeight + padding.top);
    ctx.lineTo(padding.left, chartHeight + padding.top);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw hover point if it exists
    if (hoveredIndex !== null && hoveredIndex !== undefined && hoveredIndex >= 0 && hoveredIndex < data.length) {
      const point = data[hoveredIndex];
      const x = padding.left + (hoveredIndex * scaleX);
      const y = chartHeight + padding.top - ((point.value - minValue) * scaleY);
      
      // Draw vertical line
      ctx.beginPath();
      ctx.strokeStyle = `${color}60`; // Semi-transparent line
      ctx.setLineDash([2, 2]); // Dashed line
      ctx.lineWidth = 1;
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, chartHeight + padding.top);
      ctx.stroke();
      ctx.setLineDash([]); // Reset dash
      
      // Draw point with halo effect
      // Outer glow
      ctx.beginPath();
      const gradient2 = ctx.createRadialGradient(x, y, 0, x, y, 12);
      gradient2.addColorStop(0, `${color}50`);
      gradient2.addColorStop(1, `${color}00`);
      ctx.fillStyle = gradient2;
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.fill();
      
      // Inner point
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      
      // White border
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      
      // Store active point for tooltip
      if (showTooltip) {
        setActivePoint({
          x,
          y,
          value: point.value,
          timestamp: point.timestamp
        });
      }
    } else {
      setActivePoint(null);
    }
  }, [data, color, hoveredIndex, showTooltip]);

  // Handle mouse move over the chart
  const handleMouseMove = useCallback((e: PointerEvent) => {
    if (!containerRef.current || !data.length) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    // Calculate which data point is closest to the mouse position
    const padding = { left: 5, right: 5 };
    const chartWidth = rect.width - padding.left - padding.right;
    const scaleX = chartWidth / (data.length - 1);
    
    const index = Math.round((x - padding.left) / scaleX);
    
    if (index >= 0 && index < data.length) {
      onHover && onHover(index);
    }
  }, [data, onHover]);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    onHover && onHover(null);
  }, [onHover]);

  // Effect to set up event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('pointermove', handleMouseMove as any);
      container.addEventListener('pointerleave', handleMouseLeave as any);
      
      return () => {
        container.removeEventListener('pointermove', handleMouseMove as any);
        container.removeEventListener('pointerleave', handleMouseLeave as any);
      };
    }
  }, [handleMouseMove, handleMouseLeave]);

  // Effect to redraw the chart when data or hover state changes
  useEffect(() => {
    // Set canvas size to match container size for sharp rendering
    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    if (canvas && container) {
      // Account for device pixel ratio to fix blurriness on high DPI displays
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      
      // Set display size (css pixels)
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${height}px`;
      
      // Set actual size in memory (scaled for device pixel ratio)
      canvas.width = rect.width * dpr;
      canvas.height = height * dpr;
      
      // Scale the context based on device pixel ratio
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      
      drawChart();
    }

    // Add resize observer to handle container size changes
    const resizeObserver = new ResizeObserver(() => {
      if (canvas && container) {
        const dpr = window.devicePixelRatio || 1;
        const rect = container.getBoundingClientRect();
        
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${height}px`;
        
        canvas.width = rect.width * dpr;
        canvas.height = height * dpr;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.scale(dpr, dpr);
        }
        
        drawChart();
      }
    });

    if (container) {
      resizeObserver.observe(container);
    }

    return () => {
      if (container) {
        resizeObserver.unobserve(container);
      }
    };
  }, [data, color, height, hoveredIndex, drawChart]);

  return (
    <div 
      className="line-chart" 
      ref={containerRef} 
      style={{ 
        height: '100%',
        position: 'relative',
        zIndex: 5,
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-start'
      }}
    >
      <canvas 
        ref={canvasRef} 
        className="line-chart-canvas"
        style={{
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      ></canvas>
      
      {activePoint && showTooltip && (
        <div 
          className={`line-chart-tooltip ${getTooltipPosition(activePoint.x, activePoint.y).position}`}
          style={{
            left: getTooltipPosition(activePoint.x, activePoint.y).left,
            top: getTooltipPosition(activePoint.x, activePoint.y).top
          }}
        >
          <div className="line-chart-tooltip-value">{formatValue(activePoint.value)}</div>
          <div className="line-chart-tooltip-time">{formatDate(activePoint.timestamp)}</div>
        </div>
      )}
    </div>
  );
}; 