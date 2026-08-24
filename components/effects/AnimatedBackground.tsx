'use client';

import { useEffect, useRef } from 'react';

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create floating orbs
    const orbs = [
      { x: 20, y: 30, r: 200, vx: 0.3, vy: 0.2, color: '124, 58, 237' },
      { x: 80, y: 70, r: 300, vx: -0.2, vy: 0.3, color: '168, 85, 247' },
      { x: 60, y: 80, r: 250, vx: 0.2, vy: -0.3, color: '236, 72, 153' },
      { x: 40, y: 50, r: 180, vx: -0.3, vy: -0.2, color: '59, 130, 246' },
      { x: 90, y: 20, r: 220, vx: 0.1, vy: 0.4, color: '139, 92, 246' },
    ];

    // Create network nodes
    const nodes = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2 + 1,
    }));

    function animate() {
      if (!ctx || !canvas) return;
      // Clear with fade effect
      ctx.fillStyle = 'rgba(3, 0, 20, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Animate and draw orbs
      orbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        // Bounce off edges
        if (orb.x < -orb.r || orb.x > 100 + orb.r) orb.vx *= -1;
        if (orb.y < -orb.r || orb.y > 100 + orb.r) orb.vy *= -1;

        const gradient = ctx.createRadialGradient(
          (orb.x / 100) * canvas.width,
          (orb.y / 100) * canvas.height,
          0,
          (orb.x / 100) * canvas.width,
          (orb.y / 100) * canvas.height,
          orb.r
        );
        gradient.addColorStop(0, `rgba(${orb.color}, 0.15)`);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      // Draw and connect nodes
      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;

        // Wrap around edges
        if (node.x < 0) node.x = canvas.width;
        if (node.x > canvas.width) node.x = 0;
        if (node.y < 0) node.y = canvas.height;
        if (node.y > canvas.height) node.y = 0;

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(139, 92, 246, 0.6)';
        ctx.fill();

        // Connect to nearby nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - node.x;
          const dy = nodes[j].y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
