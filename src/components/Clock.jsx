import React, { useEffect, useRef } from 'react';

export const Clock = () => {
  const clockRef = useRef(null);

  useEffect(() => {
    const updateTime = () => {
      if (!clockRef.current) return;
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      clockRef.current.innerText = `${hrs}:${mins}:${secs}`;
    };

    updateTime(); // Initial update
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      className="px-4 py-1.5 bg-bg/50 border border-border rounded-full font-mono text-sm tracking-widest text-accent font-bold flex items-center justify-center min-w-[100px] select-none shadow-sm"
    >
      <span ref={clockRef}>00:00:00</span>
    </div>
  );
};
