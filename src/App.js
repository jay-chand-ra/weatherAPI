import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Container, Box, ThemeProvider, createTheme, CssBaseline, IconButton, AppBar, Toolbar, Typography } from '@mui/material';
import { teal, amber, blue } from '@mui/material/colors';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LocationSelector from './components/LocationSelector';
import WeatherDisplay from './components/WeatherDisplay';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: darkMode ? teal : blue,
      secondary: amber,
      background: {
        default: darkMode ? '#121212' : '#f0f8ff',
        paper: darkMode ? '#1e1e1e' : 'rgba(255, 255, 255, 0.8)',
      },
    },
    typography: {
      fontFamily: '"Poppins", "Roboto", "Arial", sans-serif',
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backdropFilter: 'blur(10px)',
          },
        },
      },
    },
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ 
          minHeight: '100vh', 
          background: darkMode 
            ? 'linear-gradient(135deg, #1c1c1c 0%, #2c3e50 100%)'
            : 'linear-gradient(135deg, #e0f7fa 0%, #4fc3f7 100%)',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
        }}>
          <AppBar position="static" color="transparent" elevation={0}>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Weather Monitoring System
              </Typography>
              <IconButton onClick={toggleDarkMode} color="inherit">
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Toolbar>
          </AppBar>
          <Container maxWidth="lg" sx={{ mt: 4 }}>
            <LocationSelector onLocationSelect={handleLocationSelect} />
            {selectedLocation && <WeatherDisplay location={selectedLocation} />}
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
