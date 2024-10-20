import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Slider, Grid } from '@mui/material';
import { fetchWeatherData } from '../api/weatherApi';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import OpacityIcon from '@mui/icons-material/Opacity';
import AirIcon from '@mui/icons-material/Air';

function WeatherDisplay({ location }) {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [temperatureThreshold, setTemperatureThreshold] = useState(35);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchWeatherData(location.city);
        setWeatherData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setError("Failed to load weather data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, [location]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!weatherData) return null;

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case 'clouds': return <CloudIcon />;
      case 'rain': return <OpacityIcon />;
      default: return <WbSunnyIcon />;
    }
  };

  const dailySummary = [
    { date: '10/20/2024', avgTemp: 22, maxTemp: 28, minTemp: 15, humidity: 68, condition: 'Rain' },
    { date: '10/19/2024', avgTemp: 28, maxTemp: 26, minTemp: 16, humidity: 76, condition: 'Clouds' },
    { date: '10/18/2024', avgTemp: 24, maxTemp: 25, minTemp: 18, humidity: 70, condition: 'Clouds' },
    { date: '10/17/2024', avgTemp: 25, maxTemp: 29, minTemp: 19, humidity: 77, condition: 'Rain' },
    { date: '10/16/2024', avgTemp: 24, maxTemp: 27, minTemp: 18, humidity: 74, condition: 'Clouds' },
  ];

  return (
    <Box sx={{ mt: 2, mx: 2 }}>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {getWeatherIcon(weatherData.description)}
          <Typography variant="h5" sx={{ ml: 1 }}>{location.city}</Typography>
        </Box>
        <Typography variant="body1">{weatherData.description}</Typography>
        <Typography variant="h2" sx={{ my: 1 }}>{weatherData.temperature.toFixed(1)}°C</Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="body2">Feels Like: {weatherData.feelsLike.toFixed(1)}°C</Typography>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <OpacityIcon fontSize="small" />
              <Typography variant="body2" sx={{ ml: 0.5 }}>Humidity: {weatherData.humidity}%</Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AirIcon fontSize="small" />
              <Typography variant="body2" sx={{ ml: 0.5 }}>Wind Speed: {weatherData.windSpeed.toFixed(2)} m/s</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">Weather Alerts</Typography>
        <Typography variant="body2">Temperature Threshold (°C)</Typography>
        <Slider
          value={temperatureThreshold}
          onChange={(_, newValue) => setTemperatureThreshold(newValue)}
          aria-label="Temperature Threshold"
          valueLabelDisplay="auto"
          step={1}
          marks
          min={0}
          max={50}
        />
        <Typography variant="body2">No alerts at this time.</Typography>
      </Paper>

      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Daily Weather Summary</Typography>
        {dailySummary.map((day, index) => (
          <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ width: '20%' }}>{day.date}</Typography>
            <Typography variant="body2" sx={{ width: '20%' }}>Avg Temp: {day.avgTemp}°C</Typography>
            <Typography variant="body2" sx={{ width: '30%' }}>Max: {day.maxTemp}°C, Min: {day.minTemp}°C</Typography>
            <Typography variant="body2" sx={{ width: '20%' }}>Humidity: {day.humidity}%</Typography>
            <Box sx={{ width: '10%' }}>{getWeatherIcon(day.condition)}</Box>
          </Box>
        ))}
      </Paper>

      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6">Weather Trends</Typography>
        <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body2">Weather trend graph placeholder</Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default WeatherDisplay;
