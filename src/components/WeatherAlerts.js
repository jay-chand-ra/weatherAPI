import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Typography, Box, Card, CardContent, Alert, useTheme } from '@mui/material';

const WeatherAlerts = ({ weatherData }) => {
  const [tempThreshold, setTempThreshold] = useState(35);
  const [alerts, setAlerts] = useState([]);
  const theme = useTheme();

  const checkAlerts = useCallback(() => {
    if (weatherData) {
      const newAlerts = [];
      if (weatherData.temp > tempThreshold) {
        newAlerts.push(`Temperature (${weatherData.temp.toFixed(1)}°C) exceeds threshold of ${tempThreshold}°C`);
      }
      setAlerts(newAlerts);
    }
  }, [weatherData, tempThreshold]);

  useEffect(() => {
    if (weatherData) {
      checkAlerts();
    }
  }, [weatherData, checkAlerts]);

  return (
    <Card elevation={3} sx={{ borderRadius: 2, height: '100%', bgcolor: theme.palette.background.paper }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>Weather Alerts</Typography>
        <TextField
          type="number"
          label="Temperature Threshold (°C)"
          value={tempThreshold}
          onChange={(e) => setTempThreshold(Number(e.target.value))}
          sx={{ mb: 2 }}
          fullWidth
        />
        <Box>
          {weatherData ? (
            alerts.length > 0 ? (
              alerts.map((alert, index) => (
                <Alert key={index} severity="warning" sx={{ mb: 1 }}>{alert}</Alert>
              ))
            ) : (
              <Alert severity="info">No alerts at this time.</Alert>
            )
          ) : (
            <Typography>Loading weather data...</Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default WeatherAlerts;
