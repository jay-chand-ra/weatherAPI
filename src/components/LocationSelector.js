import React, { useState, useEffect } from 'react';
import { Grid, Autocomplete, TextField, Box } from '@mui/material';
import { fetchCountries, fetchStates, fetchCities } from '../services/locationApi';

function LocationSelector({ onLocationSelect, darkMode }) {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    fetchCountries().then(setCountries);
  }, []);

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={4}>
          <Autocomplete
            options={countries}
            getOptionLabel={(option) => option.country_name}
            renderInput={(params) => <TextField {...params} label="Select Country" />}
            onChange={(event, newValue) => {
              setSelectedCountry(newValue?.country_name || '');
              setSelectedState('');
              setSelectedCity('');
              if (newValue) fetchStates(newValue.country_name).then(setStates);
            }}
            sx={{ backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Autocomplete
            options={states}
            getOptionLabel={(option) => option.state_name}
            renderInput={(params) => <TextField {...params} label="Select State" />}
            onChange={(event, newValue) => {
              setSelectedState(newValue?.state_name || '');
              setSelectedCity('');
              if (newValue) fetchCities(newValue.state_name).then(setCities);
            }}
            disabled={!selectedCountry}
            sx={{ backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Autocomplete
            options={cities}
            getOptionLabel={(option) => option.city_name}
            renderInput={(params) => <TextField {...params} label="Select City" />}
            onChange={(event, newValue) => {
              setSelectedCity(newValue?.city_name || '');
              if (newValue) onLocationSelect({ country: selectedCountry, state: selectedState, city: newValue.city_name });
            }}
            disabled={!selectedState}
            sx={{ backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default LocationSelector;
