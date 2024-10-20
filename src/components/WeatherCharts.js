import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Typography, Box, CircularProgress, useTheme } from '@mui/material';

const WeatherCharts = ({ historicalData }) => {
  const theme = useTheme();

  if (!historicalData || historicalData.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  const chartData = historicalData.map(day => ({
    date: day.date,
    temp: parseFloat(day.avgTemp),
    humidity: parseFloat(day.avgHumidity)
  }));

  return (
    <Box sx={{ bgcolor: theme.palette.background.paper, p: 2, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
        Weather Trends
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
          <XAxis 
            dataKey="date" 
            stroke={theme.palette.text.secondary}
            tick={{ fill: theme.palette.text.primary }}
          />
          <YAxis 
            yAxisId="left" 
            domain={[0, 40]} 
            stroke={theme.palette.primary.main}
            tick={{ fill: theme.palette.text.primary }}
            label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft', fill: theme.palette.text.primary }}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            domain={[0, 100]} 
            stroke={theme.palette.secondary.main}
            tick={{ fill: theme.palette.text.primary }}
            label={{ value: 'Humidity (%)', angle: 90, position: 'insideRight', fill: theme.palette.text.primary }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: theme.palette.background.paper, borderColor: theme.palette.divider }}
            labelStyle={{ color: theme.palette.text.primary }}
          />
          <Legend wrapperStyle={{ color: theme.palette.text.primary }} />
          <Line 
            yAxisId="left" 
            type="monotone" 
            dataKey="temp" 
            stroke={theme.palette.primary.main} 
            name="Temperature (°C)" 
            dot={{ fill: theme.palette.primary.main, r: 4 }}
            activeDot={{ r: 8 }}
          />
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="humidity" 
            stroke={theme.palette.secondary.main} 
            name="Humidity (%)" 
            dot={{ fill: theme.palette.secondary.main, r: 4 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default WeatherCharts;
