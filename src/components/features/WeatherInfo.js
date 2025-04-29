import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function WeatherInfo({ apiKey = "190dfc4fed3386777429b9d4bc2ed376" }) {
  // State for inputs
  const [destination, setDestination] = useState("New Delhi");
  const [temperatureUnit, setTemperatureUnit] = useState("C");
  const [showMap, setShowMap] = useState(false);
  const [coordinates, setCoordinates] = useState(null);

  // State for weather data
  const [weatherData, setWeatherData] = useState({
    temperature: null,
    condition: "Checking weather...",
    humidity: null,
    windSpeed: null,
    icon: null,
    isLoading: true,
    error: null
  });

  // State for forecast data
  const [forecastData, setForecastData] = useState({
    days: [],
    isLoading: false,
    error: null
  });

  // Refs for map
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Initialize map
  useEffect(() => {
    if (showMap && !mapRef.current) {
      const map = L.map('map').setView([20, 0], 2);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Add click handler
      map.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        setCoordinates({ lat, lon: lng });
        
        // Update marker
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng]).addTo(map);
        }
        
        // Reverse geocode to get city name
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await response.json();
          if (data.address?.city || data.address?.town || data.address?.village) {
            const cityName = data.address.city || data.address.town || data.address.village;
            setDestination(cityName);
          }
        } catch (error) {
          console.error('Error in reverse geocoding:', error);
        }
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [showMap]);

  // Fetch current weather
  useEffect(() => {
    if (!destination) return;

    setWeatherData(prev => ({ ...prev, isLoading: true }));

    const fetchWeather = async () => {
      try {
        let url;
        if (coordinates) {
          url = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
        } else {
          url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(destination)}&appid=${apiKey}&units=metric`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error('Weather data not available');

        const data = await response.json();

        // Update coordinates if we searched by city name
        if (!coordinates && data.coord) {
          setCoordinates({ lat: data.coord.lat, lon: data.coord.lon });
        }

        setWeatherData({
          temperature: data.main.temp,
          condition: data.weather[0].description,
          humidity: data.main.humidity,
          windSpeed: data.wind.speed,
          icon: data.weather[0].icon,
          isLoading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching weather:', error);
        setWeatherData({
          temperature: null,
          condition: null,
          humidity: null,
          windSpeed: null,
          icon: null,
          isLoading: false,
          error: "Unable to load weather information. Please check the city name and try again."
        });
      }
    };

    fetchWeather();
  }, [destination, apiKey, coordinates]);

  // Fetch forecast data
  const fetchForecast = async () => {
    if (!coordinates) return;
    
    setForecastData(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`
      );
      
      if (!response.ok) throw new Error('Forecast data not available');
      
      const data = await response.json();
      
      // Group by day and take one reading per day (midday)
      const dailyForecasts = {};
      data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        const hour = new Date(item.dt * 1000).getHours();
        
        // Take the midday forecast (between 11am and 2pm)
        if (hour >= 11 && hour <= 14) {
          dailyForecasts[date] = {
            date,
            temp: item.main.temp,
            condition: item.weather[0].description,
            icon: item.weather[0].icon,
            humidity: item.main.humidity,
            windSpeed: item.wind.speed
          };
        }
      });
      
      // Convert to array and take next 5 days
      const forecastArray = Object.values(dailyForecasts).slice(0, 5);
      
      setForecastData({
        days: forecastArray,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching forecast:', error);
      setForecastData({
        days: [],
        isLoading: false,
        error: "Unable to load forecast information."
      });
    }
  };

  const displayTemperature = (temp) => {
    if (temp === null) return "--";
    if (temperatureUnit === "F") {
      return `${Math.round((temp * 9 / 5) + 32)}°F`;
    }
    return `${Math.round(temp)}°C`;
  };

  const getWeatherIcon = (icon, condition) => {
    if (icon) {
      return (
        <img
          src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
          alt={condition}
          className="w-16 h-16"
        />
      );
    }

    const cond = condition?.toLowerCase() || '';
    if (cond.includes("sunny") || cond.includes("clear")) return "☀️";
    if (cond.includes("partly cloudy")) return "⛅";
    if (cond.includes("cloud")) return "☁️";
    if (cond.includes("rain")) return "🌧️";
    if (cond.includes("snow")) return "❄️";
    if (cond.includes("storm") || cond.includes("thunder")) return "⛈️";
    return "🌡️";
  };

  const formatCityName = (name) => {
    if (!name) return "Unknown Location";
    return name.split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const toggleMap = () => {
    setShowMap(!showMap);
    if (!showMap && coordinates && mapRef.current) {
      mapRef.current.setView([coordinates.lat, coordinates.lon], 10);
      if (!markerRef.current) {
        markerRef.current = L.marker([coordinates.lat, coordinates.lon]).addTo(mapRef.current);
      }
    }
  };

  return (
    <div className="bg-gradient-to-br min-w-1/3 from-blue-50 to-blue-100 rounded-lg shadow p-4 max-w-2xl mx-auto">
      <div className="mb-4 space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter city"
            className="flex-1 p-2 border rounded text-sm"
          />
          <button
            onClick={toggleMap}
            className={`px-3 py-2 rounded text-sm ${showMap ? "bg-blue-600 text-white" : "bg-white border text-blue-500"}`}
          >
            {showMap ? "Hide Map" : "Show Map"}
          </button>
        </div>

        {showMap && (
          <div id="map" className="h-64 rounded-lg border border-gray-300"></div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => setTemperatureUnit("C")}
            className={`px-3 py-1 rounded text-sm ${temperatureUnit === "C" ? "bg-blue-500 text-white" : "bg-white border text-blue-500"}`}
          >
            °C
          </button>
          <button
            onClick={() => setTemperatureUnit("F")}
            className={`px-3 py-1 rounded text-sm ${temperatureUnit === "F" ? "bg-blue-500 text-white" : "bg-white border text-blue-500"}`}
          >
            °F
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-blue-800">Weather Info</h3>
        <span className="text-blue-600">{formatCityName(destination)}</span>
      </div>

      {weatherData.error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{weatherData.error}</p>
          <button
            className="mt-2 text-blue-600 text-sm hover:underline"
            onClick={() => setWeatherData(prev => ({ ...prev, isLoading: true, error: null }))}
          >
            Try again
          </button>
        </div>
      ) : weatherData.isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-blue-200 h-16 w-16 mb-2"></div>
            <div className="h-4 bg-blue-200 rounded w-24 mb-2"></div>
            <div className="h-3 bg-blue-100 rounded w-16"></div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-center my-4">
            <div className="text-5xl mr-4">{getWeatherIcon(weatherData.icon, weatherData.condition)}</div>
            <div>
              <p className="text-3xl font-bold text-blue-900">{displayTemperature(weatherData.temperature)}</p>
              <p className="text-blue-700 capitalize">{weatherData.condition}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="bg-white bg-opacity-70 p-2 rounded">
              <p className="text-sm text-gray-500">Humidity</p>
              <p className="font-medium">{weatherData.humidity}%</p>
            </div>
            <div className="bg-white bg-opacity-70 p-2 rounded">
              <p className="text-sm text-gray-500">Wind</p>
              <p className="font-medium">{weatherData.windSpeed} m/s</p>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={fetchForecast}
              className="text-blue-600 hover:text-blue-800 text-sm hover:underline"
            >
              {forecastData.days.length > 0 ? "Refresh" : "View"} 5-day forecast →
            </button>
            
            {forecastData.isLoading && (
              <div className="mt-4 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}
            
            {forecastData.error && (
              <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-2 text-sm text-red-600">
                {forecastData.error}
              </div>
            )}
            
            {forecastData.days.length > 0 && (
              <div className="mt-4 grid grid-cols-5 gap-2">
                {forecastData.days.map((day, index) => (
                  <div key={index} className="bg-white bg-opacity-70 p-2 rounded text-center">
                    <p className="text-sm font-medium">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <div className="my-1">
                      {getWeatherIcon(day.icon, day.condition)}
                    </div>
                    <p className="font-bold">{displayTemperature(day.temp)}</p>
                    <p className="text-xs capitalize text-gray-600">{day.condition}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}