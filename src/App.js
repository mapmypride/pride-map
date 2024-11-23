import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { styled } from '@mui/material/styles';

// Import components (to be created)
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import Map from './components/map/Map';
import AddLocation from './components/locations/AddLocation';
import Profile from './components/user/Profile';

// Create theme with LGBTQ+ pride colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF0018', // Red from pride flag
      light: '#FF4E50',
      dark: '#CC0014',
    },
    secondary: {
      main: '#FF8E00', // Orange from pride flag
      light: '#FFA733',
      dark: '#CC7200',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F5F5F5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 12,
  },
});

const AppWrapper = styled('div')({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppWrapper>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/map" element={<Map />} />
            <Route path="/add-location" element={<AddLocation />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </AppWrapper>
      </Router>
    </ThemeProvider>
  );
}

export default App;
