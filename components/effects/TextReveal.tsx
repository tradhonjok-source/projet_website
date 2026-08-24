'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

export function TextReveal({ text, className = '', delay = 0 }: TextRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const words = text.split(' ');

  return (
    <span ref={ref} className={`inline-flex flex-wrap gap-x-2 ${className}`}>
      {words.map((word, wordIndex) => (
        <span
          key={wordIndex}
          className="inline-flex overflow-hidden"
          style={{ transitionDelay: `${delay + wordIndex * 0.1}s` }}
        >
          <motion.span
            initial={{ y: '100%', opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{
              duration: 0.8,
              delay: delay + wordIndex * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="inline-block whitespace-nowrap"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
