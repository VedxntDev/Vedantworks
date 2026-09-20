import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

export interface GlowButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'glow' | 'glass' | 'outline' | 'shimmer';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  href?: string;
  target?: string;
  rel?: string;
  glowColor?: string;
  className?: string;
  title?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
}

export const GlowButton: React.FC<GlowButtonProps> = ({
  children,
  variant = 'glow',
  size = 'md',
  icon,
  iconPosition = 'left',
  href,
  target,
  rel,
  glowColor = '#10b981',
  className = '',
  title,
  onClick,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const baseClasses = `glow-button-root glow-btn-${variant} glow-btn-${size} ${className}`;

  const content = (
    <>
      {/* Background Radial Mouse Glow (Nova Glow effect) */}
      <span
        className="glow-btn-spotlight"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(120px circle at ${mousePosition.x}px ${mousePosition.y}px, ${glowColor}55, transparent 80%)`,
        }}
      />

      {/* Shimmer Light Beam Effect */}
      {variant === 'glow' || variant === 'shimmer' ? (
        <span className="glow-btn-shimmer" />
      ) : null}

      {/* Animated Aura Glow Ring */}
      <span
        className="glow-btn-aura"
        style={{
          boxShadow: isHovered
            ? `0 0 25px -3px ${glowColor}66, 0 0 10px ${glowColor}44`
            : `0 0 10px -2px ${glowColor}22`,
        }}
      />

      {/* Inner Content Layer */}
      <span className="glow-btn-content">
        {icon && iconPosition === 'left' && (
          <span className="glow-btn-icon left">{icon}</span>
        )}
        <span className="glow-btn-text">{children}</span>
        {icon && iconPosition === 'right' && (
          <span className="glow-btn-icon right">{icon}</span>
        )}
      </span>
    </>
  );

  const motionProps = {
    whileHover: { scale: 1.025, y: -1 },
    whileTap: { scale: 0.975 },
    transition: { type: 'spring' as const, stiffness: 450, damping: 25 },
    onMouseMove: handleMouseMove,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };

  if (href) {
    return (
      <motion.a
        ref={buttonRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel || (target === '_blank' ? 'noopener noreferrer' : undefined)}
        className={baseClasses}
        title={title}
        onClick={onClick as any}
        {...motionProps}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={buttonRef as React.RefObject<HTMLButtonElement>}
      className={baseClasses}
      title={title}
      onClick={onClick as any}
      {...motionProps}
      {...props}
    >
      {content}
    </motion.button>
  );
};

export default GlowButton;
