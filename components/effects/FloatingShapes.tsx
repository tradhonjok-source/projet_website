'use client';

import { motion } from 'framer-motion';

export function FloatingShapes() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Floating squares */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-24 h-24 rounded-lg border border-primary/20"
        animate={{
          rotate: [0, 360],
          y: [0, -30, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ opacity: 0.1 }}
      />

      <motion.div
        className="absolute top-3/4 right-1/4 w-32 h-32 rounded-full border border-accent/20"
        animate={{
          rotate: [360, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ opacity: 0.1 }}
      />

      <motion.div
        className="absolute bottom-1/4 left-1/3 w-16 h-16 rounded-lg border border-primary/30"
        animate={{
          rotate: [0, 180, 360],
          y: [0, -50, 0],
          x: [0, -30, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{ opacity: 0.15 }}
      />

      {/* Large gradient blobs */}
      <motion.div
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
