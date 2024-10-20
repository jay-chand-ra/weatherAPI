import React, { useState, useEffect } from 'react';
import { Grid, FormControl, InputLabel, Select, MenuItem, CircularProgress, Typography, Box } from '@mui/material';
import { fetchCountries, fetchStates, fetchCities } from '../services/locationApi';

function LocationSelector({ onLocationSelect }) {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCountries()
      .then(data => {
        if (data.length === 0) {
          setError("No countries available. Please try again later.");
        } else {
          setCountries(data);
        }
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load countries. Please try again later.");
        setLoading(false);
      });
  }, []);

  const handleCountryChange = (event) => {
    const country = event.target.value;
    setSelectedCountry(country);
    setSelectedState('');
    setSelectedCity('');
    setStates([]);
    setCities([]);

    if (country) {
      setLoading(true);
      fetchStates(country)
        .then(data => {
          setStates(data);
          setLoading(false);
        })
        .catch(err => {
          setError("Failed to load states. Please try again later.");
          setLoading(false);
        });
    }
  };

  const handleStateChange = (event) => {
    const state = event.target.value;
    setSelectedState(state);
    setSelectedCity('');
    setCities([]);

    if (state) {
      setLoading(true);
      fetchCities(state)
        .then(data => {
          setCities(data);
          setLoading(false);
        })
        .catch(err => {
          setError("Failed to load cities. Please try again later.");
          setLoading(false);
        });
    }
  };

  const handleCityChange = (event) => {
    const city = event.target.value;
    setSelectedCity(city);
    onLocationSelect({
      country: selectedCountry,
      state: selectedState,
      city: city
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <FormControl fullWidth>
          <InputLabel>Select Country</InputLabel>
          <Select value={selectedCountry} onChange={handleCountryChange}>
            {countries.map((country) => (
              <MenuItem key={country.country_name} value={country.country_name}>{country.country_name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormControl fullWidth>
          <InputLabel>Select State</InputLabel>
          <Select value={selectedState} onChange={handleStateChange} disabled={!selectedCountry}>
            {states.map((state) => (
              <MenuItem key={state.state_name} value={state.state_name}>{state.state_name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={4}>
        <FormControl fullWidth>
          <InputLabel>Select City</InputLabel>
          <Select value={selectedCity} onChange={handleCityChange} disabled={!selectedState}>
            {cities.map((city) => (
              <MenuItem key={city.city_name} value={city.city_name}>{city.city_name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}

export default LocationSelector;
