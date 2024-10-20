import React from 'react';
import { 
  Card, CardContent, Typography, Box, Grid, useTheme
} from '@mui/material';
import { WbSunny, Cloud, Opacity, AcUnit } from '@mui/icons-material';

const DailyWeatherSummary = ({ summaries }) => {
  const theme = useTheme();

  const getWeatherIcon = (condition) => {
    if (!condition) return <WbSunny />; // Default icon if condition is undefined
    switch (condition.toLowerCase()) {
      case 'clear': return <WbSunny />;
      case 'clouds': return <Cloud />;
      case 'rain': return <Opacity />;
      case 'snow': return <AcUnit />;
      default: return <WbSunny />;
    }
  };

  if (!summaries || summaries.length === 0) {
    return (
      <Card elevation={3} sx={{ borderRadius: 2, bgcolor: theme.palette.background.paper }}>
        <CardContent>
          <Typography>No daily weather summary available</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={3} sx={{ borderRadius: 2, bgcolor: theme.palette.background.paper }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3, color: theme.palette.primary.main }}>
          Daily Weather Summary
        </Typography>
        <Grid container spacing={2}>
          {summaries.map((summary, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%', bgcolor: theme.palette.background.default }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {summary.date}
                    </Typography>
                    {getWeatherIcon(summary.dominantCondition)}
                  </Box>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    Avg Temp: <strong>{summary.avgTemp}°C</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    Max: {summary.maxTemp}°C | Min: {summary.minTemp}°C
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    Humidity: {summary.avgHumidity}%
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    color: theme.palette.text.secondary 
                  }}>
                    {getWeatherIcon(summary.dominantCondition)}
                    <span style={{ marginLeft: '4px' }}>{summary.dominantCondition}</span>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DailyWeatherSummary;
