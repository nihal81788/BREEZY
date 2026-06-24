# BREEZY

A dynamic weather application displaying real-time data with interactive 3D elements.

## OpenWeatherMap Integration

This project uses the [OpenWeatherMap API](https://openweathermap.org/api) for live weather data. It specifically consumes:
1. **Geocoding API** (`geo/1.0/direct`): To resolve city names into coordinates.
2. **Current & Forecast API** (`data/2.5/weather` and `data/2.5/forecast`): To fetch real-time and 5-day/3-hour forecast data.

> **Note on UV Index**: The free tier of the OpenWeatherMap API does not provide UV index data. Therefore, the UV index is currently hardcoded to 0 in the UI.

## Environment Setup

Before running the application, you must provide a valid OpenWeatherMap API key.

1. Obtain a free API key from [OpenWeatherMap](https://home.openweathermap.org/users/sign_up).
2. Create a `.env` file in the root directory.
3. Add the following line to your `.env` file:
   ```env
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   ```

## How to use this code

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Launch the project**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.
