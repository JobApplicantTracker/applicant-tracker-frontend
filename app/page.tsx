'use client';

import { Typography, Container, Button } from '@mui/material';

export default function Home() {
  return (
    <Container>
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to My MUI App
      </Typography>
      <Button variant="contained" color="primary">
        Get Started
      </Button>
    </Container>
  );
}
