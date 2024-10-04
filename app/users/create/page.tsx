"use client";
import React, { useState, useEffect } from 'react';
import { Box, Button, Container, MenuItem, TextField, Typography } from "@mui/material";
import axios from 'axios';
import { BACKEND_URL } from "@/constants/constants";
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
type Role = {
    id: number,
    name: string
}
const CreateUserPage = () => {
    const [userData, setUserData] = useState({
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
    const [roles, setRoles] = useState<Role[]>([]);
    const router = useRouter();
    const { user } = useUser();

    // Determine allowed roles based on current user role
    useEffect(() => {
        if (user?.role.name === 'admin') {
            setRoles([{ id: 1, name: 'Admin' },
            { id: 2, name: 'Employee' },
            { id: 3, name: 'Candidate' }]);
        } else if (user?.role.name === 'employee') {
            setRoles([{ id: 2, name: 'Employee' },
            { id: 3, name: 'Candidate' }]);
        }
    }, [user]);

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Basic validations
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
            setError('Invalid email format');
            return;
        }
        if (userData.phone.length < 9 || userData.phone.length > 10) {
            setError('Phone number must be 9 to 10 digits long');
            return;
        }
        if (userData.jmbg.length !== 13) {
            setError('JMBG must be 13 digits long');
            return;
        }

        try {
            const accessToken = localStorage.getItem('accessToken');
            await axios.post(`${BACKEND_URL}/users/create`, userData, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            setError('User created successfully');
            setTimeout(() => router.push('/users'), 2000); // Redirect to user list after 2s
        } catch (err: any) {
            setError('Failed to create user');
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>Create User</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="First Name"
                    fullWidth
                    value={userData.firstName}
                    onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                    margin="normal"
                    required
                />
                <TextField
                    label="Last Name"
                    fullWidth
                    value={userData.lastName}
                    onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                    margin="normal"
                    required
                />
                <TextField
                    label="JMBG"
                    fullWidth
                    value={userData.jmbg}
                    onChange={(e) => setUserData({ ...userData, jmbg: e.target.value })}
                    margin="normal"
                    required
                />
                <TextField
                    label="Phone"
                    fullWidth
                    value={userData.phone}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                    margin="normal"
                    required
                />
                <TextField
                    label="City"
                    fullWidth
                    value={userData.city}
                    onChange={(e) => setUserData({ ...userData, city: e.target.value })}
                    margin="normal"
                />
                <TextField
                    label="School"
                    fullWidth
                    value={userData.school}
                    onChange={(e) => setUserData({ ...userData, school: e.target.value })}
                    margin="normal"
                />
                <TextField
                    label="Email"
                    fullWidth
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    margin="normal"
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    value={userData.password}
                    onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                    margin="normal"
                    required
                />
                <TextField
                    label="Role"
                    fullWidth
                    select
                    value={userData.idRole}
                    onChange={(e) => setUserData({ ...userData, idRole: Number(e.target.value) })}
                    margin="normal"
                    required
                >
                    {roles.map(role => (
                        <MenuItem key={role.id} value={role.id}>
                            {role.name}
                        </MenuItem>
                    ))}
                </TextField>
                {error && <Typography color="error">{error}</Typography>}
                <Button type="submit" variant="contained" color="primary" fullWidth>Create User</Button>
            </form>
        </Container>
    );
};

export default CreateUserPage;
