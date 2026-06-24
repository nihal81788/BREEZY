const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'http://api.openweathermap.org/geo/1.0';

const mapCondition = (main, icon) => {
  const mainLower = main.toLowerCase();
  const isNight = icon.endsWith('n');
  
  if (mainLower === 'clear') return isNight ? 'clear-night' : 'clear-day';
  if (mainLower === 'clouds') return 'cloudy';
  if (mainLower === 'rain' || mainLower === 'drizzle') return 'rain';
  if (mainLower === 'thunderstorm' || mainLower === 'tornado' || mainLower === 'squall') return 'storm';
  if (mainLower === 'snow') return 'snow';
  if (['mist', 'smoke', 'haze', 'dust', 'fog', 'sand', 'ash'].includes(mainLower)) return 'fog';
  
  return 'cloudy'; // fallback
};

export const searchCities = async (query) => {
  const cleanQuery = query.trim();
  if (cleanQuery.length < 2) return [];

  const geoRes = await fetch(`${GEO_URL}/direct?q=${encodeURIComponent(cleanQuery)}&limit=5&appid=${API_KEY}`);
  if (!geoRes.ok) throw new Error(`Geocoding failed: ${geoRes.statusText}`);
  const geoData = await geoRes.json();

  if (!geoData.length) return [];

  // Fetch current weather for each match
  const weatherPromises = geoData.map(async (location) => {
    const weatherRes = await fetch(`${BASE_URL}/weather?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${API_KEY}`);
    if (!weatherRes.ok) throw new Error(`Weather fetch failed: ${weatherRes.statusText}`);
    const weatherData = await weatherRes.json();

    const slug = location.name.toLowerCase().replace(/\s+/g, "");
    
    return {
      key: slug,
      name: location.name,
      country: location.country,
      temp: Math.round(weatherData.main.temp),
      condition: mapCondition(weatherData.weather[0].main, weatherData.weather[0].icon),
      humidity: weatherData.main.humidity,
      wind_speed: Math.round(weatherData.wind.speed * 3.6), // m/s to km/h
      description: weatherData.weather[0].description.charAt(0).toUpperCase() + weatherData.weather[0].description.slice(1)
    };
  });

  return Promise.all(weatherPromises);
};

export const getWeatherForCity = async (cityKeyOrCoords) => {
  let lat, lon, resolvedName, resolvedCountry;

  if (typeof cityKeyOrCoords === 'string') {
    const cleanKey = cityKeyOrCoords.toLowerCase().replace(/\s+/g, "");
    const geoRes = await fetch(`${GEO_URL}/direct?q=${encodeURIComponent(cleanKey)}&limit=1&appid=${API_KEY}`);
    if (!geoRes.ok) throw new Error(`Geocoding failed: ${geoRes.statusText}`);
    const geoData = await geoRes.json();
    if (!geoData.length) throw new Error(`City "${cityKeyOrCoords}" not found via Geocoding API.`);
    
    lat = geoData[0].lat;
    lon = geoData[0].lon;
  } else if (typeof cityKeyOrCoords === 'object' && cityKeyOrCoords.lat !== undefined && cityKeyOrCoords.lon !== undefined) {
    lat = cityKeyOrCoords.lat;
    lon = cityKeyOrCoords.lon;
  } else {
    throw new Error('Invalid parameter passed to getWeatherForCity');
  }

  // Fetch current weather and forecast in parallel
  const [weatherRes, forecastRes] = await Promise.all([
    fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`),
    fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
  ]);

  if (!weatherRes.ok) throw new Error(`Weather fetch failed: ${weatherRes.statusText}`);
  if (!forecastRes.ok) throw new Error(`Forecast fetch failed: ${forecastRes.statusText}`);

  const weatherData = await weatherRes.json();
  const forecastData = await forecastRes.json();

  resolvedName = weatherData.name;
  resolvedCountry = weatherData.sys.country;

  const tzOffset = forecastData.city.timezone;

  // Process Hourly Data (next 12 hours = next 4 entries of 3-hour chunks)
  const hourly = forecastData.list.slice(0, 4).map(item => {
    const date = new Date((item.dt + tzOffset) * 1000);
    return {
      time: `${date.getUTCHours().toString().padStart(2, '0')}:00`,
      temp: Math.round(item.main.temp),
      condition: mapCondition(item.weather[0].main, item.weather[0].icon)
    };
  });

  // Process 5-day Forecast Data
  const groupedForecast = {};
  forecastData.list.forEach(item => {
    const date = new Date((item.dt + tzOffset) * 1000);
    const yyyy = date.getUTCFullYear();
    const mm = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const dd = date.getUTCDate().toString().padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    
    if (!groupedForecast[dateStr]) {
      groupedForecast[dateStr] = [];
    }
    groupedForecast[dateStr].push(item);
  });
  
  const forecastDays = Object.keys(groupedForecast).slice(0, 5);

  const forecast = forecastDays.map((dateStr, index) => {
    const dayItems = groupedForecast[dateStr];
    
    const temp_min = Math.round(Math.min(...dayItems.map(i => i.main.temp_min)));
    const temp_max = Math.round(Math.max(...dayItems.map(i => i.main.temp_max)));
    
    const midItem = dayItems[Math.floor(dayItems.length / 2)];
    const condition = mapCondition(midItem.weather[0].main, midItem.weather[0].icon);
    const description = midItem.weather[0].description.charAt(0).toUpperCase() + midItem.weather[0].description.slice(1);
    
    const [yyyy, mm, dd] = dateStr.split('-');
    const dateObj = new Date(Date.UTC(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd)));
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayLabel = index === 0 ? "Today" : weekdays[dateObj.getUTCDay()];

    const step = Math.max(1, Math.floor(dayItems.length / 4));
    const dayHourly = dayItems.filter((_, i) => i % step === 0).slice(0, 4).map(item => {
      const d = new Date((item.dt + tzOffset) * 1000);
      return {
        time: `${d.getUTCHours().toString().padStart(2, '0')}:00`,
        temp: Math.round(item.main.temp),
        condition: mapCondition(item.weather[0].main, item.weather[0].icon)
      };
    });

    return {
      day: dayLabel,
      temp_min,
      temp_max,
      condition,
      description,
      hourly: dayHourly
    };
  });

  return {
    name: resolvedName,
    country: resolvedCountry,
    temp: Math.round(weatherData.main.temp),
    feels_like: Math.round(weatherData.main.feels_like),
    temp_min: Math.round(weatherData.main.temp_min),
    temp_max: Math.round(weatherData.main.temp_max),
    condition: mapCondition(weatherData.weather[0].main, weatherData.weather[0].icon),
    description: weatherData.weather[0].description.charAt(0).toUpperCase() + weatherData.weather[0].description.slice(1),
    humidity: weatherData.main.humidity,
    wind_speed: Math.round(weatherData.wind.speed * 3.6),
    wind_deg: weatherData.wind.deg,
    uv_index: 0, // Placeholder, unavailable on free tier
    visibility: Math.round(weatherData.visibility / 1000), // m to km
    pressure: weatherData.main.pressure,
    sunrise: weatherData.sys.sunrise + weatherData.timezone + (new Date().getTimezoneOffset() * 60),
    sunset: weatherData.sys.sunset + weatherData.timezone + (new Date().getTimezoneOffset() * 60),
    hourly,
    forecast
  };
};

export const getFallbackCity = () => {
  return "tokyo";
};
