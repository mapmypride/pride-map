import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Link,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MapIcon from '@mui/icons-material/Map';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import PeopleIcon from '@mui/icons-material/People';

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FF0018 0%, #FFA52C 20%, #FFFF41 40%, #008018 60%, #0000F9 80%, #86007D 100%)',
  padding: theme.spacing(15, 0),
  color: '#fff',
  textAlign: 'center',
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

function Home() {
  return (
    <Box>
      <HeroSection>
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            MapMyPride
          </Typography>
          <Typography variant="h5" paragraph>
            Find LGBTQ+ Safe Spaces Worldwide
          </Typography>
          <Box mt={4}>
            <Button
              component={RouterLink}
              to="/map"
              variant="contained"
              size="large"
              startIcon={<MapIcon />}
              sx={{ mr: 2, bgcolor: 'white', color: 'primary.main' }}
            >
              Explore Map
            </Button>
            <Button
              component={RouterLink}
              to="/add-location"
              variant="outlined"
              size="large"
              startIcon={<AddLocationIcon />}
              sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'white' }}
            >
              Add Location
            </Button>
          </Box>
        </Container>
      </HeroSection>

      <Container sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <CardContent>
                <MapIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  Find Safe Spaces
                </Typography>
                <Typography color="text.secondary">
                  Discover LGBTQ+-friendly locations in your area, from healthcare providers to social venues.
                </Typography>
              </CardContent>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <CardContent>
                <AddLocationIcon color="secondary" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  Contribute
                </Typography>
                <Typography color="text.secondary">
                  Help grow our database by adding new locations and keeping information up to date.
                </Typography>
              </CardContent>
            </FeatureCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <FeatureCard>
              <CardContent>
                <PeopleIcon sx={{ fontSize: 48, mb: 2, color: '#008018' }} />
                <Typography variant="h5" component="h2" gutterBottom>
                  Join the Community
                </Typography>
                <Typography color="text.secondary">
                  Connect with others, earn badges, and help make the world more inclusive.
                </Typography>
              </CardContent>
            </FeatureCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Home;
