'use client';

import { motion } from 'framer-motion';

interface GradientOrbProps {
  className?: string;
  color?: string;
  size?: number;
  delay?: number;
}

export function GradientOrb({ className = '', color = '#8B5CF6', size = 400, delay = 0 }: GradientOrbProps) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl opacity-30 ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
      }}
      animate={{
        scale: [1, 1.2, 1],
        x: [0, 30, -30, 0],
        y: [0, -20, 20, 0],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}
