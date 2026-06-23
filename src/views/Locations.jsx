import React, { useState, useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { getWeatherForCity } from '../services/weatherService';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Trash2, Sun, Moon, Cloud, CloudRain, CloudLightning, CloudSnow, Wind, MapPin } from 'lucide-react';
import { Search } from './Search';
import { TactileTilt } from '../components/TactileTilt';

const WEATHER_ICONS = {
  'clear-day': Sun,
  'clear-night': Moon,
  'cloudy': Cloud,
  'rain': CloudRain,
  'storm': CloudLightning,
  'snow': CloudSnow,
  'fog': Wind,
};

const WEATHER_BG_GRADS = {
  'clear-day': 'from-[#FFF8F0] to-[#FDEBD9]',
  'clear-night': 'from-[#FDF6EE] to-[#FCF1E7]',
  'cloudy': 'from-[#FCF1E7] to-[#FDEBD9]',
  'rain': 'from-[#FFFAF3] to-[#FCF1E7]',
  'storm': 'from-[#FDEBD9] to-[#F3DDBF]',
  'snow': 'from-[#FFFAF3] to-[#FFF8F0]',
  'fog': 'from-[#FDF6EE] to-[#F3DDBF]',
};

export const Locations = () => {
  const { 
    savedCities, 
    removeSavedCity, 
    setActiveCityKey, 
    navigate, 
    formatTemp 
  } = useNavigation();

  const [citiesData, setCitiesData] = useState({});
  const [searchOpen, setSearchOpen] = useState(false);

  // Load weather for all saved cities
  useEffect(() => {
    const fetchAll = async () => {
      const dataMap = {};
      await Promise.all(
        savedCities.map(async (key) => {
          try {
            const data = await getWeatherForCity(key);
            dataMap[key] = data;
          } catch (e) {
            console.error(e);
          }
        })
      );
      setCitiesData(dataMap);
    };
    fetchAll();
  }, [savedCities]);

  const selectCity = (cityKey) => {
    setActiveCityKey(cityKey);
    navigate('/');
  };

  const getConditionIcon = (condition) => {
    const Icon = WEATHER_ICONS[condition] || Sun;
    return <Icon className="w-8 h-8 text-accent" />;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-3 bg-card-bg border border-border rounded-full text-text shadow-3d-inset hover:shadow-3d card-3d-interactive transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display font-bold text-3xl tracking-tight">Saved Locations</h1>
            <p className="text-sm text-text-muted">Swipe left to remove a city</p>
          </div>
        </div>

        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-accent text-[#FFFAF3] font-semibold rounded-2xl shadow-3d hover:translate-y-[6px] hover:shadow-3d-hover active:translate-y-[8px] active:shadow-3d-inset transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">Add City</span>
        </button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {savedCities.map((cityKey) => {
            const data = citiesData[cityKey];
            if (!data) return null; // loading placeholder

            const grad = WEATHER_BG_GRADS[data.condition] || 'from-bg-alt to-bg-alt';

            return (
              <motion.div
                key={cityKey}
                layout
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, x: -200, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="relative overflow-visible group"
              >
                {/* Background Delete Indicator (shown under card on drag) */}
                <div className="absolute inset-0 bg-[#C2540E] rounded-3d flex items-center justify-end px-6 text-[#FFFAF3] border border-[#C2540E]/20">
                  <div className="flex flex-col items-center gap-1 select-none">
                    <Trash2 className="w-6 h-6 animate-pulse" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">Release to Delete</span>
                  </div>
                </div>

                {/* Swipeable Card container */}
                <motion.div
                  drag="x"
                  dragConstraints={{ left: -140, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(event, info) => {
                    // If dragged far enough to the left, remove it
                    if (info.offset.x < -120) {
                      removeSavedCity(cityKey);
                    }
                  }}
                  onClick={() => selectCity(cityKey)}
                  className="cursor-pointer relative z-10 w-full h-full"
                >
                  <TactileTilt maxTilt={6}>
                    <div className={`card-3d bg-gradient-to-br ${grad} p-6 flex flex-col justify-between min-h-[160px] gap-6`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-text-muted" />
                            <h2 className="font-display font-bold text-xl">{data.name}</h2>
                          </div>
                          <p className="text-xs text-text-muted mt-0.5">{data.country} • {data.description}</p>
                        </div>
                        {getConditionIcon(data.condition)}
                      </div>

                      <div className="flex justify-between items-end">
                        <div className="font-display font-bold text-4xl">
                          {formatTemp(data.temp)}
                        </div>
                        <div className="flex gap-4 text-xs text-text-muted font-medium">
                          <span>H: {formatTemp(data.temp_max)}</span>
                          <span>L: {formatTemp(data.temp_min)}</span>
                        </div>
                      </div>
                    </div>
                  </TactileTilt>
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Empty / Add Card */}
        {savedCities.length === 0 && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center text-text-muted">
            <div className="text-5xl mb-4">📍</div>
            <h3 className="font-semibold text-lg text-text">No saved horizons</h3>
            <p className="text-sm max-w-xs mt-1">Add cities to keep an eye on weather conditions worldwide.</p>
          </div>
        )}
      </div>

      {/* Embedded Search Drawer overlay */}
      <Search isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};
