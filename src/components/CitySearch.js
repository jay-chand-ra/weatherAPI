import React, { useState } from 'react';
import { searchCities } from '../api/cityApi';
import {
  TextField, Button, Grid, Card, CardContent, Typography,
  CircularProgress, Box, Container, IconButton, InputAdornment
} from '@mui/material';
import { Search, WbSunny, Cloud, Opacity, AcUnit } from '@mui/icons-material';

const CitySearch = () => {
  const [query, setQuery] = useState('');
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const results = await searchCities(query);
      setCities(results);
    } catch (err) {
      setError('Failed to fetch city data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition) => {
    switch (condition.toLowerCase()) {
      case 'clear': return <WbSunny />;
      case 'clouds': return <Cloud />;
      case 'rain': return <Opacity />;
      case 'snow': return <AcUnit />;
      default: return <WbSunny />;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          City Weather Search
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter city name"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch}>
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={handleSearch} disabled={loading}>
          Search
        </Button>
        {loading && <CircularProgress sx={{ ml: 2 }} />}
        {error && <Typography color="error">{error}</Typography>}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {cities.map((city) => (
            <Grid item xs={12} sm={6} md={4} key={city.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {city.name}, {city.sys.country}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {getWeatherIcon(city.weather[0].main)}
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {city.weather[0].description}
                    </Typography>
                  </Box>
                  <Typography variant="h4" component="div">
                    {city.main.temp.toFixed(1)}°C
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Feels like: {city.main.feels_like.toFixed(1)}°C
                  </Typography>
                  <Typography variant="body2">
                    Humidity: {city.main.humidity}%
                  </Typography>
                  <Typography variant="body2">
                    Wind: {city.wind.speed} m/s
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default CitySearch;
