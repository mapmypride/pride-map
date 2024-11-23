// Replace this with your actual Google Maps API key
export const GOOGLE_MAPS_API_KEY = 'YOUR_API_KEY_HERE';

// API URLs
export const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.mapmypride.com'  // Replace with your production API URL
  : 'http://localhost:5000';      // Local development API URL
