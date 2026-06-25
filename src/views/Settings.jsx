import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { ArrowLeft, Sun, Moon, Laptop, ShieldAlert, Thermometer, Compass, Info } from 'lucide-react';
import { TactileTilt } from '../components/TactileTilt';

export const Settings = () => {
  const { 
    navigate, 
    theme, 
    setTheme, 
    units, 
    setUnits, 
  } = useNavigation();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Header Row */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="p-3 bg-card-bg border border-border rounded-full text-text shadow-3d-inset hover:shadow-3d card-3d-interactive transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display font-bold text-3xl tracking-tight">Settings</h1>
          <p className="text-sm text-text-muted">Configure your Breezy workspace</p>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. Unit Preferences */}
        <TactileTilt maxTilt={8}>
          <div className="card-3d p-6 h-full flex flex-col justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-accent-soft text-accent rounded-2xl">
                <Thermometer className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-text">Unit System</h2>
                <p className="text-xs text-text-muted">Choose units for temperature & wind speeds</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setUnits('celsius')}
                className={`py-3 px-4 rounded-2xl border font-semibold text-sm transition-all duration-200 ${
                  units === 'celsius'
                    ? 'bg-accent text-[#FFFAF3] border-accent shadow-3d-inset'
                    : 'bg-bg/40 text-text border-border hover:bg-bg'
                }`}
              >
                Metric (°C, km/h)
              </button>
              <button
                onClick={() => setUnits('fahrenheit')}
                className={`py-3 px-4 rounded-2xl border font-semibold text-sm transition-all duration-200 ${
                  units === 'fahrenheit'
                    ? 'bg-accent text-[#FFFAF3] border-accent shadow-3d-inset'
                    : 'bg-bg/40 text-text border-border hover:bg-bg'
                }`}
              >
                Imperial (°F, mph)
              </button>
            </div>
          </div>
        </TactileTilt>

        {/* 2. Theme Selection */}
        <TactileTilt maxTilt={8}>
          <div className="card-3d p-6 h-full flex flex-col justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-accent-soft text-accent rounded-2xl">
                <Sun className="w-6 h-6 dark:hidden" />
                <Moon className="w-6 h-6 hidden dark:block" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-text">Color Theme</h2>
                <p className="text-xs text-text-muted">Select how Breezy appears on your device</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`flex flex-col items-center gap-1.5 py-3.5 rounded-2xl border font-semibold text-xs transition-all duration-200 ${
                  theme === 'light'
                    ? 'bg-accent text-[#FFFAF3] border-accent shadow-3d-inset'
                    : 'bg-bg/40 text-text border-border hover:bg-bg'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>Light</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex flex-col items-center gap-1.5 py-3.5 rounded-2xl border font-semibold text-xs transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-accent text-[#FFFAF3] border-accent shadow-3d-inset'
                    : 'bg-bg/40 text-text border-border hover:bg-bg'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Dark</span>
              </button>
              <button
                onClick={() => setTheme('auto')}
                className={`flex flex-col items-center gap-1.5 py-3.5 rounded-2xl border font-semibold text-xs transition-all duration-200 ${
                  theme === 'auto'
                    ? 'bg-accent text-[#FFFAF3] border-accent shadow-3d-inset'
                    : 'bg-bg/40 text-text border-border hover:bg-bg'
                }`}
              >
                <Laptop className="w-4 h-4" />
                <span>Auto</span>
              </button>
            </div>
          </div>
        </TactileTilt>


        {/* 4. About App */}
        <TactileTilt maxTilt={8}>
          <div className="card-3d p-6 h-full flex flex-col justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-accent-soft text-accent rounded-2xl">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-text">About Breezy</h2>
                <p className="text-xs text-text-muted">Application metadata and technology</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-xs border-t border-border pt-4">
              <div className="flex justify-between py-1">
                <span className="text-text-muted">Version</span>
                <span className="font-mono font-semibold">1.0.0 (Beta)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-text-muted">Engine</span>
                <span className="font-mono font-semibold">Three.js / React 19</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-text-muted">Creator</span>
                <a href="#" className="text-accent font-semibold hover:underline flex items-center gap-1">
                  Nihal Kumar
                </a>
              </div>
            </div>
          </div>
        </TactileTilt>

      </div>
    </div>
  );
};
