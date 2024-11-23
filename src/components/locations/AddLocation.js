import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Box,
  Stepper,
  Step,
  StepLabel,
  Alert,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { LoadScript, StandaloneSearchBox } from '@react-google-maps/api';

const categories = [
  'Healthcare',
  'Housing',
  'Food & Drink',
  'Education',
  'Community Center',
  'Entertainment',
  'Other',
];

const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const steps = ['Basic Information', 'Location Details', 'Additional Information'];

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  category: Yup.string().required('Category is required'),
  'address.street': Yup.string().required('Street address is required'),
  'address.city': Yup.string().required('City is required'),
  'address.state': Yup.string().required('State is required'),
  'address.country': Yup.string().required('Country is required'),
  'address.postalCode': Yup.string().required('Postal code is required'),
  'contact.email': Yup.string().email('Invalid email address'),
  'contact.phone': Yup.string(),
  'contact.website': Yup.string().url('Invalid URL'),
});

const AddLocation = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [searchBox, setSearchBox] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      category: '',
      address: {
        street: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
      },
      location: {
        type: 'Point',
        coordinates: [0, 0], // [longitude, latitude]
      },
      operatingHours: days.map(day => ({
        day,
        open: '',
        close: '',
      })),
      accessibility: {
        wheelchairAccessible: false,
        parkingAvailable: false,
        publicTransitNearby: false,
      },
      contact: {
        phone: '',
        email: '',
        website: '',
      },
      images: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await axios.post('http://localhost:5000/api/locations', values);
        setSuccess(true);
        setTimeout(() => {
          navigate('/map');
        }, 2000);
      } catch (err) {
        setError(err.response?.data?.message || 'Error submitting location');
      }
    },
  });

  const handlePlaceSelect = () => {
    if (searchBox) {
      const place = searchBox.getPlaces()[0];
      if (place) {
        formik.setValues({
          ...formik.values,
          address: {
            street: place.formatted_address,
            city: place.address_components.find(c => c.types.includes('locality'))?.long_name || '',
            state: place.address_components.find(c => c.types.includes('administrative_area_level_1'))?.long_name || '',
            country: place.address_components.find(c => c.types.includes('country'))?.long_name || '',
            postalCode: place.address_components.find(c => c.types.includes('postal_code'))?.long_name || '',
          },
          location: {
            type: 'Point',
            coordinates: [place.geometry.location.lng(), place.geometry.location.lat()],
          },
        });
      }
    }
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="name"
                label="Location Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="description"
                label="Description"
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                name="category"
                label="Category"
                value={formik.values.category}
                onChange={formik.handleChange}
                error={formik.touched.category && Boolean(formik.errors.category)}
                helperText={formik.touched.category && formik.errors.category}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <LoadScript
                googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                libraries={['places']}
              >
                <StandaloneSearchBox
                  onLoad={setSearchBox}
                  onPlacesChanged={handlePlaceSelect}
                >
                  <TextField
                    fullWidth
                    name="address.street"
                    label="Search Address"
                    value={formik.values.address.street}
                    onChange={formik.handleChange}
                  />
                </StandaloneSearchBox>
              </LoadScript>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="address.city"
                label="City"
                value={formik.values.address.city}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="address.state"
                label="State"
                value={formik.values.address.state}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="address.country"
                label="Country"
                value={formik.values.address.country}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="address.postalCode"
                label="Postal Code"
                value={formik.values.address.postalCode}
                onChange={formik.handleChange}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Accessibility
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    name="accessibility.wheelchairAccessible"
                    checked={formik.values.accessibility.wheelchairAccessible}
                    onChange={formik.handleChange}
                  />
                }
                label="Wheelchair Accessible"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="accessibility.parkingAvailable"
                    checked={formik.values.accessibility.parkingAvailable}
                    onChange={formik.handleChange}
                  />
                }
                label="Parking Available"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="accessibility.publicTransitNearby"
                    checked={formik.values.accessibility.publicTransitNearby}
                    onChange={formik.handleChange}
                  />
                }
                label="Public Transit Nearby"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="contact.phone"
                    label="Phone Number"
                    value={formik.values.contact.phone}
                    onChange={formik.handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="contact.email"
                    label="Email"
                    value={formik.values.contact.email}
                    onChange={formik.handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="contact.website"
                    label="Website"
                    value={formik.values.contact.website}
                    onChange={formik.handleChange}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        );

      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Add New Location
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Location submitted successfully! Redirecting to map...
          </Alert>
        )}

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={formik.handleSubmit}>
          {getStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            {activeStep !== 0 && (
              <Button onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
            )}
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                type="submit"
                disabled={!formik.isValid || formik.isSubmitting}
              >
                Submit
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            )}
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default AddLocation;
