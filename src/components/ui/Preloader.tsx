import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlowLoader } from './GlowLoader';

export interface PreloaderProps {
  onComplete?: () => void;
  minDisplayTime?: number;
}

export const Preloader: React.FC<PreloaderProps> = ({
  onComplete,
  minDisplayTime = 1400,
}) => {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const calculatedProgress = Math.min(Math.round((elapsed / minDisplayTime) * 100), 100);
      setProgress(calculatedProgress);

      if (elapsed >= minDisplayTime) {
        clearInterval(interval);
        setTimeout(() => {
          setIsLoaded(true);
          if (onComplete) onComplete();
        }, 200);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [minDisplayTime, onComplete]);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          className="preloader-overlay"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            y: -30,
            transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } 
          }}
        >
          {/* Ambient Glow Background Effect */}
          <div className="preloader-glow-orb" />

          <motion.div 
            className="preloader-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Framer GlowLoader */}
            <div className="preloader-loader-box">
              <GlowLoader
                count={6}
                size={12}
                gap={12}
                shape="Circle"
                speed={1.4}
                glowSpread={18}
                glowIntensity={1.8}
                glowStyle="Neon"
                colors={['#10b981', '#34d399', '#6ee7b7', '#14b8a6', '#06b6d4', '#10b981']}
                direction="Left→Right"
                waveMode="Default"
              />
            </div>

            {/* Brand Title & Percentage Counter */}
            <div className="preloader-meta">
              <span className="preloader-brand">
                VEDANT<span className="preloader-dot">.</span>
              </span>
              <span className="preloader-count">{progress}%</span>
            </div>

            {/* Progress Bar Track */}
            <div className="preloader-bar-track">
              <motion.div 
                className="preloader-bar-fill" 
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
