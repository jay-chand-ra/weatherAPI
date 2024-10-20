import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemText, Paper, Typography } from '@mui/material';

const CityList = ({ cities }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h4" gutterBottom>Cities</Typography>
      <List>
        {cities.map((city) => (
          <ListItem 
            button 
            component={Link} 
            to={`/city/${city.name}`} 
            key={city.name}
          >
            <ListItemText 
              primary={city.name} 
              secondary={`Lat: ${city.lat}, Lon: ${city.lon}`} 
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default CityList;
