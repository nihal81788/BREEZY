// Mock Weather Service mirroring standard OpenWeatherMap/WeatherAPI schemas.
// Allows simple swap-out with a real HTTP fetch call later.

const MOCK_WEATHER_DATA = {
  tokyo: {
    name: "Tokyo",
    country: "JP",
    temp: 22,
    feels_like: 21,
    temp_min: 18,
    temp_max: 25,
    condition: "clear-day",
    description: "Sunny and clear sky",
    humidity: 45,
    wind_speed: 12, // km/h
    wind_deg: 180, // South
    uv_index: 6,
    visibility: 10, // km
    pressure: 1016, // hPa
    sunrise: 1782186000, // Unix timestamp
    sunset: 1782236400,
    hourly: [
      { time: "12:00", temp: 24, condition: "clear-day" },
      { time: "13:00", temp: 25, condition: "clear-day" },
      { time: "14:00", temp: 25, condition: "clear-day" },
      { time: "15:00", temp: 24, condition: "clear-day" },
      { time: "16:00", temp: 23, condition: "clear-day" },
      { time: "17:00", temp: 22, condition: "clear-day" },
      { time: "18:00", temp: 20, condition: "clear-night" },
      { time: "19:00", temp: 19, condition: "clear-night" },
      { time: "20:00", temp: 18, condition: "clear-night" },
      { time: "21:00", temp: 18, condition: "clear-night" },
      { time: "22:00", temp: 17, condition: "clear-night" },
      { time: "23:00", temp: 17, condition: "clear-night" },
    ],
    forecast: [
      { day: "Today", temp_min: 18, temp_max: 25, condition: "clear-day", description: "Clear and sunny", hourly: [
        { time: "09:00", temp: 20, condition: "clear-day" },
        { time: "12:00", temp: 24, condition: "clear-day" },
        { time: "15:00", temp: 25, condition: "clear-day" },
        { time: "18:00", temp: 20, condition: "clear-night" },
      ]},
      { day: "Wed", temp_min: 17, temp_max: 24, condition: "clear-day", description: "Sunny intervals", hourly: [
        { time: "09:00", temp: 19, condition: "clear-day" },
        { time: "12:00", temp: 23, condition: "clear-day" },
        { time: "15:00", temp: 24, condition: "clear-day" },
        { time: "18:00", temp: 19, condition: "clear-night" },
      ]},
      { day: "Thu", temp_min: 16, temp_max: 22, condition: "cloudy", description: "Passing clouds", hourly: [
        { time: "09:00", temp: 18, condition: "cloudy" },
        { time: "12:00", temp: 21, condition: "cloudy" },
        { time: "15:00", temp: 22, condition: "cloudy" },
        { time: "18:00", temp: 18, condition: "cloudy" },
      ]},
      { day: "Fri", temp_min: 15, temp_max: 20, condition: "rain", description: "Light morning rain", hourly: [
        { time: "09:00", temp: 16, condition: "rain" },
        { time: "12:00", temp: 19, condition: "rain" },
        { time: "15:00", temp: 20, condition: "cloudy" },
        { time: "18:00", temp: 17, condition: "clear-night" },
      ]},
      { day: "Sat", temp_min: 17, temp_max: 26, condition: "clear-day", description: "Pleasant and sunny", hourly: [
        { time: "09:00", temp: 19, condition: "clear-day" },
        { time: "12:00", temp: 25, condition: "clear-day" },
        { time: "15:00", temp: 26, condition: "clear-day" },
        { time: "18:00", temp: 21, condition: "clear-night" },
      ]}
    ]
  },
  london: {
    name: "London",
    country: "GB",
    temp: 14,
    feels_like: 13,
    temp_min: 11,
    temp_max: 16,
    condition: "rain",
    description: "Light drizzle and showers",
    humidity: 88,
    wind_speed: 22,
    wind_deg: 240, // Southwest
    uv_index: 2,
    visibility: 8,
    pressure: 1008,
    sunrise: 1782187200,
    sunset: 1782241200,
    hourly: [
      { time: "12:00", temp: 14, condition: "rain" },
      { time: "13:00", temp: 14, condition: "rain" },
      { time: "14:00", temp: 15, condition: "rain" },
      { time: "15:00", temp: 15, condition: "rain" },
      { time: "16:00", temp: 16, condition: "cloudy" },
      { time: "17:00", temp: 15, condition: "cloudy" },
      { time: "18:00", temp: 14, condition: "rain" },
      { time: "19:00", temp: 13, condition: "rain" },
      { time: "20:00", temp: 12, condition: "cloudy" },
      { time: "21:00", temp: 12, condition: "cloudy" },
      { time: "22:00", temp: 11, condition: "clear-night" },
      { time: "23:00", temp: 11, condition: "clear-night" },
    ],
    forecast: [
      { day: "Today", temp_min: 11, temp_max: 16, condition: "rain", description: "Showers", hourly: [
        { time: "09:00", temp: 12, condition: "rain" },
        { time: "12:00", temp: 14, condition: "rain" },
        { time: "15:00", temp: 15, condition: "rain" },
        { time: "18:00", temp: 13, condition: "cloudy" },
      ]},
      { day: "Wed", temp_min: 10, temp_max: 15, condition: "rain", description: "Rainy morning", hourly: [
        { time: "09:00", temp: 11, condition: "rain" },
        { time: "12:00", temp: 14, condition: "rain" },
        { time: "15:00", temp: 15, condition: "cloudy" },
        { time: "18:00", temp: 12, condition: "clear-night" },
      ]},
      { day: "Thu", temp_min: 11, temp_max: 17, condition: "cloudy", description: "Overcast skies", hourly: [
        { time: "09:00", temp: 13, condition: "cloudy" },
        { time: "12:00", temp: 16, condition: "cloudy" },
        { time: "15:00", temp: 17, condition: "cloudy" },
        { time: "18:00", temp: 14, condition: "cloudy" },
      ]},
      { day: "Fri", temp_min: 9, temp_max: 14, condition: "fog", description: "Misty and cold", hourly: [
        { time: "09:00", temp: 10, condition: "fog" },
        { time: "12:00", temp: 13, condition: "fog" },
        { time: "15:00", temp: 14, condition: "cloudy" },
        { time: "18:00", temp: 11, condition: "cloudy" },
      ]},
      { day: "Sat", temp_min: 12, temp_max: 18, condition: "clear-day", description: "Sunny periods", hourly: [
        { time: "09:00", temp: 14, condition: "clear-day" },
        { time: "12:00", temp: 17, condition: "clear-day" },
        { time: "15:00", temp: 18, condition: "clear-day" },
        { time: "18:00", temp: 15, condition: "clear-night" },
      ]}
    ]
  },
  newyork: {
    name: "New York",
    country: "US",
    temp: 26,
    feels_like: 28,
    temp_min: 20,
    temp_max: 30,
    condition: "storm",
    description: "Thunderstorms and strong wind",
    humidity: 78,
    wind_speed: 38,
    wind_deg: 90, // East
    uv_index: 8,
    visibility: 6,
    pressure: 1004,
    sunrise: 1782181200,
    sunset: 1782233400,
    hourly: [
      { time: "12:00", temp: 28, condition: "storm" },
      { time: "13:00", temp: 29, condition: "storm" },
      { time: "14:00", temp: 30, condition: "storm" },
      { time: "15:00", temp: 29, condition: "storm" },
      { time: "16:00", temp: 27, condition: "storm" },
      { time: "17:00", temp: 26, condition: "rain" },
      { time: "18:00", temp: 25, condition: "rain" },
      { time: "19:00", temp: 24, condition: "cloudy" },
      { time: "20:00", temp: 23, condition: "cloudy" },
      { time: "21:00", temp: 22, condition: "clear-night" },
      { time: "22:00", temp: 21, condition: "clear-night" },
      { time: "23:00", temp: 20, condition: "clear-night" },
    ],
    forecast: [
      { day: "Today", temp_min: 20, temp_max: 30, condition: "storm", description: "Severe storms", hourly: [
        { time: "09:00", temp: 24, condition: "cloudy" },
        { time: "12:00", temp: 28, condition: "storm" },
        { time: "15:00", temp: 29, condition: "storm" },
        { time: "18:00", temp: 25, condition: "rain" },
      ]},
      { day: "Wed", temp_min: 19, temp_max: 27, condition: "rain", description: "Heavy rain", hourly: [
        { time: "09:00", temp: 21, condition: "rain" },
        { time: "12:00", temp: 25, condition: "rain" },
        { time: "15:00", temp: 26, condition: "rain" },
        { time: "18:00", temp: 22, condition: "cloudy" },
      ]},
      { day: "Thu", temp_min: 18, temp_max: 25, condition: "cloudy", description: "Mostly cloudy", hourly: [
        { time: "09:00", temp: 20, condition: "cloudy" },
        { time: "12:00", temp: 24, condition: "cloudy" },
        { time: "15:00", temp: 25, condition: "cloudy" },
        { time: "18:00", temp: 21, condition: "cloudy" },
      ]},
      { day: "Fri", temp_min: 20, temp_max: 29, condition: "clear-day", description: "Clear and sunny", hourly: [
        { time: "09:00", temp: 22, condition: "clear-day" },
        { time: "12:00", temp: 27, condition: "clear-day" },
        { time: "15:00", temp: 29, condition: "clear-day" },
        { time: "18:00", temp: 24, condition: "clear-night" },
      ]},
      { day: "Sat", temp_min: 22, temp_max: 32, condition: "clear-day", description: "Hot and sunny", hourly: [
        { time: "09:00", temp: 25, condition: "clear-day" },
        { time: "12:00", temp: 30, condition: "clear-day" },
        { time: "15:00", temp: 32, condition: "clear-day" },
        { time: "18:00", temp: 27, condition: "clear-night" },
      ]}
    ]
  },
  paris: {
    name: "Paris",
    country: "FR",
    temp: 18,
    feels_like: 17,
    temp_min: 14,
    temp_max: 22,
    condition: "cloudy",
    description: "Partly cloudy with mild breeze",
    humidity: 62,
    wind_speed: 16,
    wind_deg: 290, // West-Northwest
    uv_index: 4,
    visibility: 10,
    pressure: 1013,
    sunrise: 1782186600,
    sunset: 1782240000,
    hourly: [
      { time: "12:00", temp: 20, condition: "cloudy" },
      { time: "13:00", temp: 21, condition: "cloudy" },
      { time: "14:00", temp: 22, condition: "cloudy" },
      { time: "15:00", temp: 22, condition: "clear-day" },
      { time: "16:00", temp: 21, condition: "clear-day" },
      { time: "17:00", temp: 20, condition: "cloudy" },
      { time: "18:00", temp: 18, condition: "cloudy" },
      { time: "19:00", temp: 17, condition: "cloudy" },
      { time: "20:00", temp: 16, condition: "clear-night" },
      { time: "21:00", temp: 15, condition: "clear-night" },
      { time: "22:00", temp: 14, condition: "clear-night" },
      { time: "23:00", temp: 14, condition: "clear-night" },
    ],
    forecast: [
      { day: "Today", temp_min: 14, temp_max: 22, condition: "cloudy", description: "Partly cloudy", hourly: [
        { time: "09:00", temp: 16, condition: "cloudy" },
        { time: "12:00", temp: 20, condition: "cloudy" },
        { time: "15:00", temp: 22, condition: "clear-day" },
        { time: "18:00", temp: 18, condition: "cloudy" },
      ]},
      { day: "Wed", temp_min: 13, temp_max: 21, condition: "clear-day", description: "Sunny intervals", hourly: [
        { time: "09:00", temp: 15, condition: "clear-day" },
        { time: "12:00", temp: 20, condition: "clear-day" },
        { time: "15:00", temp: 21, condition: "clear-day" },
        { time: "18:00", temp: 17, condition: "clear-night" },
      ]},
      { day: "Thu", temp_min: 12, temp_max: 19, condition: "rain", description: "Passing showers", hourly: [
        { time: "09:00", temp: 14, condition: "cloudy" },
        { time: "12:00", temp: 18, condition: "rain" },
        { time: "15:00", temp: 19, condition: "rain" },
        { time: "18:00", temp: 15, condition: "cloudy" },
      ]},
      { day: "Fri", temp_min: 11, temp_max: 20, condition: "clear-day", description: "Sunny and clear", hourly: [
        { time: "09:00", temp: 13, condition: "clear-day" },
        { time: "12:00", temp: 18, condition: "clear-day" },
        { time: "15:00", temp: 20, condition: "clear-day" },
        { time: "18:00", temp: 16, condition: "clear-night" },
      ]},
      { day: "Sat", temp_min: 13, temp_max: 23, condition: "clear-day", description: "Warm and bright", hourly: [
        { time: "09:00", temp: 15, condition: "clear-day" },
        { time: "12:00", temp: 21, condition: "clear-day" },
        { time: "15:00", temp: 23, condition: "clear-day" },
        { time: "18:00", temp: 18, condition: "clear-night" },
      ]}
    ]
  },
  cairo: {
    name: "Cairo",
    country: "EG",
    temp: 36,
    feels_like: 37,
    temp_min: 24,
    temp_max: 39,
    condition: "clear-day",
    description: "Hot and sunny desert weather",
    humidity: 25,
    wind_speed: 18,
    wind_deg: 45, // Northeast
    uv_index: 11,
    visibility: 12,
    pressure: 1010,
    sunrise: 1782183600,
    sunset: 1782235200,
    hourly: [
      { time: "12:00", temp: 37, condition: "clear-day" },
      { time: "13:00", temp: 38, condition: "clear-day" },
      { time: "14:00", temp: 39, condition: "clear-day" },
      { time: "15:00", temp: 38, condition: "clear-day" },
      { time: "16:00", temp: 36, condition: "clear-day" },
      { time: "17:00", temp: 34, condition: "clear-day" },
      { time: "18:00", temp: 32, condition: "clear-day" },
      { time: "19:00", temp: 30, condition: "clear-night" },
      { time: "20:00", temp: 28, condition: "clear-night" },
      { time: "21:00", temp: 27, condition: "clear-night" },
      { time: "22:00", temp: 26, condition: "clear-night" },
      { time: "23:00", temp: 25, condition: "clear-night" },
    ],
    forecast: [
      { day: "Today", temp_min: 24, temp_max: 39, condition: "clear-day", description: "Very hot and dry", hourly: [
        { time: "09:00", temp: 30, condition: "clear-day" },
        { time: "12:00", temp: 37, condition: "clear-day" },
        { time: "15:00", temp: 38, condition: "clear-day" },
        { time: "18:00", temp: 32, condition: "clear-day" },
      ]},
      { day: "Wed", temp_min: 23, temp_max: 38, condition: "clear-day", description: "Sunny and clear", hourly: [
        { time: "09:00", temp: 29, condition: "clear-day" },
        { time: "12:00", temp: 36, condition: "clear-day" },
        { time: "15:00", temp: 38, condition: "clear-day" },
        { time: "18:00", temp: 31, condition: "clear-day" },
      ]},
      { day: "Thu", temp_min: 24, temp_max: 37, condition: "clear-day", description: "Sunny and clear", hourly: [
        { time: "09:00", temp: 29, condition: "clear-day" },
        { time: "12:00", temp: 35, condition: "clear-day" },
        { time: "15:00", temp: 37, condition: "clear-day" },
        { time: "18:00", temp: 31, condition: "clear-day" },
      ]},
      { day: "Fri", temp_min: 23, temp_max: 39, condition: "clear-day", description: "Sunny and clear", hourly: [
        { time: "09:00", temp: 30, condition: "clear-day" },
        { time: "12:00", temp: 37, condition: "clear-day" },
        { time: "15:00", temp: 39, condition: "clear-day" },
        { time: "18:00", temp: 33, condition: "clear-day" },
      ]},
      { day: "Sat", temp_min: 25, temp_max: 40, condition: "clear-day", description: "Extremely hot", hourly: [
        { time: "09:00", temp: 31, condition: "clear-day" },
        { time: "12:00", temp: 38, condition: "clear-day" },
        { time: "15:00", temp: 40, condition: "clear-day" },
        { time: "18:00", temp: 34, condition: "clear-day" },
      ]}
    ]
  },
  reykjavik: {
    name: "Reykjavik",
    country: "IS",
    temp: -2,
    feels_like: -7,
    temp_min: -5,
    temp_max: 1,
    condition: "snow",
    description: "Moderate snow flurries",
    humidity: 82,
    wind_speed: 25,
    wind_deg: 0, // North
    uv_index: 0,
    visibility: 4,
    pressure: 998,
    sunrise: 1782201600,
    sunset: 1782223200,
    hourly: [
      { time: "12:00", temp: -1, condition: "snow" },
      { time: "13:00", temp: -1, condition: "snow" },
      { time: "14:00", temp: -2, condition: "snow" },
      { time: "15:00", temp: -2, condition: "snow" },
      { time: "16:00", temp: -3, condition: "snow" },
      { time: "17:00", temp: -3, condition: "snow" },
      { time: "18:00", temp: -4, condition: "snow" },
      { time: "19:00", temp: -4, condition: "snow" },
      { time: "20:00", temp: -4, condition: "snow" },
      { time: "21:00", temp: -5, condition: "snow" },
      { time: "22:00", temp: -5, condition: "snow" },
      { time: "23:00", temp: -5, condition: "snow" },
    ],
    forecast: [
      { day: "Today", temp_min: -5, temp_max: 1, condition: "snow", description: "Snowing", hourly: [
        { time: "09:00", temp: -3, condition: "snow" },
        { time: "12:00", temp: -1, condition: "snow" },
        { time: "15:00", temp: -2, condition: "snow" },
        { time: "18:00", temp: -4, condition: "snow" },
      ]},
      { day: "Wed", temp_min: -7, temp_max: -1, condition: "snow", description: "Heavy snow", hourly: [
        { time: "09:00", temp: -5, condition: "snow" },
        { time: "12:00", temp: -2, condition: "snow" },
        { time: "15:00", temp: -3, condition: "snow" },
        { time: "18:00", temp: -6, condition: "snow" },
      ]},
      { day: "Thu", temp_min: -8, temp_max: -2, condition: "snow", description: "Blizzard conditions", hourly: [
        { time: "09:00", temp: -6, condition: "snow" },
        { time: "12:00", temp: -4, condition: "snow" },
        { time: "15:00", temp: -4, condition: "snow" },
        { time: "18:00", temp: -7, condition: "snow" },
      ]},
      { day: "Fri", temp_min: -6, temp_max: 0, condition: "cloudy", description: "Overcast", hourly: [
        { time: "09:00", temp: -4, condition: "cloudy" },
        { time: "12:00", temp: -1, condition: "cloudy" },
        { time: "15:00", temp: -1, condition: "cloudy" },
        { time: "18:00", temp: -3, condition: "cloudy" },
      ]},
      { day: "Sat", temp_min: -4, temp_max: 2, condition: "clear-day", description: "Cold but sunny", hourly: [
        { time: "09:00", temp: -2, condition: "clear-day" },
        { time: "12:00", temp: 1, condition: "clear-day" },
        { time: "15:00", temp: 2, condition: "clear-day" },
        { time: "18:00", temp: -1, condition: "clear-night" },
      ]}
    ]
  },
  sydney: {
    name: "Sydney",
    country: "AU",
    temp: 20,
    feels_like: 20,
    temp_min: 15,
    temp_max: 24,
    condition: "clear-day",
    description: "Mild and sunny",
    humidity: 55,
    wind_speed: 10,
    wind_deg: 120, // Southeast
    uv_index: 5,
    visibility: 10,
    pressure: 1022,
    sunrise: 1782189600,
    sunset: 1782231600,
    hourly: [
      { time: "12:00", temp: 22, condition: "clear-day" },
      { time: "13:00", temp: 23, condition: "clear-day" },
      { time: "14:00", temp: 24, condition: "clear-day" },
      { time: "15:00", temp: 23, condition: "clear-day" },
      { time: "16:00", temp: 22, condition: "clear-day" },
      { time: "17:00", temp: 21, condition: "clear-day" },
      { time: "18:00", temp: 19, condition: "clear-day" },
      { time: "19:00", temp: 18, condition: "clear-night" },
      { time: "20:00", temp: 17, condition: "clear-night" },
      { time: "21:00", temp: 17, condition: "clear-night" },
      { time: "22:00", temp: 16, condition: "clear-night" },
      { time: "23:00", temp: 15, condition: "clear-night" },
    ],
    forecast: [
      { day: "Today", temp_min: 15, temp_max: 24, condition: "clear-day", description: "Clear weather", hourly: [
        { time: "09:00", temp: 17, condition: "clear-day" },
        { time: "12:00", temp: 22, condition: "clear-day" },
        { time: "15:00", temp: 23, condition: "clear-day" },
        { time: "18:00", temp: 19, condition: "clear-day" },
      ]},
      { day: "Wed", temp_min: 14, temp_max: 23, condition: "clear-day", description: "Sunny intervals", hourly: [
        { time: "09:00", temp: 16, condition: "clear-day" },
        { time: "12:00", temp: 21, condition: "clear-day" },
        { time: "15:00", temp: 22, condition: "clear-day" },
        { time: "18:00", temp: 18, condition: "clear-night" },
      ]},
      { day: "Thu", temp_min: 15, temp_max: 22, condition: "cloudy", description: "Passing clouds", hourly: [
        { time: "09:00", temp: 17, condition: "cloudy" },
        { time: "12:00", temp: 21, condition: "cloudy" },
        { time: "15:00", temp: 22, condition: "cloudy" },
        { time: "18:00", temp: 18, condition: "cloudy" },
      ]},
      { day: "Fri", temp_min: 13, temp_max: 21, condition: "rain", description: "Passing showers", hourly: [
        { time: "09:00", temp: 15, condition: "cloudy" },
        { time: "12:00", temp: 19, condition: "rain" },
        { time: "15:00", temp: 20, condition: "rain" },
        { time: "18:00", temp: 16, condition: "cloudy" },
      ]},
      { day: "Sat", temp_min: 14, temp_max: 24, condition: "clear-day", description: "Sunny and clear", hourly: [
        { time: "09:00", temp: 16, condition: "clear-day" },
        { time: "12:00", temp: 22, condition: "clear-day" },
        { time: "15:00", temp: 23, condition: "clear-day" },
        { time: "18:00", temp: 19, condition: "clear-night" },
      ]}
    ]
  },
  mumbai: {
    name: "Mumbai",
    country: "IN",
    temp: 31,
    feels_like: 36,
    temp_min: 28,
    temp_max: 33,
    condition: "rain",
    description: "Monsoon showers",
    humidity: 85,
    wind_speed: 25,
    wind_deg: 240, // Southwest
    uv_index: 6,
    visibility: 5,
    pressure: 1002,
    sunrise: 1782187200,
    sunset: 1782234000,
    hourly: [
      { time: "12:00", temp: 31, condition: "rain" },
      { time: "13:00", temp: 31, condition: "rain" },
      { time: "14:00", temp: 32, condition: "cloudy" },
      { time: "15:00", temp: 31, condition: "rain" },
      { time: "16:00", temp: 30, condition: "rain" },
      { time: "17:00", temp: 30, condition: "cloudy" },
      { time: "18:00", temp: 29, condition: "rain" },
      { time: "19:00", temp: 29, condition: "rain" },
      { time: "20:00", temp: 28, condition: "cloudy" },
      { time: "21:00", temp: 28, condition: "cloudy" },
      { time: "22:00", temp: 28, condition: "rain" },
      { time: "23:00", temp: 28, condition: "rain" },
    ],
    forecast: [
      { day: "Today", temp_min: 28, temp_max: 33, condition: "rain", description: "Heavy showers", hourly: [
        { time: "09:00", temp: 29, condition: "rain" },
        { time: "12:00", temp: 31, condition: "rain" },
        { time: "15:00", temp: 31, condition: "rain" },
        { time: "18:00", temp: 29, condition: "cloudy" },
      ]},
      { day: "Wed", temp_min: 28, temp_max: 32, condition: "rain", description: "Scattered thunderstorms", hourly: [
        { time: "09:00", temp: 29, condition: "cloudy" },
        { time: "12:00", temp: 31, condition: "rain" },
        { time: "15:00", temp: 32, condition: "rain" },
        { time: "18:00", temp: 29, condition: "rain" },
      ]},
      { day: "Thu", temp_min: 27, temp_max: 31, condition: "cloudy", description: "Mostly cloudy", hourly: [
        { time: "09:00", temp: 28, condition: "cloudy" },
        { time: "12:00", temp: 30, condition: "cloudy" },
        { time: "15:00", temp: 31, condition: "cloudy" },
        { time: "18:00", temp: 29, condition: "rain" },
      ]},
      { day: "Fri", temp_min: 28, temp_max: 33, condition: "rain", description: "Intermittent rain", hourly: [
        { time: "09:00", temp: 29, condition: "rain" },
        { time: "12:00", temp: 32, condition: "cloudy" },
        { time: "15:00", temp: 33, condition: "rain" },
        { time: "18:00", temp: 30, condition: "rain" },
      ]},
      { day: "Sat", temp_min: 28, temp_max: 34, condition: "cloudy", description: "Partly sunny", hourly: [
        { time: "09:00", temp: 29, condition: "cloudy" },
        { time: "12:00", temp: 33, condition: "cloudy" },
        { time: "15:00", temp: 34, condition: "clear-day" },
        { time: "18:00", temp: 30, condition: "cloudy" },
      ]}
    ]
  },
  delhi: {
    name: "New Delhi",
    country: "IN",
    temp: 34,
    feels_like: 36,
    temp_min: 28,
    temp_max: 38,
    condition: "clear-day",
    description: "Hot and sunny",
    humidity: 40,
    wind_speed: 15,
    wind_deg: 270, // West
    uv_index: 9,
    visibility: 6,
    pressure: 1005,
    sunrise: 1782181200,
    sunset: 1782231600,
    hourly: [
      { time: "12:00", temp: 34, condition: "clear-day" },
      { time: "13:00", temp: 36, condition: "clear-day" },
      { time: "14:00", temp: 37, condition: "clear-day" },
      { time: "15:00", temp: 38, condition: "clear-day" },
      { time: "16:00", temp: 37, condition: "clear-day" },
      { time: "17:00", temp: 35, condition: "clear-day" },
      { time: "18:00", temp: 33, condition: "clear-day" },
      { time: "19:00", temp: 31, condition: "clear-night" },
      { time: "20:00", temp: 30, condition: "clear-night" },
      { time: "21:00", temp: 29, condition: "clear-night" },
      { time: "22:00", temp: 28, condition: "clear-night" },
      { time: "23:00", temp: 28, condition: "clear-night" },
    ],
    forecast: [
      { day: "Today", temp_min: 28, temp_max: 38, condition: "clear-day", description: "Hot and sunny", hourly: [
        { time: "09:00", temp: 30, condition: "clear-day" },
        { time: "12:00", temp: 34, condition: "clear-day" },
        { time: "15:00", temp: 38, condition: "clear-day" },
        { time: "18:00", temp: 33, condition: "clear-day" },
      ]},
      { day: "Wed", temp_min: 27, temp_max: 37, condition: "clear-day", description: "Sunny", hourly: [
        { time: "09:00", temp: 29, condition: "clear-day" },
        { time: "12:00", temp: 35, condition: "clear-day" },
        { time: "15:00", temp: 37, condition: "clear-day" },
        { time: "18:00", temp: 32, condition: "clear-day" },
      ]},
      { day: "Thu", temp_min: 28, temp_max: 39, condition: "clear-day", description: "Very hot", hourly: [
        { time: "09:00", temp: 31, condition: "clear-day" },
        { time: "12:00", temp: 36, condition: "clear-day" },
        { time: "15:00", temp: 39, condition: "clear-day" },
        { time: "18:00", temp: 34, condition: "clear-day" },
      ]},
      { day: "Fri", temp_min: 29, temp_max: 40, condition: "cloudy", description: "Partly cloudy", hourly: [
        { time: "09:00", temp: 32, condition: "cloudy" },
        { time: "12:00", temp: 37, condition: "cloudy" },
        { time: "15:00", temp: 40, condition: "cloudy" },
        { time: "18:00", temp: 35, condition: "cloudy" },
      ]},
      { day: "Sat", temp_min: 28, temp_max: 37, condition: "rain", description: "Scattered showers", hourly: [
        { time: "09:00", temp: 30, condition: "cloudy" },
        { time: "12:00", temp: 34, condition: "rain" },
        { time: "15:00", temp: 37, condition: "rain" },
        { time: "18:00", temp: 32, condition: "cloudy" },
      ]}
    ]
  },
  bangalore: {
    name: "Bangalore",
    country: "IN",
    temp: 26,
    feels_like: 27,
    temp_min: 21,
    temp_max: 30,
    condition: "cloudy",
    description: "Pleasant and breezy",
    humidity: 60,
    wind_speed: 18,
    wind_deg: 260, // West
    uv_index: 7,
    visibility: 8,
    pressure: 1011,
    sunrise: 1782181200,
    sunset: 1782226200,
    hourly: [
      { time: "12:00", temp: 26, condition: "cloudy" },
      { time: "13:00", temp: 27, condition: "cloudy" },
      { time: "14:00", temp: 28, condition: "cloudy" },
      { time: "15:00", temp: 28, condition: "cloudy" },
      { time: "16:00", temp: 27, condition: "cloudy" },
      { time: "17:00", temp: 26, condition: "cloudy" },
      { time: "18:00", temp: 25, condition: "cloudy" },
      { time: "19:00", temp: 24, condition: "clear-night" },
      { time: "20:00", temp: 23, condition: "clear-night" },
      { time: "21:00", temp: 22, condition: "clear-night" },
      { time: "22:00", temp: 22, condition: "clear-night" },
      { time: "23:00", temp: 21, condition: "clear-night" },
    ],
    forecast: [
      { day: "Today", temp_min: 21, temp_max: 30, condition: "cloudy", description: "Pleasant", hourly: [
        { time: "09:00", temp: 23, condition: "cloudy" },
        { time: "12:00", temp: 26, condition: "cloudy" },
        { time: "15:00", temp: 28, condition: "cloudy" },
        { time: "18:00", temp: 25, condition: "cloudy" },
      ]},
      { day: "Wed", temp_min: 20, temp_max: 29, condition: "rain", description: "Light showers", hourly: [
        { time: "09:00", temp: 22, condition: "cloudy" },
        { time: "12:00", temp: 25, condition: "rain" },
        { time: "15:00", temp: 27, condition: "rain" },
        { time: "18:00", temp: 24, condition: "cloudy" },
      ]},
      { day: "Thu", temp_min: 21, temp_max: 31, condition: "clear-day", description: "Sunny", hourly: [
        { time: "09:00", temp: 24, condition: "clear-day" },
        { time: "12:00", temp: 28, condition: "clear-day" },
        { time: "15:00", temp: 31, condition: "clear-day" },
        { time: "18:00", temp: 26, condition: "clear-night" },
      ]},
      { day: "Fri", temp_min: 22, temp_max: 32, condition: "cloudy", description: "Mostly cloudy", hourly: [
        { time: "09:00", temp: 25, condition: "cloudy" },
        { time: "12:00", temp: 29, condition: "cloudy" },
        { time: "15:00", temp: 32, condition: "cloudy" },
        { time: "18:00", temp: 27, condition: "cloudy" },
      ]},
      { day: "Sat", temp_min: 21, temp_max: 29, condition: "rain", description: "Afternoon thunderstorms", hourly: [
        { time: "09:00", temp: 24, condition: "cloudy" },
        { time: "12:00", temp: 27, condition: "rain" },
        { time: "15:00", temp: 29, condition: "rain" },
        { time: "18:00", temp: 25, condition: "cloudy" },
      ]}
    ]
  }
};

export const searchCities = async (query) => {
  await new Promise(resolve => setTimeout(resolve, 300)); // Mock latency
  const cleanQuery = query.toLowerCase().replace(/\s+/g, "");
  if (!cleanQuery) return [];
  
  return Object.keys(MOCK_WEATHER_DATA)
    .filter(key => key.includes(cleanQuery) || MOCK_WEATHER_DATA[key].name.toLowerCase().includes(cleanQuery))
    .map(key => {
      const data = MOCK_WEATHER_DATA[key];
      return {
        key,
        name: data.name,
        country: data.country,
        temp: data.temp,
        condition: data.condition,
        humidity: data.humidity,
        wind_speed: data.wind_speed,
        description: data.description
      };
    });
};

export const getWeatherForCity = async (cityKey) => {
  await new Promise(resolve => setTimeout(resolve, 400)); // Mock latency
  const cleanKey = cityKey.toLowerCase().replace(/\s+/g, "");
  const data = MOCK_WEATHER_DATA[cleanKey];
  if (!data) {
    throw new Error(`City "${cityKey}" not found in Breezy database.`);
  }
  return JSON.parse(JSON.stringify(data)); // Deep clone so state modifications don't mutate mock data
};

export const getFallbackCity = () => {
  return "tokyo";
};
