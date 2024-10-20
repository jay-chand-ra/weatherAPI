import axios from 'axios';

const API_KEY = '18d778fc3cfc2fdfc5ab3f4adc6aba38'; // Use this API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const fetchWeatherData = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric'
      }
    });

    const data = response.data;
    return {
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      description: data.weather[0].main,
      pressure: data.main.pressure
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

export const fetchForecastData = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric'
      }
    });

    const data = response.data;
    return data.list.filter((item, index) => index % 8 === 0).map(item => ({
      dt: item.dt,
      temp: {
        day: item.main.temp,
        min: item.main.temp_min,
        max: item.main.temp_max
      },
      feels_like: item.main.feels_like,
      humidity: item.main.humidity,
      wind_speed: item.wind.speed,
      weather: item.weather[0]
    }));
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    throw error;
  }
};

// Simulated historical data using forecast data
export const fetchHistoricalData = async (city) => {
  try {
    const forecastData = await fetchForecastData(city);
    const currentDate = Math.floor(Date.now() / 1000);
    const fiveDaysAgo = currentDate - (5 * 24 * 60 * 60);
    
    return forecastData.map(item => ({
      dt: item.dt - (6 * 24 * 60 * 60), // Shift dates back by 6 days to simulate past data
      temp: item.temp.day,
      feels_like: item.feels_like ? item.feels_like.day : item.temp.day, // Use feels_like if available, otherwise use temp
      humidity: item.humidity,
      wind_speed: item.wind_speed || Math.random() * 10 // Use actual wind speed if available, otherwise generate a random value
    })).filter(item => item.dt >= fiveDaysAgo && item.dt <= currentDate);
  } catch (error) {
    console.error("Error fetching historical data:", error);
    throw error;
  }
};
