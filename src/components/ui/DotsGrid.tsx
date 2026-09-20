import React, { useEffect, useRef, useState, useCallback } from 'react';

export interface DotsGridProps {
  gridType?: 'dots' | 'dots-lines' | 'lines' | 'plus' | 'plus-lines';
  dotColor?: string;
  dotSize?: number;
  spacing?: number;
  proximityRadius?: number;
  maxOpacity?: number;
  backgroundOpacity?: number;
  fadeDelay?: number;
  showBackground?: boolean;
  backgroundColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const DotsGrid: React.FC<DotsGridProps> = ({
  gridType = 'dots-lines',
  dotColor = 'rgba(156, 163, 175, 0.45)',
  dotSize = 2.5,
  spacing = 44,
  proximityRadius = 180,
  maxOpacity = 0.9,
  backgroundOpacity = 0.12,
  fadeDelay = 600,
  showBackground = false,
  backgroundColor = 'transparent',
  className = '',
  style = {},
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mousePos = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const fadingDots = useRef<Map<string, number>>(new Map());
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Handle Resize
  const updateDimensions = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    setDimensions({ width: clientWidth, height: clientHeight });
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions]);

  // Track Mouse Movement across window
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mousePos.current = { x: -1000, y: -1000 };
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Canvas Render Loop for 60fps buttery smooth performance
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0 || dimensions.height === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);

    const render = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      if (showBackground && backgroundColor) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, dimensions.width, dimensions.height);
      }

      const now = Date.now();
      const cols = Math.ceil(dimensions.width / spacing) + 1;
      const rows = Math.ceil(dimensions.height / spacing) + 1;

      // Draw Grid Lines if applicable
      if (gridType === 'lines' || gridType === 'dots-lines' || gridType === 'plus-lines') {
        ctx.lineWidth = 1;
        
        // Vertical lines
        for (let i = 0; i <= cols; i++) {
          const x = i * spacing;
          ctx.beginPath();
          ctx.strokeStyle = dotColor;
          ctx.globalAlpha = backgroundOpacity;
          ctx.moveTo(x, 0);
          ctx.lineTo(x, dimensions.height);
          ctx.stroke();
        }

        // Horizontal lines
        for (let j = 0; j <= rows; j++) {
          const y = j * spacing;
          ctx.beginPath();
          ctx.strokeStyle = dotColor;
          ctx.globalAlpha = backgroundOpacity;
          ctx.moveTo(0, y);
          ctx.lineTo(dimensions.width, y);
          ctx.stroke();
        }
      }

      // Draw Dots / Plus symbols with dynamic mouse proximity lighting
      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = i * spacing;
          const y = j * spacing;
          const dotKey = `${i}-${j}`;

          const dist = Math.hypot(mousePos.current.x - x, mousePos.current.y - y);
          let currentOpacity = backgroundOpacity;

          if (dist <= proximityRadius) {
            const proximityFactor = 1 - dist / proximityRadius;
            currentOpacity = backgroundOpacity + proximityFactor * (maxOpacity - backgroundOpacity);
            fadingDots.current.set(dotKey, now);
          } else if (fadeDelay > 0 && fadingDots.current.has(dotKey)) {
            const lastActive = fadingDots.current.get(dotKey)!;
            const elapsed = now - lastActive;
            if (elapsed < fadeDelay) {
              const fadeFactor = 1 - elapsed / fadeDelay;
              currentOpacity = backgroundOpacity + fadeFactor * (maxOpacity - backgroundOpacity);
            } else {
              fadingDots.current.delete(dotKey);
            }
          }

          ctx.globalAlpha = Math.min(Math.max(currentOpacity, 0), 1);

          if (gridType === 'dots' || gridType === 'dots-lines') {
            ctx.beginPath();
            ctx.arc(x, y, dotSize, 0, Math.PI * 2);
            ctx.fillStyle = dotColor;
            ctx.fill();

            // Glowing halo on close proximity
            if (dist < proximityRadius * 0.45) {
              ctx.beginPath();
              ctx.arc(x, y, dotSize * 2.2, 0, Math.PI * 2);
              ctx.fillStyle = dotColor;
              ctx.globalAlpha = currentOpacity * 0.3;
              ctx.fill();
            }
          } else if (gridType === 'plus' || gridType === 'plus-lines') {
            const size = dotSize * 2.5;
            ctx.strokeStyle = dotColor;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(x - size, y);
            ctx.lineTo(x + size, y);
            ctx.moveTo(x, y - size);
            ctx.lineTo(x, y + size);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [dimensions, spacing, proximityRadius, maxOpacity, backgroundOpacity, fadeDelay, dotColor, dotSize, gridType, showBackground, backgroundColor]);

  return (
    <div
      ref={containerRef}
      className={`dots-grid-container ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

export default DotsGrid;
