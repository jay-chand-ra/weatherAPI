import axios from 'axios';

const API_KEY = '18d778fc3cfc2fdfc5ab3f4adc6aba38'; // Use this API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const fetchWeatherData = async (city) => {
  try {
    const response = await axios.get(BASE_URL, {
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
      description: data.weather[0].main
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};
