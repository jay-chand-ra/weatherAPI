import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { city } = req.query;

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=18d778fc3cfc2fdfc5ab3f4adc6aba38&units=metric`;
  const response = await fetch(apiUrl);
  const data = await response.json();

  const weatherReport = {
    name: data.name,
    main: data.weather[0].main,
    description: data.weather[0].description,
    humidity: data.main.humidity,
    temp_max: data.main.temp_min,
    temp_min: data.main.temp_max,
    speed: data.wind.speed,
  };

  res.status(200).json(weatherReport);
}
