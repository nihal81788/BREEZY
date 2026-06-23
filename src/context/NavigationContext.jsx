import React, { createContext, useContext, useState, useEffect } from 'react';
import { getWeatherForCity, getFallbackCity } from '../services/weatherService';

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  // Navigation State
  const [currentPath, setCurrentPath] = useState('/'); // '/' or '/locations' or '/settings' or '/details/wind' etc
  const [prevPath, setPrevPath] = useState(null);
  
  // Weather Settings
  const [activeCityKey, setActiveCityKey] = useState('tokyo');
  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [weatherError, setWeatherError] = useState(null);
  
  // User Preferences
  const [theme, setTheme] = useState(() => localStorage.getItem('breezy-theme') || 'light'); // 'light', 'dark', 'auto'
  const [units, setUnits] = useState(() => localStorage.getItem('breezy-units') || 'celsius'); // 'celsius' (°C, km/h), 'fahrenheit' (°F, mph)
  const [savedCities, setSavedCities] = useState(() => {
    const saved = localStorage.getItem('breezy-saved-cities');
    return saved ? JSON.parse(saved) : ['tokyo', 'london', 'delhi', 'paris', 'bangalore'];
  });
  
  // Geolocation states
  const [geoState, setGeoState] = useState(() => localStorage.getItem('breezy-geo-permission') || 'prompt'); // 'prompt', 'granted', 'denied'
  const [showGeoPrompt, setShowGeoPrompt] = useState(false);

  // Navigate function
  const navigate = (path) => {
    setPrevPath(currentPath);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('breezy-theme', theme);
    const root = document.documentElement;
    
    // Theme application
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      // Auto / System preference
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemDark) {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('breezy-units', units);
  }, [units]);

  useEffect(() => {
    localStorage.setItem('breezy-saved-cities', JSON.stringify(savedCities));
  }, [savedCities]);

  useEffect(() => {
    localStorage.setItem('breezy-geo-permission', geoState);
  }, [geoState]);

  // Load weather for active city
  const loadWeather = async (cityKey) => {
    setLoadingWeather(true);
    setWeatherError(null);
    try {
      const data = await getWeatherForCity(cityKey);
      setWeatherData(data);
      
      // Update HTML weather attribute for reactive styling shifts
      document.documentElement.setAttribute('data-weather', data.condition);
    } catch (err) {
      setWeatherError(err.message);
    } finally {
      setLoadingWeather(false);
    }
  };

  // Trigger load on active city change
  useEffect(() => {
    loadWeather(activeCityKey);
  }, [activeCityKey]);

  // Geolocation trigger
  const requestGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoState('denied');
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setGeoState('granted');
        setShowGeoPrompt(false);
        // In a real app we'd resolve lat/lng to a city. 
        // Here we'll mock loading a nearby city (e.g. Sydney or Paris) or just keep Tokyo but set state.
        // Let's load Paris as our "geolocated" city demo
        setActiveCityKey('paris');
      },
      (error) => {
        setGeoState('denied');
        setShowGeoPrompt(false);
        // Gracefully keep default
        setActiveCityKey(getFallbackCity());
      }
    );
  };

  // Trigger geo-prompt check on mount
  useEffect(() => {
    if (geoState === 'prompt') {
      // Small delay to make it feel premium
      const timer = setTimeout(() => {
        setShowGeoPrompt(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [geoState]);

  // Helpers for Unit Conversion
  const formatTemp = (celsius) => {
    if (units === 'fahrenheit') {
      return `${Math.round((celsius * 9) / 5 + 32)}°F`;
    }
    return `${Math.round(celsius)}°C`;
  };

  const formatWind = (kmh) => {
    if (units === 'fahrenheit') {
      return `${Math.round(kmh * 0.621371)} mph`;
    }
    return `${Math.round(kmh)} km/h`;
  };

  // Actions
  const addSavedCity = (cityKey) => {
    if (!savedCities.includes(cityKey)) {
      setSavedCities([...savedCities, cityKey]);
    }
  };

  const removeSavedCity = (cityKey) => {
    setSavedCities(savedCities.filter(c => c !== cityKey));
  };

  const reorderSavedCities = (newOrder) => {
    setSavedCities(newOrder);
  };

  return (
    <NavigationContext.Provider
      value={{
        currentPath,
        prevPath,
        navigate,
        activeCityKey,
        setActiveCityKey,
        weatherData,
        loadingWeather,
        weatherError,
        theme,
        setTheme,
        units,
        setUnits,
        savedCities,
        addSavedCity,
        removeSavedCity,
        reorderSavedCities,
        geoState,
        setGeoState,
        showGeoPrompt,
        setShowGeoPrompt,
        requestGeolocation,
        formatTemp,
        formatWind,
        loadWeather
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
