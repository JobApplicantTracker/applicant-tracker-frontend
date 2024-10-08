'use client';
// app/page.tsx

import React from 'react';
import { Box, Button, Typography } from '@mui/material';

const Home = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundImage: 'url(/wallpaper.jpg)', // Change this to your image path
        backgroundSize: 'cover', // Makes the background image cover the entire Box
        backgroundPosition: 'center', // Centers the background image
      }}
    >
      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)', // White background with 90% opacity
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Seeking for Job?
        </Typography>
        <Typography variant="h6" gutterBottom>
          Check out the <strong>offer!</strong>
        </Typography>
        <Button variant="contained" color="primary" href="/jobs">
          View Jobs
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
