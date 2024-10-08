"use client";
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Button, Container, Paper, Box, IconButton, Stack } from '@mui/material';
import axios from 'axios';
import { BACKEND_URL } from "@/constants/constants";
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { UsersDTO } from '@/types/Users.dto';

export default function UsersPage() {
    const [users, setUsers] = useState<UsersDTO[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UsersDTO[]>([]);
    const [filters, setFilters] = useState({
        firstName: '',
        lastName: '',
        email: '',
        jmbg: '',
        phone: '',
        role: ''
    });
    const { user } = useUser();
    const router = useRouter();

    const fetchUsers = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.get(`${BACKEND_URL}/users`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            setUsers(response.data);
            setFilteredUsers(response.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const filtered = users.filter(user =>
            user.firstName.toLowerCase().includes(filters.firstName.toLowerCase()) &&
            user.lastName.toLowerCase().includes(filters.lastName.toLowerCase()) &&
            user.email.toLowerCase().includes(filters.email.toLowerCase()) &&
            user.jmbg.includes(filters.jmbg) &&
            user.phone.includes(filters.phone) &&
            user.role.name.toLowerCase().includes(filters.role.toLowerCase()) // Filter by role
        );
        setFilteredUsers(filtered);
    }, [filters, users]);

    const handleCreateUser = () => {
        router.push('/users/create');
    };

    const handleDeleteUser = async (id: number) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            await axios.patch(`${BACKEND_URL}/users/delete/${id}`, {}, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
        } catch (error) {
            console.log(error)
        } finally {
            fetchUsers()
        }
    }
    return (
        <Container sx={{ mb: '25px', mt: '25px' }}>
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 2
            }}>
                <TextField
                    label="Search by First Name"
                    value={filters.firstName}
                    onChange={(e) => setFilters({ ...filters, firstName: e.target.value })}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Search by Last Name"
                    value={filters.lastName}
                    onChange={(e) => setFilters({ ...filters, lastName: e.target.value })}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Search by Email"
                    value={filters.email}
                    onChange={(e) => setFilters({ ...filters, email: e.target.value })}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Search by JMBG"
                    value={filters.jmbg}
                    onChange={(e) => setFilters({ ...filters, jmbg: e.target.value })}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Search by Phone"
                    value={filters.phone}
                    onChange={(e) => setFilters({ ...filters, phone: e.target.value })}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Search by Role"
                    value={filters.role}
                    onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                    fullWidth
                    margin="normal"
                />
            </Box>

            {(user?.role.name === 'admin' || user?.role.name === 'employee') && (
                <Button onClick={handleCreateUser} variant="contained" color="primary" fullWidth style={{ marginTop: '16px' }}>
                    Create User
                </Button>
            )}

            <TableContainer component={Paper} style={{ marginTop: '16px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>JMBG</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.map(currUser => (
                            <TableRow key={currUser.idUser}>
                                <TableCell>{currUser.firstName}</TableCell>
                                <TableCell>{currUser.lastName}</TableCell>
                                <TableCell>{currUser.email}</TableCell>
                                <TableCell>{currUser.jmbg}</TableCell>
                                <TableCell>{currUser.phone}</TableCell>
                                <TableCell>{currUser.role.name}</TableCell>
                                <TableCell>
                                    <IconButton>
                                        <EditIcon onClick={() => router.push(`/users/${currUser.idUser}`)} />
                                    </IconButton>
                                    {user && user.role.name == 'admin' && currUser.idUser !== user.idUser && (
                                        <IconButton onClick={() => handleDeleteUser(currUser.idUser)}>
                                            <DeleteIcon />
                                        </IconButton>)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    )
}
