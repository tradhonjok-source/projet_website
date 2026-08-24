'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    imageUrl: '/images/slideshow/admin.jpg',
    title: 'ADMINISTRATEUR AGRÉÉ',
    color: 'from-amber-500 to-orange-500',
  },
  {
    imageUrl: '/images/slideshow/recrutement.jpg',
    title: 'RECRUTEMENT INTERNATIONAL',
    color: 'from-violet-500 to-purple-500',
  },
  {
    imageUrl: '/images/slideshow/lobbying.jpg',
    title: 'LOBBYING INTERNATIONAL',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    imageUrl: '/images/slideshow/lobbying-national.jpg',
    title: 'ENSEMBLE POUR L\'EXCELLENCE',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    imageUrl: '/images/slideshow/monde.jpg',
    title: 'PRÉSENCE DANS LE MONDE',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    imageUrl: '/images/slideshow/recrutement-missions.jpg',
    title: 'MISSIONS DE RECRUTEMENT À VENIR',
    subtitle: 'PARIS - MADRID - ABIDJAN - MEXICO CITY',
    color: 'from-rose-500 to-pink-500',
  },
  {
    imageUrl: '/timothe/franchise/franchise.jpeg',
    title: 'OPPORTUNITÉ DE FRANCHISES À TRAVERS LE MONDE',
    color: 'from-amber-500 to-orange-500',
  },
];

export function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      {/* Slideshow Container - Rectangle */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-border/50">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            {/* Image */}
            <div
              className={`absolute inset-0 bg-cover ${
                currentSlide === 0 ? 'bg-[center_25%]' : 'bg-center'
              }`}
              style={{ backgroundImage: `url(${slides[currentSlide].imageUrl})` }}
            />

            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t ${slides[currentSlide].color} opacity-40`} />
            <div className="absolute inset-0 bg-black/30" />

            {/* Title Overlay */}
            <div className="absolute inset-0 flex items-end justify-center pb-8">
              <div className="text-center px-4">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-2xl"
                >
                  {slides[currentSlide].title}
                </motion.h2>
                {slides[currentSlide].subtitle && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-lg sm:text-xl md:text-2xl text-white/90 mt-2 font-medium drop-shadow-lg"
                  >
                    {slides[currentSlide].subtitle}
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Diapositive ${index + 1}`}
            />
          ))}
        </div>

        {/* Progress Indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <motion.div
            className="h-full bg-white"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            key={currentSlide}
          />
        </div>
      </div>

      {/* Slide Indicators with Labels */}
      <div className="flex justify-center gap-2 mt-4">
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              index === currentSlide
                ? `bg-gradient-to-r ${slide.color} text-white`
                : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
            }`}
          >
            {slide.title}
          </button>
        ))}
      </div>
    </div>
  );
}
