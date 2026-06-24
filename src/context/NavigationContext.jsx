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
    // Prevent geocoding 'current-location' string when geolocation coords are used
    if (activeCityKey !== 'current-location') {
      loadWeather(activeCityKey);
    }
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
        // Use real coordinates instead of mocking 'paris'
        setActiveCityKey('current-location'); // Use a special key so we know it's geolocation
        loadWeather({ lat: position.coords.latitude, lon: position.coords.longitude });
      },
      (error) => {
        setGeoState('denied');
        setShowGeoPrompt(false);
        // Fallback to default if error and we have no valid city
        if (activeCityKey === 'current-location') {
          setActiveCityKey(getFallbackCity());
        }
      }
    );
  };

  // Auto-detect location on mount
  useEffect(() => {
    let cancelled = false;
    let timer = null;

    const checkPermissionAndRequest = async () => {
      try {
        if (navigator.permissions && navigator.permissions.query) {
          const result = await navigator.permissions.query({ name: 'geolocation' });
          if (cancelled) return;

          if (result.state === 'granted') {
            requestGeolocation();
          } else if (result.state === 'prompt') {
            setGeoState('prompt');
            timer = setTimeout(() => {
              if (!cancelled) requestGeolocation();
            }, 1500);
          } else if (result.state === 'denied') {
            setGeoState('denied');
          }
        } else {
          // Fallback for older browsers
          timer = setTimeout(() => {
            if (!cancelled) requestGeolocation();
          }, 1500);
        }
      } catch (error) {
        // Fallback if permission query fails
        if (!cancelled) {
          timer = setTimeout(() => {
            if (!cancelled) requestGeolocation();
          }, 1500);
        }
      }
    };

    checkPermissionAndRequest();

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
