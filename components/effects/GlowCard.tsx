'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlowCard({ children, className = '' }: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlowPosition({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden rounded-3xl border border-border bg-background p-8 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none"
        style={{
          opacity: isHovered ? 0.15 : 0,
          background: `radial-gradient(600px circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(139, 92, 246, 0.4), transparent 40%)`,
        }}
      />

      {/* Animated border glow */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: `radial-gradient(600px circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(139, 92, 246, 0.3), transparent 40%)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
