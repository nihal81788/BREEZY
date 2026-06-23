import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export const Splash = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500); // Complete splash after 2.5 seconds
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onClick={onComplete}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg select-none cursor-pointer"
    >
      <div className="flex flex-col items-center max-w-sm px-6 text-center">
        {/* Animated Horizon & Sun SVG */}
        <svg
          width="120"
          height="80"
          viewBox="0 0 120 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mb-6 overflow-visible"
        >
          {/* Rising Sun */}
          <motion.circle
            cx="60"
            cy="45"
            r="16"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="3"
            initial={{ cy: 65, opacity: 0 }}
            animate={{ cy: 35, opacity: 1 }}
            transition={{
              delay: 0.3,
              duration: 1.2,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
          
          {/* Sun Rays */}
          <motion.path
            d="M60 10V18 M60 52V60 M35 35H43 M77 35H85 M42 17L48 23 M78 53L72 47 M42 53L48 47 M78 17L72 23"
            stroke="var(--accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{
              delay: 0.9,
              duration: 0.8,
              ease: "easeOut",
            }}
          />

          {/* Horizon Line drawing itself */}
          <motion.line
            x1="10"
            y1="55"
            x2="110"
            y2="55"
            stroke="var(--text)"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 1.0,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        </svg>

        {/* Brand Text */}
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: 0.5,
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="font-display font-bold text-4xl tracking-tight text-text mb-1"
          >
            BREEZY
          </motion.h1>
        </div>


        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1.8, duration: 0.4 }}
          className="mt-12 text-[10px] text-text-muted"
        >
          Click anywhere to skip
        </motion.span>
      </div>
    </motion.div>
  );
};
