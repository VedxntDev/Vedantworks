import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionValueEvent, MotionValue } from 'framer-motion';

export interface TextRevealOnScrollProps {
  text: string;
  mutedColor?: string;
  primaryColor?: string;
  mode?: 'word' | 'character' | 'sentence';
  replay?: boolean;
  balance?: boolean;
  className?: string;
  style?: React.CSSProperties;
  transitionDuration?: number;
}

const RevealItem: React.FC<{
  children: React.ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
  mutedColor: string;
  primaryColor: string;
}> = ({ children, progress, range, mutedColor, primaryColor }) => {
  const color = useTransform(progress, range, [mutedColor, primaryColor]);
  const opacity = useTransform(progress, range, [0.25, 1]);
  const y = useTransform(progress, range, [3, 0]);

  return (
    <motion.span
      style={{
        color,
        opacity,
        y,
        display: 'inline-block',
        transition: 'color 0.15s ease-out, opacity 0.15s ease-out',
      }}
    >
      {children}
    </motion.span>
  );
};

export const TextRevealOnScroll: React.FC<TextRevealOnScrollProps> = ({
  text,
  mutedColor = 'rgba(156, 163, 175, 0.28)',
  primaryColor = 'var(--text-primary, #f9fafb)',
  mode = 'word',
  replay = true,
  balance = true,
  className = '',
  style = {},
  transitionDuration = 0.4,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 90%', 'end 40%'],
  });

  const maxProgress = useMotionValue(0);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest > maxProgress.get()) {
      maxProgress.set(latest);
    }
  });

  const sourceProgress = replay ? scrollYProgress : maxProgress;
  const progressToUse = useSpring(sourceProgress, {
    stiffness: 170 / (transitionDuration * transitionDuration),
    damping: 26 / transitionDuration,
    mass: 1,
    restDelta: 0.001,
  });

  const renderText = () => {
    if (!text) return null;
    let items: string[] = [];

    if (mode === 'character') {
      items = text.split('');
    } else if (mode === 'word') {
      items = text.match(/([\S]+|\s+)/g) || [];
    } else if (mode === 'sentence') {
      items = text.match(/[^.!?\n]+(?:[.!?]+)?|\n|\s+/g) || [];
    }

    let totalValids = 0;
    items.forEach((item) => {
      if (item.trim().length > 0) totalValids++;
    });

    let currentIdx = 0;

    return items.map((itemStr, idx) => {
      if (itemStr.trim().length === 0 && itemStr !== '\n') {
        return <React.Fragment key={`${mode}-space-${idx}`}>{itemStr}</React.Fragment>;
      }
      if (itemStr === '\n') {
        return <br key={`${mode}-br-${idx}`} />;
      }

      const start = currentIdx / Math.max(totalValids, 1);
      const end = (currentIdx + 1) / Math.max(totalValids, 1);
      currentIdx++;

      return (
        <RevealItem
          key={`${mode}-${idx}`}
          progress={progressToUse}
          range={[start, end]}
          mutedColor={mutedColor}
          primaryColor={primaryColor}
        >
          {itemStr}
        </RevealItem>
      );
    });
  };

  return (
    <motion.div
      ref={containerRef}
      className={`text-reveal-container ${className}`}
      role="region"
      aria-label={text}
      style={{
        display: 'block',
        textWrap: balance ? 'balance' : 'wrap',
        whiteSpace: 'pre-wrap',
        color: mutedColor,
        ...style,
      }}
    >
      <span aria-hidden="true">{renderText()}</span>
    </motion.div>
  );
};

export default TextRevealOnScroll;
