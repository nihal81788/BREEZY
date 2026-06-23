import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import { ArrowLeft, Wind, Droplets, Sun, Eye, Gauge, Sunset } from 'lucide-react';
import { ThreeDWidget } from '../components/ThreeDWidget';
import { TactileTilt } from '../components/TactileTilt';

const METRIC_CONFIGS = {
  wind: {
    title: "Wind Velocity",
    subtitle: "Real-time vector flow",
    icon: Wind,
    colorClass: "text-[#A8978A] bg-[#A8978A]/10",
    chartColor: "#A8978A",
    desc: "Wind is the bulk movement of air in the atmosphere. We track both wind speed (magnitude) and wind direction (vector angle). Strong wind vectors can signify moving pressure fronts, temperature gradients, or incoming storms.",
    tips: "At current speeds, outdoor sports are highly favorable. Watch out for sudden gusts in elevated corridors.",
    getChartData: (data) => [data.wind_speed - 4, data.wind_speed - 2, data.wind_speed, data.wind_speed + 3, data.wind_speed + 1, data.wind_speed]
  },
  humidity: {
    title: "Air Humidity",
    subtitle: "Relative water concentration",
    icon: Droplets,
    colorClass: "text-accent bg-accent-soft",
    chartColor: "#F0731E",
    desc: "Relative humidity measures the current water vapor pressure in the atmosphere compared to the maximum vapor pressure at the same temperature. High levels can hinder sweat evaporation, making warm days feel hotter.",
    tips: "Comfortable indoor humidity is typically between 30% and 50%. Dehumidifiers can improve indoor climate quality.",
    getChartData: (data) => [data.humidity - 10, data.humidity - 5, data.humidity, data.humidity + 5, data.humidity + 2, data.humidity]
  },
  uv_index: {
    title: "UV Intensity",
    subtitle: "Ultraviolet solar radiation",
    icon: Sun,
    colorClass: "text-[#C2540E] bg-[#C2540E]/10",
    chartColor: "#C2540E",
    desc: "The UV Index is an international standard measurement of the strength of sunburn-producing ultraviolet radiation at a particular place and time. Protection is highly recommended for indexes above 3.",
    tips: "Apply SPF 30+ sunscreen, wear a wide-brimmed hat, and seek shade during peak daylight hours.",
    getChartData: (data) => [0, 2, Math.max(0, data.uv_index - 2), data.uv_index, Math.max(0, data.uv_index - 1), 1, 0]
  },
  visibility: {
    title: "Atmospheric Visibility",
    subtitle: "Horizontal optical range",
    icon: Eye,
    colorClass: "text-[#9A8A7A] bg-[#9A8A7A]/10",
    chartColor: "#9A8A7A",
    desc: "Visibility measures the distance at which an object can be clearly discerned against the sky. Fog, dense clouds, humidity levels, and particulate pollution directly scale down this optical range.",
    tips: "Excellent driving conditions. No fog or precipitation warning alerts are in effect for this zone.",
    getChartData: (data) => [data.visibility, data.visibility, data.visibility - 2, data.visibility - 1, data.visibility, data.visibility]
  },
  pressure: {
    title: "Barometric Pressure",
    subtitle: "Surface atmospheric force",
    icon: Gauge,
    colorClass: "text-[#A8978A] bg-[#A8978A]/10",
    chartColor: "#A8978A",
    desc: "Barometric pressure represents the weight of the column of air above the surface. High pressure boundaries generally signal stable, sunny skies. Dropping pressure readings warn of incoming low-pressure systems and storms.",
    tips: "Standard pressure is 1013.25 hPa. Steady pressure readings indicate stable conditions for the next 24 hours.",
    getChartData: (data) => [data.pressure - 6, data.pressure - 3, data.pressure, data.pressure + 2, data.pressure + 1, data.pressure]
  },
  sunrise_sunset: {
    title: "Solar Positioning",
    subtitle: "Daylight solar arc tracking",
    icon: Sunset,
    colorClass: "text-accent bg-accent-soft",
    chartColor: "#F0731E",
    desc: "Solar positioning maps the sun's trajectory across the horizon. This arc helps visualize the ratio of daylight to night, solar energy absorption windows, and optimal outdoor activity times.",
    tips: "Sunset coordinates indicate standard diurnal transitions. Perfect lighting for outdoor photography.",
    getChartData: () => [0, 0.2, 0.5, 0.8, 1, 0.8, 0.5, 0.2, 0]
  }
};

export const MetricDetail = () => {
  const { currentPath, navigate, weatherData, formatTemp, formatWind } = useNavigation();

  // Parse metric key from path '/details/wind' -> 'wind'
  const metricKey = currentPath.split('/').pop() || 'wind';
  const config = METRIC_CONFIGS[metricKey];

  if (!weatherData || !config) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-text-muted">
        <p>Loading metric metadata...</p>
      </div>
    );
  }

  const IconComponent = config.icon;
  const chartPoints = config.getChartData(weatherData);

  // Generate dynamic formatted display values
  const getDisplayValue = () => {
    switch (metricKey) {
      case 'wind':
        return `${formatWind(weatherData.wind_speed)} at ${weatherData.wind_deg}°`;
      case 'humidity':
        return `${weatherData.humidity}%`;
      case 'uv_index':
        return `${weatherData.uv_index} / 11`;
      case 'visibility':
        return `${weatherData.visibility} km`;
      case 'pressure':
        return `${weatherData.pressure} hPa`;
      case 'sunrise_sunset':
        const sunriseStr = new Date(weatherData.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const sunsetStr = new Date(weatherData.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `${sunriseStr} to ${sunsetStr}`;
      default:
        return '';
    }
  };

  // Sparkline Chart Calculations
  const chartWidth = 500;
  const chartHeight = 120;
  const padding = 15;
  const maxVal = Math.max(...chartPoints);
  const minVal = Math.min(...chartPoints);
  const range = maxVal - minVal || 1;

  const pointsString = chartPoints
    .map((val, index) => {
      const x = padding + (index * (chartWidth - padding * 2)) / (chartPoints.length - 1);
      const y = chartHeight - padding - ((val - minVal) * (chartHeight - padding * 2)) / range;
      return `${x},${y}`;
    })
    .join(' ');

  // SVG solar progress calculation for visualizer
  const getSolarProgress = () => {
    if (metricKey !== 'sunrise_sunset') return 0;
    const now = Date.now() / 1000;
    const totalDay = weatherData.sunset - weatherData.sunrise;
    const elapsed = now - weatherData.sunrise;
    return Math.min(Math.max(elapsed / totalDay, 0), 1);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Header row */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="p-3 bg-card-bg border border-border rounded-full text-text shadow-3d-inset hover:shadow-3d card-3d-interactive transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-display font-bold text-3xl tracking-tight flex items-center gap-2">
            {config.title}
          </h1>
          <p className="text-sm text-text-muted">{config.subtitle}</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left column: 3D Visualization */}
        <div className="md:col-span-2 flex flex-col gap-6">
          <TactileTilt maxTilt={8}>
            <div className="card-3d p-6 flex flex-col items-center justify-center min-h-[300px] gap-6">
              <span className="text-xs uppercase tracking-widest font-bold text-text-muted">3D Perspective Simulator</span>
              <div className="w-full max-w-sm h-48 bg-bg/20 rounded-2xl border border-border/50">
                <ThreeDWidget 
                  type={metricKey === 'sunrise_sunset' ? 'solar-arc' : metricKey === 'wind' ? 'wind-flow' : metricKey === 'uv_index' ? 'uv-index' : 'generic-orb'} 
                  condition={weatherData.condition} 
                  value={metricKey === 'sunrise_sunset' ? getSolarProgress() : weatherData[metricKey] || 0} 
                  angle={weatherData.wind_deg || 0}
                />
              </div>
              <div className="text-center">
                <div className="font-display font-bold text-3xl text-text">
                  {getDisplayValue()}
                </div>
                <span className="text-xs text-text-muted font-medium uppercase tracking-wider">Current Reading ({weatherData.name})</span>
              </div>
            </div>
          </TactileTilt>

          {/* Historical Sparkline */}
          <TactileTilt maxTilt={6}>
            <div className="card-3d p-6 flex flex-col gap-4">
              <div>
                <h3 className="font-bold text-sm text-text">Historical Trend</h3>
                <p className="text-xs text-text-muted">Simulated readings over the past 24 hours</p>
              </div>

              <div className="w-full bg-bg/35 border border-border/50 rounded-2xl p-4 overflow-hidden">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible">
                  {/* Grid Lines */}
                  <line x1="0" y1={chartHeight / 2} x2={chartWidth} y2={chartHeight / 2} stroke="var(--card-border)" strokeDasharray="4 4" />
                  
                  {/* Smooth Line Path */}
                  <polyline
                    fill="none"
                    stroke={config.chartColor}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={pointsString}
                  />

                  {/* Gradient Area under polyline */}
                  <path
                    d={`M ${padding},${chartHeight - padding} L ${pointsString} L ${chartWidth - padding},${chartHeight - padding} Z`}
                    fill={`url(#grad-${metricKey})`}
                    opacity="0.15"
                  />

                  {/* SVG Gradient definitions */}
                  <defs>
                    <linearGradient id={`grad-${metricKey}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={config.chartColor} />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>

                  {/* Dots on points */}
                  {chartPoints.map((val, idx) => {
                    const x = padding + (idx * (chartWidth - padding * 2)) / (chartPoints.length - 1);
                    const y = chartHeight - padding - ((val - minVal) * (chartHeight - padding * 2)) / range;
                    return (
                      <circle
                        key={idx}
                        cx={x}
                        cy={y}
                        r="4.5"
                        fill="var(--card-bg)"
                        stroke={config.chartColor}
                        strokeWidth="3.5"
                      />
                    );
                  })}
                </svg>
              </div>
            </div>
          </TactileTilt>
        </div>

        {/* Right column: Explainer Card */}
        <div className="flex flex-col gap-6">
          <TactileTilt maxTilt={10}>
            <div className="card-3d p-6 h-full flex flex-col gap-6 border-l-4" style={{ borderLeftColor: config.chartColor }}>
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${config.colorClass}`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-text">Overview</h3>
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Meteorology digest</span>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-text">
                {config.desc}
              </p>

              <div className="border-t border-border pt-4 mt-auto">
                <h4 className="font-bold text-xs uppercase tracking-wider text-text-muted mb-2">Observations & Insights</h4>
                <div className="p-3 bg-bg/40 border border-border rounded-xl text-xs leading-relaxed text-text font-medium">
                  {config.tips}
                </div>
              </div>
            </div>
          </TactileTilt>
        </div>

      </div>
    </div>
  );
};
