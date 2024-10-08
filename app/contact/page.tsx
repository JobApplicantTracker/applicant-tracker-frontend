// app/contact/page.tsx

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Contact = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f4f4f4',
                padding: '20px',
            }}
        >
            <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Contact Us
                </Typography>
                <Typography variant="body1" paragraph>
                    If you have any questions or need more information, feel free to reach out to us via email.
                </Typography>
                <Typography variant="body1" paragraph>
                    Email: <strong>orozsrdjan@gmail.com</strong>
                </Typography>
            </Paper>
        </Box>
    );
};

export default Contact;
