import React, { useState } from 'react';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { Splash } from './components/Splash';
import { Home } from './views/Home';
import { Locations } from './views/Locations';
import { Settings } from './views/Settings';
import { MetricDetail } from './views/MetricDetail';
import { motion, AnimatePresence } from 'framer-motion';

const AppContent = () => {
  const { currentPath, navigate } = useNavigation();
  const [splashComplete, setSplashComplete] = useState(false);

  const renderRoute = () => {
    if (currentPath.startsWith('/details/')) {
      return <MetricDetail />;
    }
    
    switch (currentPath) {
      case '/locations':
        return <Locations />;
      case '/settings':
        return <Settings />;
      case '/':
      default:
        return <Home />;
    }
  };

  return (
    <>
      {/* 1. Splash Screen Boot Loader */}
      <AnimatePresence>
        {!splashComplete && (
          <Splash onComplete={() => setSplashComplete(true)} />
        )}
      </AnimatePresence>

      {/* 2. Main App Content with 3D Page Transitions */}
      {splashComplete && (
        <div className="min-h-screen w-full relative flex flex-col pt-4">
          {/* Dynamic background ambient glow overlay (shifted by weather condition classes in index.css) */}
          <div className="absolute inset-0 ambient-glow-bg z-0" />
          
          <main className="relative z-10 flex-1 flex flex-col justify-start">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPath}
                initial={{ opacity: 0, rotateY: 10, scale: 0.97, x: 30 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1, x: 0 }}
                exit={{ opacity: 0, rotateY: -10, scale: 0.97, x: -30 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex-1 flex flex-col"
                style={{ transformStyle: 'preserve-3d', perspective: '1200px' }}
              >
                {renderRoute()}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Global responsive bottom navigation bar on mobile screens (as requested by brief) */}
          <div className="fixed bottom-0 inset-x-0 z-30 p-4 block md:hidden pointer-events-none">
            <div className="max-w-md mx-auto bg-card-bg/80 backdrop-blur-lg border border-border shadow-3d rounded-full flex items-center justify-around py-3 px-6 pointer-events-auto select-none">
              <button
                onClick={() => navigate('/')}
                className={`text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full transition-all ${
                  currentPath === '/' ? 'bg-accent text-[#FFFAF3] shadow-3d-inset' : 'text-text-muted hover:text-text'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => navigate('/locations')}
                className={`text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full transition-all ${
                  currentPath === '/locations' ? 'bg-accent text-[#FFFAF3] shadow-3d-inset' : 'text-text-muted hover:text-text'
                }`}
              >
                Saved
              </button>
              <button
                onClick={() => navigate('/settings')}
                className={`text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full transition-all ${
                  currentPath === '/settings' ? 'bg-accent text-[#FFFAF3] shadow-3d-inset' : 'text-text-muted hover:text-text'
                }`}
              >
                Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

function App() {
  return (
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  );
}

export default App;
