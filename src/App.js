import React, { useState } from 'react';
import { Container, Typography, Box, Paper, Switch, FormControlLabel, AppBar, Toolbar } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LocationSelector from './components/LocationSelector';
import WeatherDisplay from './components/WeatherDisplay';
import ErrorBoundary from './components/ErrorBoundary';
import { motion } from 'framer-motion';
import AlertSystem from './components/AlertSystem';

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [alerts, setAlerts] = useState([]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  const getBackgroundGradient = () => {
    return darkMode
      ? 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
      : 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)';
  };

  const handleWeatherUpdate = (data) => {
    setWeatherData(data);
  };

  const handleAlertChange = (newAlerts) => {
    setAlerts(newAlerts);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        sx={{
          minHeight: '100vh',
          background: getBackgroundGradient(),
          transition: 'background 0.3s ease-in-out',
        }}
      >
        <AppBar position="static" color="transparent" elevation={0}>
          <Toolbar>
            <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              Weather Monitoring System
            </Typography>
            <FormControlLabel
              control={
                <Switch 
                  checked={darkMode} 
                  onChange={() => setDarkMode(!darkMode)} 
                  color="primary"
                />
              }
              label={darkMode ? "Dark Mode" : "Light Mode"}
            />
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Paper
            component={motion.div}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            elevation={3}
            sx={{ 
              padding: '20px', 
              backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
              transition: 'background-color 0.3s ease-in-out',
              backdropFilter: 'blur(10px)',
              borderRadius: '15px',
            }}
          >
            <LocationSelector onLocationSelect={setSelectedLocation} darkMode={darkMode} />
            <ErrorBoundary>
              {selectedLocation && (
                <>
                  <WeatherDisplay 
                    location={selectedLocation} 
                    darkMode={darkMode} 
                    onWeatherUpdate={handleWeatherUpdate} 
                  />
                  <AlertSystem 
                    weatherData={weatherData} 
                    onAlertChange={handleAlertChange} 
                  />
                </>
              )}
            </ErrorBoundary>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
