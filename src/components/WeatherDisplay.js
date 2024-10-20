import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Slider, Grid, Card, CardContent, IconButton, Tooltip } from '@mui/material';
import { fetchWeatherData, fetchForecastData, fetchHistoricalData } from '../api/weatherApi';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import OpacityIcon from '@mui/icons-material/Opacity';
import AirIcon from '@mui/icons-material/Air';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import WbTwilightIcon from '@mui/icons-material/WbTwilight';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import SpeedIcon from '@mui/icons-material/Speed';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer, Area, ComposedChart } from 'recharts';
import { motion } from 'framer-motion';

function WeatherDisplay({ location, darkMode }) {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [temperatureThreshold, setTemperatureThreshold] = useState(35);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [current, forecast, historical] = await Promise.all([
          fetchWeatherData(location.city),
          fetchForecastData(location.city),
          fetchHistoricalData(location.city)
        ]);
        setWeatherData(current);
        setForecastData(forecast);
        setHistoricalData(historical);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setError("Failed to load weather data. Please try again later.");
        setLoading(false);
      }
    };

    if (location.city) {
      fetchData();
    }
  }, [location]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!weatherData || !forecastData || !historicalData) return null;

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case 'clear': return <WbSunnyIcon fontSize="large" />;
      case 'clouds': return <CloudIcon fontSize="large" />;
      case 'rain': return <OpacityIcon fontSize="large" />;
      case 'thunderstorm': return <ThunderstormIcon fontSize="large" />;
      case 'snow': return <AcUnitIcon fontSize="large" />;
      default: return <WbTwilightIcon fontSize="large" />;
    }
  };

  const cardStyle = {
    backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)',
    color: darkMode ? 'white' : 'black',
    transition: 'background-color 0.3s ease-in-out, color 0.3s ease-in-out',
    backdropFilter: 'blur(10px)',
    borderRadius: '15px',
    boxShadow: darkMode ? '0 4px 30px rgba(0, 0, 0, 0.1)' : '0 4px 30px rgba(0, 0, 0, 0.1)',
  };

  const formatHistoricalData = (data) => {
    return data.map(item => ({
      dt: item.dt,
      temp: typeof item.temp === 'object' ? item.temp.day : item.temp,
      humidity: item.humidity,
      feels_like: typeof item.feels_like === 'object' ? item.feels_like.day : item.feels_like,
      wind_speed: item.wind_speed || 0
    })).sort((a, b) => b.dt - a.dt); // Sort from latest to earliest
  };

  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Card sx={{ p: 2, backgroundColor: darkMode ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)' }}>
          <Typography variant="body2">{new Date(label * 1000).toLocaleString()}</Typography>
          {payload.map((entry, index) => (
            <Typography key={index} variant="body2" color={entry.color}>
              {`${entry.name}: ${entry.value.toFixed(2)} ${entry.unit}`}
            </Typography>
          ))}
        </Card>
      );
    }
    return null;
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Card elevation={3} sx={{ ...cardStyle, height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h4">{location.city}</Typography>
                  {getWeatherIcon(weatherData.description)}
                </Box>
                <Typography variant="h2" sx={{ my: 2 }}>{weatherData.temperature.toFixed(1)}°C</Typography>
                <Typography variant="h6" sx={{ mb: 2 }}>{weatherData.description}</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Tooltip title="Feels Like">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ThermostatIcon />
                        <Typography variant="body1" sx={{ ml: 1 }}>{weatherData.feelsLike.toFixed(1)}°C</Typography>
                      </Box>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Tooltip title="Humidity">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <OpacityIcon />
                        <Typography variant="body1" sx={{ ml: 1 }}>{weatherData.humidity}%</Typography>
                      </Box>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Tooltip title="Wind Speed">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AirIcon />
                        <Typography variant="body1" sx={{ ml: 1 }}>{weatherData.windSpeed.toFixed(2)} m/s</Typography>
                      </Box>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Tooltip title="Pressure">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <SpeedIcon />
                        <Typography variant="body1" sx={{ ml: 1 }}>{weatherData.pressure} hPa</Typography>
                      </Box>
                    </Tooltip>
                  </Grid>
                </Grid>
                <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>
                  Last Updated: {new Date().toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Card elevation={3} sx={{ ...cardStyle, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Weather Alerts</Typography>
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
                  sx={{
                    color: darkMode ? 'lightblue' : 'darkblue',
                    '& .MuiSlider-thumb': {
                      backgroundColor: darkMode ? 'white' : 'blue',
                    },
                  }}
                />
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  <IconButton color={weatherData.temperature > temperatureThreshold ? "error" : "info"}>
                    <CompareArrowsIcon />
                  </IconButton>
                  <Typography variant="body1" color={weatherData.temperature > temperatureThreshold ? "error" : "info"}>
                    {weatherData.temperature > temperatureThreshold 
                      ? `Alert: Temperature (${weatherData.temperature}°C) is above the threshold!` 
                      : 'No alerts at this time.'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <Card elevation={3} sx={{ ...cardStyle, mt: 3, p: 2 }}>
          <Typography variant="h6" gutterBottom>Daily Weather Summary</Typography>
          <Grid container spacing={2}>
            {forecastData
              .slice(0, 5)
              .sort((a, b) => b.dt - a.dt)
              .map((day, index) => (
              <Grid item xs={12} sm={6} md={2.4} key={index}>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                >
                  <Paper elevation={1} sx={{ 
                    p: 2, 
                    textAlign: 'center', 
                    backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                    borderRadius: '10px',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: darkMode ? '0 5px 15px rgba(255, 255, 255, 0.1)' : '0 5px 15px rgba(0, 0, 0, 0.1)',
                    }
                  }}>
                    <Typography variant="subtitle2">{new Date(day.dt * 1000).toLocaleDateString()}</Typography>
                    {day.weather && getWeatherIcon(day.weather.main)}
                    <Typography variant="body2">Avg: {day.temp.day.toFixed(1)}°C</Typography>
                    <Typography variant="body2">
                      <AirIcon fontSize="small" style={{ color: 'red' }} /> {day.temp.max.toFixed(1)}°C
                      {' | '}
                      <AcUnitIcon fontSize="small" style={{ color: 'blue' }} /> {day.temp.min.toFixed(1)}°C
                    </Typography>
                    <Typography variant="body2">
                      <OpacityIcon fontSize="small" /> {day.humidity}%
                    </Typography>
                    <Typography variant="body2">{day.weather ? day.weather.main : 'N/A'}</Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Card>
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <Card elevation={3} sx={{ ...cardStyle, mt: 3, p: 2 }}>
          <Typography variant="h6" gutterBottom>Weather Trends (Simulated Historical Data)</Typography>
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={formatHistoricalData(historicalData)}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} />
              <XAxis 
                dataKey="dt" 
                tickFormatter={(unixTime) => new Date(unixTime * 1000).toLocaleDateString()}
                stroke={darkMode ? '#fff' : '#333'}
              />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <ChartTooltip content={customTooltip} />
              <Legend />
              <Area
                type="monotone"
                dataKey="temp"
                name="Temperature"
                stroke="#8884d8"
                fill="url(#colorTemp)"
                fillOpacity={0.3}
                yAxisId="left"
                unit="°C"
              />
              <Line 
                type="monotone" 
                dataKey="feels_like"
                name="Feels Like"
                stroke="#ffc658"
                yAxisId="left"
                unit="°C"
              />
              <Line
                type="monotone"
                dataKey="humidity"
                name="Humidity"
                stroke="#82ca9d"
                yAxisId="right"
                unit="%"
              />
              <Line
                type="monotone"
                dataKey="wind_speed"
                name="Wind Speed"
                stroke="#ff7300"
                yAxisId="right"
                unit="m/s"
              />
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </ComposedChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>
    </Box>
  );
}

export default WeatherDisplay;
