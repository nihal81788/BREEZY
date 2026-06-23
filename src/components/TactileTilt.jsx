import React, { useRef, useState, useEffect } from 'react';

export const TactileTilt = ({ children, className = '', maxTilt = 12, clickScale = 0.98 }) => {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({});
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // Check user preference for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const listener = (e) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const handleMouseMove = (e) => {
    if (isReducedMotion || !cardRef.current) return;

    const el = cardRef.current;
    const rect = el.getBoundingClientRect();

    // Mouse coordinates relative to card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation angles (in degrees)
    // rotateX depends on vertical offset (tilts up/down)
    // rotateY depends on horizontal offset (tilts left/right)
    const rotateX = ((centerY - y) / centerY) * maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setStyle({
      '--rx': `${rotateX.toFixed(2)}deg`,
      '--ry': `${rotateY.toFixed(2)}deg`,
      transition: 'transform 0.05s ease-out', // Super snappy follow
    });
  };

  const handleMouseLeave = () => {
    // Smooth reset
    setStyle({
      '--rx': '0deg',
      '--ry': '0deg',
      transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={`card-3d-tilt-container ${className}`}
    >
      <div className="card-3d-tilt h-full w-full">
        {children}
      </div>
    </div>
  );
};
