import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Rating,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import axios from 'axios';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE';

const containerStyle = {
  width: '100%',
  height: 'calc(100vh - 64px)', // Subtract navbar height
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060, // New York City as default
};

const categories = [
  'All',
  'Healthcare',
  'Housing',
  'Food & Drink',
  'Education',
  'Community Center',
  'Entertainment',
  'Other',
];

const Map = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [userPosition, setUserPosition] = useState(null);

  // Fetch locations from the backend
  const fetchLocations = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/locations');
      setLocations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setLoading(false);
    }
  }, []);

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const filteredLocations = locations.filter(
    (location) => selectedCategory === 'All' || location.category === selectedCategory
  );

  const handleMarkerClick = (location) => {
    setSelectedLocation(location);
  };

  const getCategoryColor = (category) => {
    const colors = {
      Healthcare: '#FF0000',
      Housing: '#FFA500',
      'Food & Drink': '#FFFF00',
      Education: '#008000',
      'Community Center': '#0000FF',
      Entertainment: '#4B0082',
      Other: '#9400D3',
    };
    return colors[category] || '#000000';
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="calc(100vh - 64px)"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', height: 'calc(100vh - 64px)' }}>
      <Box
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 1,
          backgroundColor: 'white',
          padding: 2,
          borderRadius: 1,
          boxShadow: 3,
        }}
      >
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            label="Category"
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={userPosition || defaultCenter}
          zoom={12}
          options={{
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }],
              },
            ],
          }}
        >
          {filteredLocations.map((location) => (
            <Marker
              key={location._id}
              position={{
                lat: location.location.coordinates[1],
                lng: location.location.coordinates[0],
              }}
              onClick={() => handleMarkerClick(location)}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: getCategoryColor(location.category),
                fillOpacity: 0.9,
                strokeWeight: 2,
                strokeColor: '#ffffff',
                scale: 10,
              }}
            />
          ))}

          {selectedLocation && (
            <InfoWindow
              position={{
                lat: selectedLocation.location.coordinates[1],
                lng: selectedLocation.location.coordinates[0],
              }}
              onCloseClick={() => setSelectedLocation(null)}
            >
              <Paper sx={{ padding: 2, maxWidth: 300 }}>
                <Typography variant="h6" gutterBottom>
                  {selectedLocation.name}
                </Typography>
                <Chip
                  label={selectedLocation.category}
                  sx={{
                    backgroundColor: getCategoryColor(selectedLocation.category),
                    color: 'white',
                    marginBottom: 1,
                  }}
                />
                <Typography variant="body2" paragraph>
                  {selectedLocation.description}
                </Typography>
                <Typography variant="body2">
                  {`${selectedLocation.address.street}, ${selectedLocation.address.city}`}
                </Typography>
                {selectedLocation.ratings && selectedLocation.ratings.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Rating
                      value={
                        selectedLocation.ratings.reduce((acc, curr) => acc + curr.rating, 0) /
                        selectedLocation.ratings.length
                      }
                      readOnly
                      size="small"
                    />
                    <Typography variant="caption" sx={{ ml: 1 }}>
                      ({selectedLocation.ratings.length} reviews)
                    </Typography>
                  </Box>
                )}
              </Paper>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </Box>
  );
};

export default Map;
