'use client';

import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, MenuItem, Select, InputLabel, FormControl, SelectChangeEvent, Snackbar } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext'; // Use the context for admin check
import { CreateUserDTO, UsersDTO } from '@/types/Users.dto';
import { register } from '@/api/auth';
import { UniversitiesDTO } from '@/types/Universities.dto';
import axios from 'axios';
import { BACKEND_URL, genderTypes } from '@/constants/constants';

export default function RegisterPage() {
    const [formData, setFormData] = useState<CreateUserDTO>({
        firstName: '',
        lastName: '',
        jmbg: '',
        phone: '',
        city: '',
        email: '',
        password: '',
        gender: '',
        idUniversity: null,
        idRole: 3
    });
    const [error, setError] = useState<string | null>(null);
    const { user } = useUser(); // Get the current user from the context
    const router = useRouter();
    const isAdmin = user && user.role.idRole == 1
    const [universities, setUniversities] = useState<UniversitiesDTO[]>([])
    const [message, setMessage] = useState<string | null>(null);


    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/universities`);
                setUniversities(response.data);
            } catch (err) {
                console.error('Failed to fetch universities');
            }
        };
        fetchUniversities();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        console.log(value)
        setFormData({
            ...formData,
            [name as keyof CreateUserDTO]: value,
        });
    };

    const handleRoleChange = (e: SelectChangeEvent<number>) => {
        setFormData({
            ...formData,
            idRole: Number(e.target.value),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Invalid email format');
            return;
        }
        if (formData.phone.length < 9 || formData.phone.length > 10) {
            setError('Phone number must be 9 to 10 digits long');
            return;
        }
        if (formData.jmbg.length !== 13) {
            setError('JMBG must be 13 digits long');
            return;
        }
        if (formData.idUniversity === null) {
            setError('You need to choose a university');
            return;
        }

        try {
            await register(formData);
            setMessage('User registered successfully');
            setTimeout(() => router.push('/'), 1000);
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mb: '25px', mt: '25px' }}>
            <Typography variant="h4" gutterBottom>
                Register
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="JMBG"
                    name="jmbg"
                    value={formData.jmbg}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                    type='number'
                />
                <TextField
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                    type='number'
                />
                <TextField
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Gender"
                    fullWidth
                    select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    margin="normal"
                    required
                >
                    {genderTypes.map((gender) => (
                        <MenuItem key={gender} value={gender}>
                            {gender.charAt(0).toUpperCase() + gender.slice(1)}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    type="password"
                    fullWidth
                    required
                    margin="normal"
                />
                <TextField
                    label="University"
                    fullWidth
                    select
                    value={formData.idUniversity || ''}
                    onChange={(e) => setFormData({ ...formData, idUniversity: Number(e.target.value) })}
                    margin="normal"
                    required
                >
                    {universities.map((university) => (
                        <MenuItem key={university.idUniversity} value={university.idUniversity}>
                            {university.name}
                        </MenuItem>
                    ))}
                </TextField>
                {isAdmin && (
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="role-select-label">Role</InputLabel>
                        <Select
                            labelId="role-select-label"
                            name="idRole"
                            value={formData.idRole}
                            onChange={handleRoleChange}
                            required
                        >
                            <MenuItem value={1}>Admin</MenuItem>
                            <MenuItem value={2}>Employee</MenuItem>
                            <MenuItem value={3}>Candidat</MenuItem>
                            {/* Add more roles as needed */}
                        </Select>
                    </FormControl>
                )}

                {error && <Typography color="error">{error}</Typography>}
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Register
                </Button>
            </form>
            <Snackbar
                open={Boolean(message)}
                autoHideDuration={6000}
                onClose={() => setMessage(null)}
                message={message}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            />
        </Container>
    );
}
