import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Autocomplete,
  Slider,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Button,
  Chip,
  IconButton,
  Collapse,
  Rating,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  MyLocation as MyLocationIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useDebounce } from '../../hooks/useDebounce';

const categories = [
  'Restaurant',
  'Bar',
  'Cafe',
  'Community Center',
  'Healthcare',
  'Support Group',
  'Entertainment',
  'Shopping',
  'Education',
  'Sports',
  'Other',
];

const amenities = [
  'Gender-Neutral Restrooms',
  'Wheelchair Accessible',
  'Pride Flags Displayed',
  'LGBTQ+ Owned',
  'Safe Space Certified',
  'Trans-Friendly Healthcare',
  'Support Services',
  'Family-Friendly',
  'Late Night Hours',
  'Private Rooms',
];

const AdvancedSearch = ({ onSearch, initialFilters = {} }) => {
  const theme = useTheme();
  const [filters, setFilters] = useState({
    query: '',
    categories: [],
    amenities: [],
    rating: null,
    verifiedOnly: false,
    distance: 10,
    priceRange: [0, 4],
    accessibility: false,
    openNow: false,
    ...initialFilters,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const debouncedQuery = useDebounce(filters.query, 300);

  // Get user's location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  // Fetch search suggestions
  useEffect(() => {
    if (debouncedQuery) {
      axios
        .get(`/api/locations/suggest?q=${debouncedQuery}`)
        .then((response) => {
          setSuggestions(response.data);
        })
        .catch((error) => {
          console.error('Error fetching suggestions:', error);
        });
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery]);

  // Handle search
  const handleSearch = () => {
    const searchParams = {
      ...filters,
      location: userLocation,
    };
    onSearch(searchParams);
  };

  // Reset filters
  const handleReset = () => {
    setFilters({
      query: '',
      categories: [],
      amenities: [],
      rating: null,
      verifiedOnly: false,
      distance: 10,
      priceRange: [0, 4],
      accessibility: false,
      openNow: false,
    });
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for LGBTQ+ friendly places..."
          value={filters.query}
          onChange={(e) => setFilters({ ...filters, query: e.target.value })}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
            endAdornment: (
              <Box>
                {filters.query && (
                  <IconButton
                    size="small"
                    onClick={() => setFilters({ ...filters, query: '' })}
                  >
                    <ClearIcon />
                  </IconButton>
                )}
                <IconButton onClick={() => setShowFilters(!showFilters)}>
                  <FilterIcon />
                </IconButton>
              </Box>
            ),
          }}
        />
        <Button
          variant="contained"
          sx={{ ml: 1 }}
          onClick={getUserLocation}
          startIcon={<MyLocationIcon />}
        >
          Near Me
        </Button>
      </Box>

      <Collapse in={showFilters}>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Categories
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() => {
                  const newCategories = filters.categories.includes(category)
                    ? filters.categories.filter((c) => c !== category)
                    : [...filters.categories, category];
                  setFilters({ ...filters, categories: newCategories });
                }}
                color={filters.categories.includes(category) ? 'primary' : 'default'}
              />
            ))}
          </Box>

          <Typography variant="subtitle1" gutterBottom>
            Amenities
          </Typography>
          <FormGroup row sx={{ mb: 2 }}>
            {amenities.map((amenity) => (
              <FormControlLabel
                key={amenity}
                control={
                  <Checkbox
                    checked={filters.amenities.includes(amenity)}
                    onChange={(e) => {
                      const newAmenities = e.target.checked
                        ? [...filters.amenities, amenity]
                        : filters.amenities.filter((a) => a !== amenity);
                      setFilters({ ...filters, amenities: newAmenities });
                    }}
                  />
                }
                label={amenity}
              />
            ))}
          </FormGroup>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Minimum Rating
            </Typography>
            <Rating
              value={filters.rating}
              onChange={(event, newValue) => {
                setFilters({ ...filters, rating: newValue });
              }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Distance (km)
            </Typography>
            <Slider
              value={filters.distance}
              onChange={(event, newValue) => {
                setFilters({ ...filters, distance: newValue });
              }}
              min={1}
              max={50}
              valueLabelDisplay="auto"
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Price Range
            </Typography>
            <Slider
              value={filters.priceRange}
              onChange={(event, newValue) => {
                setFilters({ ...filters, priceRange: newValue });
              }}
              min={0}
              max={4}
              step={1}
              marks
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => '💰'.repeat(value + 1)}
            />
          </Box>

          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.verifiedOnly}
                  onChange={(e) =>
                    setFilters({ ...filters, verifiedOnly: e.target.checked })
                  }
                />
              }
              label="Verified Places Only"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.accessibility}
                  onChange={(e) =>
                    setFilters({ ...filters, accessibility: e.target.checked })
                  }
                />
              }
              label="Wheelchair Accessible"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.openNow}
                  onChange={(e) =>
                    setFilters({ ...filters, openNow: e.target.checked })
                  }
                />
              }
              label="Open Now"
            />
          </FormGroup>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button variant="outlined" onClick={handleReset}>
              Reset Filters
            </Button>
            <Button variant="contained" onClick={handleSearch}>
              Apply Filters
            </Button>
          </Box>
        </Box>
      </Collapse>

      {suggestions.length > 0 && (
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            width: '100%',
            maxHeight: 300,
            overflow: 'auto',
            zIndex: 1000,
            mt: 1,
          }}
        >
          {suggestions.map((suggestion) => (
            <Box
              key={suggestion._id}
              sx={{
                p: 1,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
              onClick={() => {
                setFilters({ ...filters, query: suggestion.name });
                setSuggestions([]);
              }}
            >
              <Typography variant="body1">{suggestion.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {suggestion.category} • {suggestion.address}
              </Typography>
            </Box>
          ))}
        </Paper>
      )}
    </Paper>
  );
};

export default AdvancedSearch;
