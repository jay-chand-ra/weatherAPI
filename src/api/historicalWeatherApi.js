import axios from 'axios';

const API_KEY = '18d778fc3cfc2fdfc5ab3f4adc6aba38';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast';

export const fetchHistoricalWeatherData = async (city) => {
  console.log('Fetching historical weather data for:', city);

  try {
    const url = `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`;
    console.log('Request URL:', url);
    
    const response = await axios.get(url);
    console.log('Full API response:', response.data);
    
    // Process and summarize the 5-day forecast data
    const dailySummaries = response.data.list.reduce((acc, item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = {
          temps: [],
          conditions: [],
          humidity: [],
        };
      }
      acc[date].temps.push(item.main.temp);
      acc[date].conditions.push(item.weather[0].main);
      acc[date].humidity.push(item.main.humidity);
      return acc;
    }, {});

    const processedData = Object.entries(dailySummaries).map(([date, data]) => ({
      date,
      avgTemp: (data.temps.reduce((sum, temp) => sum + temp, 0) / data.temps.length).toFixed(1),
      maxTemp: Math.max(...data.temps).toFixed(1),
      minTemp: Math.min(...data.temps).toFixed(1),
      dominantCondition: getMostFrequent(data.conditions),
      avgHumidity: (data.humidity.reduce((sum, hum) => sum + hum, 0) / data.humidity.length).toFixed(0),
    }));

    // Sort the data in descending order by date
    processedData.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Limit to 5 days
    return processedData.slice(0, 5);
  } catch (error) {
    console.error('Error fetching historical weather data:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    }
    throw error;
  }
};

function getMostFrequent(arr) {
  return arr.sort((a,b) =>
    arr.filter(v => v === a).length - arr.filter(v => v === b).length
  ).pop();
}
