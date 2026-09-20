import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { motion, useAnimationControls, useReducedMotion } from 'framer-motion';

export interface GlowLoaderProps {
  count?: number;
  size?: number;
  gap?: number;
  padding?: number | string;
  shape?: 'Circle' | 'Rounded' | 'Pill' | 'Diamond' | 'Square';
  speed?: number;
  glowSpread?: number;
  glowIntensity?: number;
  glowStyle?: 'Bloom' | 'Neon' | 'Strong' | 'Soft';
  colors?: string[];
  waveMode?: 'Default' | 'Reverse' | 'Mirror' | 'Bounce' | 'Random';
  direction?: 'Left→Right' | 'Right→Left' | 'Center→Out' | 'Edges→In';
  waveCurve?: 'Sine' | 'Ease' | 'Linear';
  colorMode?: 'Sequence' | 'Gradient' | 'Random';
  minScale?: number;
  maxScale?: number;
  wrap?: 'NoWrap' | 'Wrap';
  pauseOnHover?: boolean;
  respectReducedMotion?: boolean;
  seed?: number;
  className?: string;
  style?: React.CSSProperties;
}

const DEFAULT_COLORS = ['#10b981', '#34d399', '#6ee7b7', '#059669', '#14b8a6', '#06b6d4'];

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 1831565813) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function hexToRgb(hex: string) {
  const h = hex.trim();
  if (!h.startsWith('#')) return null;
  const s = h.slice(1);
  if (s.length === 3) {
    const r = parseInt(s[0] + s[0], 16);
    const g = parseInt(s[1] + s[1], 16);
    const b = parseInt(s[2] + s[2], 16);
    return { r, g, b };
  }
  if (s.length === 6) {
    const r = parseInt(s.slice(0, 2), 16);
    const g = parseInt(s.slice(2, 4), 16);
    const b = parseInt(s.slice(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

function mixHex(c1: string, c2: string, t: number) {
  const A = hexToRgb(c1);
  const B = hexToRgb(c2);
  if (!A || !B) return null;
  const r = Math.round(A.r + (B.r - A.r) * t);
  const g = Math.round(A.g + (B.g - A.g) * t);
  const b = Math.round(A.b + (B.b - A.b) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

function curveFn(mode: string) {
  if (mode === 'Sine') return (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * t);
  if (mode === 'Ease') return (t: number) => t * t * (3 - 2 * t);
  return (t: number) => t;
}

function basePhase(i: number, count: number, direction: string) {
  if (count <= 1) return 0;
  const maxIndex = count - 1;
  const center = maxIndex / 2;
  if (direction === 'Right→Left') return (maxIndex - i) / maxIndex;
  if (direction === 'Center→Out') return center === 0 ? 0 : Math.abs(i - center) / center;
  if (direction === 'Edges→In') return center === 0 ? 0 : (center - Math.abs(i - center)) / center;
  return i / maxIndex;
}

function applyWaveMode(t: number, mode: string) {
  const x = clamp01(t);
  if (mode === 'Reverse') return 1 - x;
  if (mode === 'Mirror') return Math.abs(x - 0.5) * 2;
  if (mode === 'Bounce') return x <= 0.5 ? x * 2 : (1 - x) * 2;
  return x;
}

function buildGlow(color: string, spread: number, intensity: number, style: string) {
  const s = Math.max(0, spread);
  const k = Math.max(0, intensity);
  if (s === 0 || k === 0) return 'none';

  const soft = [`0 0 ${s * 0.7}px ${color}`, `0 0 ${s * 1.2}px ${color}`];
  const strong = [`0 0 ${s * 0.6}px ${color}`, `0 0 ${s * 1.3}px ${color}`, `0 0 ${s * 2}px ${color}`];
  const neon = [
    `0 0 ${s * 0.5}px ${color}`,
    `0 0 ${s * 1}px ${color}`,
    `0 0 ${s * 1.8}px ${color}`,
    `0 0 ${s * 2.8}px ${color}`,
  ];
  const bloom = [
    `0 0 ${s * 0.8}px ${color}`,
    `0 0 ${s * 1.6}px ${color}`,
    `0 0 ${s * 2.6}px ${color}`,
    `0 0 ${s * 4}px ${color}`,
  ];

  const layers = style === 'Bloom' ? bloom : style === 'Neon' ? neon : style === 'Strong' ? strong : soft;
  const scaled = layers.map((layer, idx) => {
    const mult = idx === 0 ? 1 : 1 + k * 0.25 * idx;
    return layer.replace(/0 0 ([\d.]+)px/g, (_, n) => `0 0 ${Number(n) * mult}px`);
  });
  return scaled.join(', ');
}

function getColorForIndex(
  i: number,
  count: number,
  colors: string[],
  mode: string,
  randFor: (idx: number) => number
) {
  const list = colors.length > 0 ? colors : DEFAULT_COLORS;
  if (mode === 'Random') {
    const r = randFor(i);
    const idx = Math.floor(r * list.length) % list.length;
    return list[idx] || '#10b981';
  }
  if (mode === 'Gradient') {
    if (list.length === 1) return list[0];
    const t = count <= 1 ? 0 : i / (count - 1);
    const p = t * (list.length - 1);
    const a = Math.floor(p);
    const b = Math.min(list.length - 1, a + 1);
    const localT = p - a;
    const mixed = mixHex(list[a], list[b], localT);
    return mixed || list[i % list.length] || '#10b981';
  }
  return list[i % list.length] || '#10b981';
}

const Dot: React.FC<{
  paused: boolean;
  reduceMotion: boolean;
  duration: number;
  delay: number;
  minScale: number;
  maxScale: number;
  style: React.CSSProperties;
}> = ({ paused, reduceMotion, duration, delay, minScale, maxScale, style }) => {
  const controls = useAnimationControls();

  useEffect(() => {
    if (reduceMotion) {
      controls.set({ scale: 1 });
      return;
    }
    if (paused) {
      controls.stop();
      return;
    }
    controls.start({
      scale: [minScale, maxScale, minScale],
      transition: {
        duration,
        ease: 'easeInOut',
        repeat: Infinity,
        delay,
      },
    });
  }, [paused, reduceMotion, duration, delay, minScale, maxScale, controls]);

  return <motion.div style={style} animate={controls} />;
};

export const GlowLoader: React.FC<GlowLoaderProps> = ({
  count = 6,
  size = 14,
  gap = 14,
  padding = 0,
  shape = 'Circle',
  speed = 1.3,
  glowSpread = 16,
  glowIntensity = 1.5,
  glowStyle = 'Neon',
  colors = ['#10b981', '#34d399', '#6ee7b7', '#14b8a6', '#06b6d4'],
  waveMode = 'Default',
  direction = 'Left→Right',
  waveCurve = 'Sine',
  colorMode = 'Gradient',
  minScale = 0.45,
  maxScale = 1.45,
  wrap = 'NoWrap',
  pauseOnHover = false,
  respectReducedMotion = true,
  seed = 42,
  className = '',
  style = {},
}) => {
  const reducedMotion = useReducedMotion();
  const shouldReduce = Boolean(respectReducedMotion && reducedMotion);
  const safeCount = Math.max(1, Math.round(count));
  const safeSpeed = Math.max(0.05, speed);
  const duration = 1.5 / safeSpeed;
  const sMin = Math.max(0.05, Math.min(minScale, maxScale));
  const sMax = Math.max(sMin, maxScale);
  const isWrap = wrap === 'Wrap';
  const curve = useMemo(() => curveFn(waveCurve), [waveCurve]);

  const randFor = useCallback(
    (idx: number) => {
      const r = mulberry32(((Math.floor(seed) || 1) + idx * 9973) >>> 0);
      return r();
    },
    [seed]
  );

  const palette = Array.isArray(colors) && colors.length > 0 ? colors : DEFAULT_COLORS;
  const [hovered, setHovered] = useState(false);
  const paused = Boolean(pauseOnHover && hovered);

  return (
    <div
      className={`glow-loader-wrapper ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding,
        ...style,
      }}
      onMouseEnter={pauseOnHover ? () => setHovered(true) : undefined}
      onMouseLeave={pauseOnHover ? () => setHovered(false) : undefined}
    >
      <div
        style={{
          display: 'flex',
          gap,
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          flexWrap: isWrap ? 'wrap' : 'nowrap',
        }}
      >
        {Array.from({ length: safeCount }).map((_, i) => {
          const color = getColorForIndex(i, safeCount, palette, colorMode, randFor);
          const isPill = shape === 'Pill';
          const dotWidth = isPill ? size * 2 : size;
          const dotHeight = size;

          let borderRadius: string | number = 0;
          let transform = 'none';

          if (shape === 'Circle') borderRadius = '50%';
          else if (shape === 'Rounded') borderRadius = size / 3;
          else if (shape === 'Pill') borderRadius = size;
          else if (shape === 'Diamond') transform = 'rotate(45deg)';

          const shadow = buildGlow(color, glowSpread, glowIntensity, glowStyle);
          let t0 = basePhase(i, safeCount, direction);
          if (waveMode === 'Random') t0 = randFor(i);
          else t0 = applyWaveMode(t0, waveMode);

          const delay = curve(clamp01(t0)) * duration;

          const dotStyle: React.CSSProperties = {
            width: dotWidth,
            height: dotHeight,
            background: color,
            boxShadow: shadow,
            flex: '0 0 auto',
            borderRadius,
            transform,
          };

          return (
            <Dot
              key={`glow-dot-${i}`}
              paused={paused}
              reduceMotion={shouldReduce}
              duration={duration}
              delay={delay}
              minScale={sMin}
              maxScale={sMax}
              style={dotStyle}
            />
          );
        })}
      </div>
    </div>
  );
};

export default GlowLoader;
