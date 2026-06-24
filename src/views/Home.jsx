import React, { useState } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { ThreeDWidget } from '../components/ThreeDWidget';
import { Clock } from '../components/Clock';
import { Search } from './Search';
import { TactileTilt } from '../components/TactileTilt';
import { 
  Sun, Moon, Cloud, CloudRain, CloudLightning, CloudSnow, Wind, 
  Search as SearchIcon, RefreshCw, Compass, MapPin, Navigation, 
  Settings as SettingsIcon, Bookmark, ChevronDown, ChevronUp, Droplets, Gauge, Eye 
} from 'lucide-react';

const WEATHER_ICONS = {
  'clear-day': Sun,
  'clear-night': Moon,
  'cloudy': Cloud,
  'rain': CloudRain,
  'storm': CloudLightning,
  'snow': CloudSnow,
  'fog': Wind,
};

export const Home = () => {
  const {
    currentPath,
    navigate,
    weatherData,
    loadingWeather,
    weatherError,
    theme,
    setTheme,
    savedCities,
    showGeoPrompt,
    setShowGeoPrompt,
    requestGeolocation,
    geoState,
    formatTemp,
    formatWind,
    loadWeather,
    activeCityKey
  } = useNavigation();

  const [searchOpen, setSearchOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedDay, setExpandedDay] = useState(null); // Index of expanded day in 5-day forecast

  const handleRefresh = async () => {
    setRefreshing(true);
    if (activeCityKey === 'current-location') {
      requestGeolocation();
    } else {
      await loadWeather(activeCityKey);
    }
    setTimeout(() => setRefreshing(false), 800);
  };

  const getConditionIcon = (condition, className = "w-6 h-6") => {
    const Icon = WEATHER_ICONS[condition] || Sun;
    // Map coloring
    let color = "text-accent";
    if (condition === 'clear-night') color = "text-[#C2540E]";
    if (condition === 'cloudy') color = "text-[#A8978A]";
    if (condition === 'rain' || condition === 'snow') color = "text-[#A8978A]";
    if (condition === 'storm') color = "text-[#C2540E]";
    if (condition === 'fog') color = "text-[#A8978A]";
    return <Icon className={`${className} ${color}`} />;
  };

  if (weatherError) {
    return (
      <div className="w-full max-w-lg mx-auto p-8 mt-12 text-center">
        <div className="card-3d p-8 flex flex-col items-center gap-6">
          <span className="text-5xl">📡</span>
          <div>
            <h2 className="font-display font-bold text-2xl text-text">Horizon Connection Lost</h2>
            <p className="text-sm text-text-muted mt-2">{weatherError}</p>
          </div>
          <button
            onClick={() => loadWeather('tokyo')}
            className="px-6 py-2.5 bg-accent text-[#FFFAF3] font-semibold rounded-2xl shadow-3d hover:translate-y-[4px] hover:shadow-3d-hover active:translate-y-[6px] transition-all"
          >
            Reset to Tokyo Horizon
          </button>
        </div>
      </div>
    );
  }

  if (loadingWeather || !weatherData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-text-muted tracking-widest uppercase font-semibold">Tuning atmosphere...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 flex flex-col gap-6 select-none pb-24">
      {/* 1. Header Toolbar */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-2xl tracking-tight text-text">BREEZY</span>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <Clock />
          
          {/* Saved Locations Route */}
          <button
            onClick={() => navigate('/locations')}
            className="p-2.5 bg-card-bg border border-border shadow-3d-inset hover:shadow-3d card-3d-interactive rounded-full text-text transition-all"
            title="Saved Locations"
          >
            <Bookmark className="w-4 h-4" />
          </button>

          {/* Settings Route */}
          <button
            onClick={() => navigate('/settings')}
            className="p-2.5 bg-card-bg border border-border shadow-3d-inset hover:shadow-3d card-3d-interactive rounded-full text-text transition-all"
            title="Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2.5 bg-card-bg border border-border shadow-3d-inset hover:shadow-3d card-3d-interactive rounded-full text-text transition-all"
            title="Toggle Theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 2. Custom Geolocation Explainer Prompt */}
      {showGeoPrompt && geoState === 'prompt' && (
        <div className="relative z-20">
          <div className="card-3d bg-accent-soft/20 border-accent/30 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-accent text-[#FFFAF3] rounded-2xl">
                <Navigation className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-text">Enable Local Horizon</h3>
                <p className="text-sm text-text-muted mt-0.5">Breezy requests geolocation to display real-time local atmospheric projections.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={requestGeolocation}
                className="px-5 py-2.5 bg-accent text-[#FFFAF3] font-semibold rounded-xl shadow-3d text-sm hover:translate-y-[4px] transition-all"
              >
                Allow Access
              </button>
              <button
                onClick={() => setShowGeoPrompt(false)}
                className="px-4 py-2.5 bg-bg/50 border border-border text-text font-semibold rounded-xl text-sm hover:bg-bg transition-all"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Hero Weather Zone */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <TactileTilt maxTilt={8}>
            <div className="card-3d p-6 md:p-8 flex flex-col md:flex-row items-center justify-between min-h-[260px] gap-6 relative overflow-hidden">
              
              {/* Left Details */}
              <div className="flex flex-col gap-4 self-start">
                <div 
                  onClick={() => setSearchOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-bg/60 border border-border rounded-full cursor-pointer hover:border-accent hover:text-accent transition-all duration-200 card-3d-interactive select-none w-fit"
                >
                  <MapPin className="w-4 h-4 text-text-muted" />
                  <span className="font-bold text-sm">{weatherData.name}, {weatherData.country}</span>
                  <SearchIcon className="w-3.5 h-3.5 text-text-muted" />
                </div>

                <div className="flex flex-col">
                  <h1 className="font-display font-bold text-[80px] leading-none tracking-tighter text-text relative">
                    {formatTemp(weatherData.temp)}
                  </h1>
                  <span className="font-display font-semibold text-lg text-text capitalize mt-2">
                    {weatherData.description}
                  </span>
                  <div className="flex gap-4 text-sm text-text-muted font-medium mt-1">
                    <span>Feels like {formatTemp(weatherData.feels_like)}</span>
                    <span>H: {formatTemp(weatherData.temp_max)}</span>
                    <span>L: {formatTemp(weatherData.temp_min)}</span>
                  </div>
                </div>

                {/* Refresh Location Control */}
                <button
                  onClick={handleRefresh}
                  className="flex items-center gap-2 px-4 py-2 mt-2 bg-accent text-[#FFFAF3] shadow-3d-hover hover:brightness-110 border border-transparent rounded-full text-xs font-bold cursor-pointer select-none transition-all w-fit card-3d-interactive group"
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                  <span>Update Projection</span>
                </button>
              </div>

              {/* Right 3D Visualizer Canvas (embedded in hero card) */}
              <div className="w-full max-w-[280px] h-48 md:h-56 relative">
                {/* Ambient dynamic bloom behind the 3D object */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-accent/25 blur-[60px] rounded-full pointer-events-none" />
                {/* Scaled up 3D widget bleeding off the edge */}
                <div className="absolute top-0 right-0 w-[125%] h-[125%] -mt-[12%] -mr-[12%] z-10 pointer-events-none">
                  <ThreeDWidget type="hero-weather" condition={weatherData.condition} />
                </div>
              </div>
            </div>
          </TactileTilt>
        </div>

        {/* 4. Bento Grid Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-1 gap-6">
          
          {/* Wind Widget */}
          <div onClick={() => navigate('/details/wind')} className="cursor-pointer">
            <TactileTilt maxTilt={6}>
              <div className="card-3d card-3d-interactive p-5 flex flex-col justify-between h-[120px] relative overflow-hidden group">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-[0.06em]">Wind Vector</span>
                  <Wind className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" />
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="font-display font-bold text-3xl text-text">{formatWind(weatherData.wind_speed)}</div>
                    <span className="text-[10px] text-text-muted font-medium uppercase mt-1 block">Direction: {weatherData.wind_deg}°</span>
                  </div>
                  {/* Miniature 3D compass reference */}
                  <div className="w-12 h-12 bg-bg/40 rounded-full border border-border/80 flex items-center justify-center group-hover:border-accent transition-colors">
                    <Compass 
                      className="w-6 h-6 text-accent transition-transform duration-500" 
                      style={{ transform: `rotate(${weatherData.wind_deg}deg)` }} 
                    />
                  </div>
                </div>
              </div>
            </TactileTilt>
          </div>

          {/* Humidity Widget */}
          <div onClick={() => navigate('/details/humidity')} className="cursor-pointer">
            <TactileTilt maxTilt={6}>
              <div className="card-3d card-3d-interactive p-5 flex flex-col justify-between h-[120px] relative overflow-hidden group">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-[0.06em]">Humidity</span>
                  <Droplets className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" />
                </div>
                <div>
                  <div className="font-display font-bold text-3xl text-text">{weatherData.humidity}%</div>
                  <span className="text-[10px] text-text-muted font-medium uppercase mt-1 block">Relative Saturation</span>
                </div>
              </div>
            </TactileTilt>
          </div>

        </div>
      </div>

      {/* 5. Bento Grid Secondary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        
        {/* UV Index Widget */}
        <div onClick={() => navigate('/details/uv_index')} className="cursor-pointer">
          <TactileTilt maxTilt={8}>
            <div className="card-3d card-3d-interactive p-5 flex flex-col justify-between h-[130px] group">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-[0.06em]">UV Index</span>
                <Sun className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" />
              </div>
              <div>
                <div className="font-display font-bold text-3xl text-text">{weatherData.uv_index}</div>
                <span className={`text-[10px] font-semibold uppercase tracking-[0.06em] mt-1 block ${
                  weatherData.uv_index <= 2 ? 'text-text-muted' : 
                  weatherData.uv_index <= 5 ? 'text-accent' : 
                  'text-[#C2540E]'
                }`}>
                  {weatherData.uv_index <= 2 ? 'Low' : weatherData.uv_index <= 5 ? 'Moderate' : 'High'}
                </span>
              </div>
            </div>
          </TactileTilt>
        </div>

        {/* Sunrise/Sunset Widget */}
        <div onClick={() => navigate('/details/sunrise_sunset')} className="cursor-pointer">
          <TactileTilt maxTilt={8}>
            <div className="card-3d card-3d-interactive p-5 flex flex-col justify-between h-[130px] group">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-[0.06em]">Solar Cycle</span>
                <RefreshCw className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" />
              </div>
              <div>
                <div className="font-display font-bold text-2xl text-text">
                  {new Date(weatherData.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <span className="text-[10px] text-text-muted font-semibold uppercase mt-1 block">Sunrise</span>
              </div>
            </div>
          </TactileTilt>
        </div>

        {/* Barometric Pressure */}
        <div onClick={() => navigate('/details/pressure')} className="cursor-pointer">
          <TactileTilt maxTilt={8}>
            <div className="card-3d card-3d-interactive p-5 flex flex-col justify-between h-[130px] group">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-[0.06em]">Pressure</span>
                <Gauge className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" />
              </div>
              <div>
                <div className="font-display font-bold text-3xl text-text">{weatherData.pressure}</div>
                <span className="text-[10px] text-text-muted font-semibold uppercase mt-1 block">hPa • Barometric</span>
              </div>
            </div>
          </TactileTilt>
        </div>

        {/* Visibility */}
        <div onClick={() => navigate('/details/visibility')} className="cursor-pointer">
          <TactileTilt maxTilt={8}>
            <div className="card-3d card-3d-interactive p-5 flex flex-col justify-between h-[130px] group">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] font-bold text-text-muted uppercase tracking-[0.06em]">Visibility</span>
                <Eye className="w-5 h-5 text-text-muted group-hover:text-accent transition-colors" />
              </div>
              <div>
                <div className="font-display font-bold text-3xl text-text">{weatherData.visibility} km</div>
                <span className="text-[10px] text-text-muted font-semibold uppercase mt-1 block">Horizontal transparency</span>
              </div>
            </div>
          </TactileTilt>
        </div>

      </div>

      {/* 6. Hourly Forecast scroll strip */}
      <TactileTilt maxTilt={4}>
        <div className="card-3d p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-text">Hourly Forecast</h3>
            <span className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">Next 12 Hours</span>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar">
            {weatherData.hourly.map((hour, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-2 p-3 bg-bg/25 border border-border/50 rounded-2xl min-w-[76px] hover:border-accent hover:bg-bg/60 transition-all duration-200 card-3d-interactive"
              >
                <span className="text-xs text-text-muted font-semibold">{hour.time}</span>
                {getConditionIcon(hour.condition, "w-6 h-6")}
                <span className="font-display font-bold text-sm text-text">{formatTemp(hour.temp)}</span>
              </div>
            ))}
          </div>
        </div>
      </TactileTilt>

      {/* 7. 5-Day Forecast with expandable detail view */}
      <TactileTilt maxTilt={4}>
        <div className="card-3d p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-text">5-Day Outlook</h3>
            <span className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">Tap a day to expand details</span>
          </div>

          <div className="flex flex-col gap-3">
            {weatherData.forecast.map((day, idx) => {
              const isExpanded = expandedDay === idx;
              return (
                <div
                  key={idx}
                  className="flex flex-col border border-border/50 rounded-2xl bg-bg/20 overflow-hidden transition-all duration-300"
                >
                  {/* Primary Row */}
                  <div
                    onClick={() => setExpandedDay(isExpanded ? null : idx)}
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-bg/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-[100px]">
                      {getConditionIcon(day.condition, "w-5 h-5")}
                      <span className="font-bold text-sm text-text">{day.day}</span>
                    </div>

                    <span className="text-xs text-text-muted hidden sm:block truncate max-w-[200px] text-left">
                      {day.description}
                    </span>

                    <div className="flex items-center gap-4">
                      <span className="font-display font-bold text-sm text-text">
                        {formatTemp(day.temp_max)}
                      </span>
                      <span className="font-display text-xs text-text-muted min-w-[36px] text-right">
                        {formatTemp(day.temp_min)}
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
                    </div>
                  </div>

                  {/* Expandable Progressive Disclosure Drawer */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-border/50 bg-bg/30 flex flex-col gap-3 animate-fadeIn">
                      <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Diurnal Temperature Curve</span>
                      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar">
                        {day.hourly.map((h, hIdx) => (
                          <div
                            key={hIdx}
                            className="flex flex-col items-center gap-1.5 p-2 bg-card-bg border border-border/50 rounded-xl min-w-[68px]"
                          >
                            <span className="text-[10px] text-text-muted font-medium">{h.time}</span>
                            {getConditionIcon(h.condition, "w-4 h-4")}
                            <span className="font-display font-bold text-xs text-text">{formatTemp(h.temp)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </TactileTilt>

      {/* Embedded Search Modal triggered by clicking Location Pill */}
      <Search isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};
