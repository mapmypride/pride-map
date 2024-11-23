import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Avatar,
  Button,
  TextField,
  Tab,
  Tabs,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  IconButton,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MapIcon from '@mui/icons-material/Map';
import VerifiedIcon from '@mui/icons-material/Verified';
import TranslateIcon from '@mui/icons-material/Translate';
import axios from 'axios';

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index} style={{ padding: '24px 0' }}>
    {value === index && children}
  </div>
);

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    languages: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      setEditForm({
        name: response.data.profile.name || '',
        bio: response.data.profile.bio || '',
        languages: (response.data.profile.languages || []).join(', '),
      });
    } catch (error) {
      setError('Error fetching profile');
    }
  };

  const handleEditProfile = () => {
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setEditForm({
      name: user.profile.name || '',
      bio: user.profile.bio || '',
      languages: (user.profile.languages || []).join(', '),
    });
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const updatedProfile = {
        profile: {
          ...user.profile,
          name: editForm.name,
          bio: editForm.bio,
          languages: editForm.languages.split(',').map(lang => lang.trim()),
        },
      };

      await axios.patch(
        'http://localhost:5000/api/auth/profile',
        updatedProfile,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser(prev => ({
        ...prev,
        profile: updatedProfile.profile,
      }));
      setEditing(false);
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Error updating profile');
    }
  };

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  const calculateNextBadgeProgress = () => {
    const { locationsAdded, locationsVerified, translationsSubmitted } = user.stats;
    const progress = {
      powerMapper: (locationsAdded / 25) * 100,
      verificationPro: (locationsVerified / 50) * 100,
      translationHero: (translationsSubmitted / 100) * 100,
    };
    return progress;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              src={user.profile.avatar}
              sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
            />
            {editing ? (
              <Box>
                <TextField
                  fullWidth
                  label="Name"
                  value={editForm.name}
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Bio"
                  multiline
                  rows={4}
                  value={editForm.bio}
                  onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Languages (comma-separated)"
                  value={editForm.languages}
                  onChange={e => setEditForm({ ...editForm, languages: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveProfile}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box>
                <Typography variant="h5" gutterBottom>
                  {user.profile.name || user.username}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {user.profile.bio || 'No bio yet'}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {user.profile.languages?.map(lang => (
                    <Chip
                      key={lang}
                      label={lang}
                      size="small"
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleEditProfile}
                >
                  Edit Profile
                </Button>
              </Box>
            )}
          </Paper>

          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Stats
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Locations Added
                </Typography>
                <Typography variant="h6">{user.stats.locationsAdded}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Locations Verified
                </Typography>
                <Typography variant="h6">{user.stats.locationsVerified}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Translations
                </Typography>
                <Typography variant="h6">{user.stats.translationsSubmitted}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Points
                </Typography>
                <Typography variant="h6">{user.stats.totalPoints}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper>
            <Tabs
              value={tabValue}
              onChange={(e, newValue) => setTabValue(newValue)}
              centered
            >
              <Tab label="Badges" />
              <Tab label="Progress" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={2}>
                {user.badges.map(badge => (
                  <Grid item xs={12} sm={6} key={badge.name}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="h6" component="span" sx={{ mr: 1 }}>
                            {badge.icon}
                          </Typography>
                          <Typography variant="h6">{badge.name}</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {badge.description}
                        </Typography>
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                          Earned on {new Date(badge.dateEarned).toLocaleDateString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Next Badge Progress
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <MapIcon sx={{ mr: 1 }} />
                        <Typography variant="body1">Power Mapper</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={calculateNextBadgeProgress().powerMapper}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {`${user.stats.locationsAdded}/25 locations added`}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <VerifiedIcon sx={{ mr: 1 }} />
                        <Typography variant="body1">Verification Pro</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={calculateNextBadgeProgress().verificationPro}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {`${user.stats.locationsVerified}/50 locations verified`}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <TranslateIcon sx={{ mr: 1 }} />
                        <Typography variant="body1">Translation Hero</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={calculateNextBadgeProgress().translationHero}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {`${user.stats.translationsSubmitted}/100 translations submitted`}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
