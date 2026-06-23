import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, X, MapPin, History, Sun, Moon, Cloud, CloudRain, CloudLightning, CloudSnow, Wind } from 'lucide-react';
import { searchCities } from '../services/weatherService';
import { useNavigation } from '../context/NavigationContext';

const WEATHER_ICONS = {
  'clear-day': Sun,
  'clear-night': Moon,
  'cloudy': Cloud,
  'rain': CloudRain,
  'storm': CloudLightning,
  'snow': CloudSnow,
  'fog': Wind,
};

export const Search = ({ isOpen, onClose }) => {
  const { navigate, setActiveCityKey, formatTemp } = useNavigation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [recents, setRecents] = useState(() => {
    const saved = localStorage.getItem('breezy-recent-searches');
    return saved ? JSON.parse(saved) : ['london', 'tokyo', 'delhi', 'bangalore'];
  });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  // Sync recents to localStorage
  useEffect(() => {
    localStorage.setItem('breezy-recent-searches', JSON.stringify(recents));
  }, [recents]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Autofocus input
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Query search runner
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      const matches = await searchCities(query);
      setResults(matches);
      setLoading(false);
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const selectCity = (cityKey) => {
    setActiveCityKey(cityKey);
    // Add to recents
    if (!recents.includes(cityKey)) {
      setRecents([cityKey, ...recents.slice(0, 4)]);
    } else {
      setRecents([cityKey, ...recents.filter(c => c !== cityKey)]);
    }
    onClose();
    navigate('/');
  };

  const removeRecent = (e, cityKey) => {
    e.stopPropagation();
    setRecents(recents.filter(c => c !== cityKey));
  };

  const getConditionIcon = (condition) => {
    const Icon = WEATHER_ICONS[condition] || Sun;
    return <Icon className="w-5 h-5 text-accent" />;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-bg/85 backdrop-blur-md flex justify-center p-4 md:p-12 overflow-y-auto"
        >
          <motion.div
            initial={{ y: 50, scale: 0.95, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 50, scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="w-full max-w-2xl bg-card-bg border border-border shadow-3d rounded-3d p-6 md:p-8 self-start mt-6 md:mt-12 flex flex-col gap-6"
          >
            {/* Search Input Bar */}
            <div className="flex items-center justify-between border-b border-border pb-4 gap-4">
              <div className="flex items-center gap-3 flex-1">
                <SearchIcon className="w-6 h-6 text-text-muted" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search city (e.g. Tokyo, London, Reykjavik...)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="bg-transparent text-xl font-sans text-text placeholder-text-muted w-full focus:outline-none"
                />
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-bg rounded-full text-text-muted hover:text-text transition-colors card-3d-interactive border border-transparent hover:border-border"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Recents Searches */}
            {!query && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-text-muted text-xs tracking-wider uppercase font-semibold">
                  <History className="w-3.5 h-3.5" />
                  <span>Recent Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recents.map((cityKey) => (
                    <div
                      key={cityKey}
                      onClick={() => selectCity(cityKey)}
                      className="group flex items-center gap-2 px-3 py-1.5 bg-bg border border-border hover:border-accent hover:text-accent rounded-full text-sm font-medium cursor-pointer transition-all duration-200 card-3d-interactive"
                    >
                      <span className="capitalize">{cityKey.replace('newyork', 'New York')}</span>
                      <button
                        onClick={(e) => removeRecent(e, cityKey)}
                        className="opacity-40 group-hover:opacity-100 p-0.5 hover:bg-accent-soft hover:text-accent rounded-full transition-all"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {recents.length === 0 && (
                    <span className="text-text-muted text-sm italic">No recent searches</span>
                  )}
                </div>
              </div>
            )}

            {/* Autocomplete / Filtered Results */}
            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12 gap-3 text-text-muted">
                  <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  <span>Scanning horizons...</span>
                </div>
              ) : results.length > 0 ? (
                results.map((city) => (
                  <div
                    key={city.key}
                    onClick={() => selectCity(city.key)}
                    className="flex items-center justify-between p-4 bg-bg/50 hover:bg-bg border border-border hover:border-accent rounded-2xl cursor-pointer transition-all duration-200 group card-3d-interactive"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" />
                      <div>
                        <div className="font-semibold text-text group-hover:text-accent transition-colors">
                          {city.name}
                        </div>
                        <div className="text-xs text-text-muted">
                          {city.country} • {city.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getConditionIcon(city.condition)}
                      <span className="font-display font-bold text-lg text-text">
                        {formatTemp(city.temp)}
                      </span>
                    </div>
                  </div>
                ))
              ) : query.trim() ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-text-muted">
                  <div className="text-4xl mb-3">🌫️</div>
                  <div className="font-semibold text-text mb-1">Horizon lost in fog</div>
                  <div className="text-xs">We couldn't find matches for "{query}". Try London, Cairo, or Reykjavik.</div>
                </div>
              ) : null}
            </div>

            {/* Hint footer */}
            <div className="text-[10px] text-text-muted border-t border-border pt-4 text-center select-none">
              Press <kbd className="px-1.5 py-0.5 bg-bg border border-border rounded font-mono text-[9px]">ESC</kbd> to close.
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
