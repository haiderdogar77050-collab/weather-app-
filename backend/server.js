const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("MongoDB error:", error.message);
  });


// Weather route
app.get("/api/weather/:city", async (req, res) => {

  try {

    const city = req.params.city;

    // First find city coordinates
    const locationResponse = await axios.get(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`
    );

    if (!locationResponse.data.results) {
      return res.status(404).json({
        message: "City not found"
      });
    }

    const location = locationResponse.data.results[0];

    const latitude = location.latitude;
    const longitude = location.longitude;


    // Get weather
    const weatherResponse = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&timezone=auto`
    );

    const weather = weatherResponse.data.current;


    res.json({
      city: location.name,
      country: location.country,
      temperature: weather.temperature_2m,
      feelsLike: weather.apparent_temperature,
      humidity: weather.relative_humidity_2m,
      windSpeed: weather.wind_speed_10m,
      weatherCode: weather.weather_code
    });

  } catch (error) {

    console.log(error.message);

    res.status(500).json({
      message: "Weather API error"
    });

  }

});


const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});