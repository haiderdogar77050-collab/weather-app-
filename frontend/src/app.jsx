import React, { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const searchWeather = async () => {
    if (!city) {
      setError("Please enter a city");
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `http://localhost:5000/api/weather/${city}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        setWeather(null);
        return;
      }

      setWeather(data);
    } catch (error) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="app">
      <h1>Weather App</h1>

      <div className="search">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <button onClick={searchWeather}>
          Search
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-card">
          <h2>
            {weather.city}, {weather.country}
          </h2>

          <h1>{Math.round(weather.temperature)}°C</h1>

          <p>{weather.description}</p>

          <div className="details">
            <p>Feels Like: {Math.round(weather.feelsLike)}°C</p>
            <p>Humidity: {weather.humidity}%</p>
            <p>Wind: {weather.windSpeed} m/s</p>
            <p>Condition: {weather.condition}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;