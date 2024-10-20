import React, { useState, useEffect } from 'react';
import { Box, Typography, Slider, Paper, List, ListItem, ListItemText, Divider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';

const AlertSystem = ({ weatherData, onAlertChange }) => {
  const [temperatureThreshold, setTemperatureThreshold] = useState(35);
  const [humidityThreshold, setHumidityThreshold] = useState(80);
  const [consecutiveAlerts, setConsecutiveAlerts] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [alertHistory, setAlertHistory] = useState([]);
  const [alertStats, setAlertStats] = useState({ temperature: 0, humidity: 0, consecutive: 0 });

  useEffect(() => {
    if (weatherData) {
      checkThresholds(weatherData);
    }
  }, [weatherData, temperatureThreshold, humidityThreshold]);

  const checkThresholds = (data) => {
    const newAlerts = [];
    const timestamp = new Date().toLocaleString();
    const newAlertStats = { ...alertStats };

    if (data.temperature > temperatureThreshold) {
      newAlerts.push(`Temperature exceeds threshold: ${data.temperature}°C`);
      setConsecutiveAlerts(prev => prev + 1);
      newAlertStats.temperature++;
    } else {
      setConsecutiveAlerts(0);
    }

    if (data.humidity > humidityThreshold) {
      newAlerts.push(`Humidity exceeds threshold: ${data.humidity}%`);
      newAlertStats.humidity++;
    }

    if (consecutiveAlerts >= 1) {
      const criticalAlert = `Alert: Temperature has exceeded ${temperatureThreshold}°C for two consecutive updates!`;
      newAlerts.push(criticalAlert);
      console.log(`Critical Alert: ${criticalAlert}`);
      newAlertStats.consecutive++;
    }

    setAlerts(newAlerts);
    onAlertChange(newAlerts);
    setAlertStats(newAlertStats);

    // Log alerts to history
    if (newAlerts.length > 0) {
      setAlertHistory(prev => [{timestamp, alerts: newAlerts}, ...prev].slice(0, 10));
    }
  };

  const alertChartData = [
    { name: 'Temperature', count: alertStats.temperature },
    { name: 'Humidity', count: alertStats.humidity },
    { name: 'Consecutive', count: alertStats.consecutive },
  ];

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>Weather Alerts</Typography>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1">Temperature Threshold (°C)</Typography>
        <Slider
          value={temperatureThreshold}
          onChange={(_, newValue) => setTemperatureThreshold(newValue)}
          aria-labelledby="temperature-threshold-slider"
          valueLabelDisplay="auto"
          step={1}
          marks
          min={0}
          max={50}
        />
        <Typography variant="subtitle1" sx={{ mt: 2 }}>Humidity Threshold (%)</Typography>
        <Slider
          value={humidityThreshold}
          onChange={(_, newValue) => setHumidityThreshold(newValue)}
          aria-labelledby="humidity-threshold-slider"
          valueLabelDisplay="auto"
          step={1}
          marks
          min={0}
          max={100}
        />
      </Paper>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>Active Alerts</Typography>
        {alerts.length > 0 ? (
          <List>
            {alerts.map((alert, index) => (
              <ListItem key={index}>
                <ListItemText primary={alert} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No active alerts</Typography>
        )}
      </Paper>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>Alert Frequency</Typography>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={alertChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1">Alert History Timeline</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Timeline>
            {alertHistory.map((entry, index) => (
              <TimelineItem key={index}>
                <TimelineSeparator>
                  <TimelineDot color="primary" />
                  {index !== alertHistory.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <Typography variant="body2">{entry.timestamp}</Typography>
                  {entry.alerts.map((alert, alertIndex) => (
                    <Typography key={alertIndex} variant="body2" color="text.secondary">
                      {alert}
                    </Typography>
                  ))}
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default AlertSystem;
