'use client';

import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, MenuItem, Select, InputLabel, FormControl, SelectChangeEvent } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext'; // Use the context for admin check
import { CreateUserDTO, UsersDTO } from '@/types/Users.dto';
import { register } from '@/api/auth';

export default function RegisterPage() {
    const [formData, setFormData] = useState<CreateUserDTO>({
        firstName: '',
        lastName: '',
        jmbg: '',
        phone: '',
        city: '',
        school: '',
        email: '',
        password: '',
        idRole: 3
    });
    const [error, setError] = useState<string | null>(null);
    const { user } = useUser(); // Get the current user from the context
    const router = useRouter();
    const isAdmin = user && user.role.idRole == 1 // Assuming admin role has idRole of 1

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name as keyof CreateUserDTO]: value,
        });
    };

    const handleRoleChange = (e: SelectChangeEvent<number>) => {
        setFormData({
            ...formData,
            idRole: Number(e.target.value), // Ensure the value is treated as a number
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            await register(formData); // Adjust according to your register API
            router.push('/'); // Redirect to homepage or login page
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        }
    };

    return (
        <Container maxWidth="sm">
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
                />
                <TextField
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
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
                    label="School"
                    name="school"
                    value={formData.school}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="normal"
                />
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

                {/* Only show the role select field if the current user is an admin */}
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
        </Container>
    );
}
