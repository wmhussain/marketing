import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Home = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Cloudvillage Trainings
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Solution Architect & Technology Trainer
          </Typography>
          <Typography variant="body1" paragraph>
            Specializing in VMware, Microsoft, and Linux technologies
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            component={RouterLink}
            to="/trainings"
            size="large"
            sx={{ mt: 2 }}
          >
            Explore Trainings
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Onsite Training"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Onsite Training
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Professional training delivered at your location with hands-on experience
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Online Training"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Online Training
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Interactive virtual sessions with real-time support and guidance
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Consulting"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Consulting
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Expert guidance for your technology infrastructure and solutions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 