'use client';

import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Container } from '@mui/material';
import { useRouter } from 'next/navigation';
import { login } from '../../api/auth'; // Adjust path as necessary
import { useUser } from '@/contexts/UserContext'; // Import the context

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { isLoggedIn, loginContextSaving } = useUser(); // Get the login function from context

    useEffect(() => {
        if (isLoggedIn) {
            setError('You are already logged in');
        }
    }, [isLoggedIn]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const data = await login(email, password);
            if (data) {
                loginContextSaving(data); // Set user data in context
                router.push('/');
            } // Redirect to homepage or dashboard}
        } catch (err: any) {
            setError(err.message || 'Login failed');
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                Login
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    required
                    margin="normal"
                />
                {error && <Typography color="error">{error}</Typography>}
                <Button type="submit" variant="contained" color="primary" fullWidth disabled={isLoggedIn} >
                    Login
                </Button>
            </form>
        </Container>
    );
}
