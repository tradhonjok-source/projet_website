'use client';

import { AnimatedBackground } from './AnimatedBackground';
import { FloatingShapes } from './FloatingShapes';
import { GradientOrb } from './GradientOrb';

export function VideoBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Base animated gradient background */}
      <div className="absolute inset-0 animated-gradient-bg" />

      {/* Canvas-based network animation */}
      <AnimatedBackground />

      {/* Floating geometric shapes */}
      <FloatingShapes />

      {/* Additional gradient orbs */}
      <GradientOrb color="#7c3aed" size={600} delay={0} />
      <GradientOrb color="#a855f7" size={500} delay={3} />
      <GradientOrb color="#ec4899" size={400} delay={6} />

      {/* Subtle noise texture overlay for film-like quality */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
