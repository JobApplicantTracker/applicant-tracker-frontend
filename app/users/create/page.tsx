"use client";
import React, { useState, useEffect } from 'react';
import { Box, Button, Container, MenuItem, Snackbar, TextField, Typography } from "@mui/material";
import axios from 'axios';
import { BACKEND_URL, genderTypes } from "@/constants/constants";
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { Role } from '@/types/Role.dto';
import { UniversitiesDTO } from '@/types/Universities.dto';
import { CreateUserDTO } from '@/types/Users.dto';
const CreateUserPage = () => {
    const [userData, setUserData] = useState<CreateUserDTO>({
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
    const [roles, setRoles] = useState<Role[]>([]);
    const [universities, setUniversities] = useState<UniversitiesDTO[]>([])
    const router = useRouter();
    const { user } = useUser();
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

    useEffect(() => {
        if (user?.role.name === 'admin') {
            setRoles([{ idRole: 1, name: 'Admin' },
            { idRole: 2, name: 'Employee' },
            { idRole: 3, name: 'Candidate' }]);
        } else if (user?.role.name === 'employee') {
            setRoles([{ idRole: 2, name: 'Employee' },
            { idRole: 3, name: 'Candidate' }]);
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
        if (userData.idUniversity == null) {
            setError('You need to chose university')
        }

        try {
            const accessToken = localStorage.getItem('accessToken');
            await axios.post(`${BACKEND_URL}/users/create`, userData, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            setMessage('User created successfully');
            setTimeout(() => router.push('/users'), 1000); // Redirect to user list after 2s
        } catch (err: any) {
            setError('Failed to create user');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mb: '25px', mt: '25px' }}>
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
                    type='number'
                    required
                />
                <TextField
                    label="Phone"
                    fullWidth
                    value={userData.phone}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                    margin="normal"
                    type='number'
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
                    label="Gender"
                    fullWidth
                    select
                    value={userData.gender}
                    onChange={(e) => setUserData({ ...userData, gender: e.target.value })}
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
                    label="University"
                    fullWidth
                    select
                    value={userData.idUniversity || ''}
                    onChange={(e) =>
                        setUserData({ ...userData, idUniversity: Number(e.target.value) })
                    }
                    margin="normal"
                    required
                >
                    {universities.map((university) => (
                        <MenuItem key={university.idUniversity} value={university.idUniversity}>
                            {university.name}
                        </MenuItem>
                    ))}
                </TextField>
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
                        <MenuItem key={role.idRole} value={role.idRole}>
                            {role.name}
                        </MenuItem>
                    ))}
                </TextField>
                {error && <Typography color="error">{error}</Typography>}
                <Button type="submit" variant="contained" color="primary" fullWidth>Create User</Button>
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
};

export default CreateUserPage;
