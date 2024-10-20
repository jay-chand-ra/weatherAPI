import React from 'react';
import { render, screen } from '@testing-library/react';
import WeatherDisplay from './WeatherDisplay';

const mockWeatherData = {
  name: 'Test City',
  main: 'Cloudy',
  description: 'Overcast clouds',
  temp: 20,
  feels_like: 18,
  humidity: 70,
  temp_min: 18,
  temp_max: 22,
  speed: 5,
  dt: 1634654400
};

test('renders weather display component', () => {
  render(<WeatherDisplay weatherData={mockWeatherData} />);
  expect(screen.getByText('Test City')).toBeInTheDocument();
  expect(screen.getByText('Cloudy')).toBeInTheDocument();
  expect(screen.getByText('Temperature: 20.0°C')).toBeInTheDocument();
});
