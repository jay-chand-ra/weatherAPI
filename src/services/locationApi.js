const API_BASE_URL = 'https://www.universal-tutorial.com/api';
const API_TOKEN = 'nstqwsN12DWHSeawEdTH3kD0KgNlkxl0aKmP08jysfyQGgcHo_2BI0t1mK4xFZ0J2-o';
const USER_EMAIL = 'bbraoedge@gmail.com';

let accessToken = null;

const getAccessToken = async () => {
  if (accessToken) return accessToken;

  try {
    const response = await fetch(`${API_BASE_URL}/getaccesstoken`, {
      headers: {
        "Accept": "application/json",
        "api-token": API_TOKEN,
        "user-email": USER_EMAIL
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    accessToken = data.auth_token;
    return accessToken;
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw error;
  }
};

const fetchData = async (endpoint) => {
  try {
    const token = await getAccessToken();
    console.log(`Fetching data from ${endpoint}...`);
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log(`Data received from ${endpoint}:`, data);
    return data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    return [];
  }
};

export const fetchCountries = async () => {
  return await fetchData('countries');
};

export const fetchStates = async (country) => {
  return await fetchData(`states/${country}`);
};

export const fetchCities = async (state) => {
  return await fetchData(`cities/${state}`);
};

// Helper function to get unique regions from countries
export const getUniqueRegions = (countries) => {
  // This API doesn't provide regions, so we'll return an empty array
  // You may want to create your own list of regions or remove this functionality
  return [];
};

export const fetchWeatherData = async (city, country) => {
  const apiKey = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&units=metric&appid=${apiKey}`);
    
    if (response.status === 401) {
      throw new Error("Invalid API key. Please check your OpenWeatherMap API key.");
    }
    
    if (!response.ok) {
      throw new Error("Failed to fetch current weather data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching current weather data:", error);
    throw error;
  }
};
