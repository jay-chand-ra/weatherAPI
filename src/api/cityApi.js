import axios from 'axios';

const API_KEY = '18d778fc3cfc2fdfc5ab3f4adc6aba38';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/find';

export const searchCities = async (query) => {
  try {
    const url = `${BASE_URL}?q=${query}&type=like&sort=population&cnt=30&appid=${API_KEY}&units=metric`;
    const response = await axios.get(url);
    return response.data.list;
  } catch (error) {
    console.error('Error searching cities:', error);
    throw error;
  }
};
