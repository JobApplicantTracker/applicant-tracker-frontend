"use client";
import React, { useState, useEffect } from 'react';
import { Box, Button, Container, MenuItem, TextField, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import axios from 'axios';
import { BACKEND_URL } from "@/constants/constants";
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { JobsDTO } from '@/types/Jobs.dto';
import { UpdateUserDTO } from '@/types/Users.dto';
import { Role } from '@/types/Role.dto';


const UserProfilePage = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [jobs, setJobs] = useState<JobsDTO[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null)
    const { user } = useUser();
    const router = useRouter();
    const { id } = useParams();
    const [permision, setPermision] = useState<boolean>(false)
    const isAdmin = user?.role.name === 'admin'
    console.log(isAdmin)
    const [userData, setUserData] = useState<UpdateUserDTO>({
        firstName: '',
        lastName: '',
        jmbg: '',
        phone: '',
        city: '',
        school: '',
        role: { idRole: 3, name: 'candidat' }
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                const userResponse = await axios.get(`${BACKEND_URL}/users/user/${id}`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                if (userResponse.data) {
                    setUserData({ ...userResponse.data });

                    const jobsResponse = await axios.get(`${BACKEND_URL}/jobs/user/${id}`, {
                        headers: { Authorization: `Bearer ${accessToken}` }
                    });
                    setJobs(jobsResponse.data);

                    if (user?.role.name === 'admin') {
                        setRoles([
                            { idRole: 1, name: 'admin' },
                            { idRole: 2, name: 'employee' },
                            { idRole: 3, name: 'candidat' }
                        ]);
                    } else if (user?.role.name === 'employee') {
                        setRoles([
                            { idRole: 2, name: 'employee' },
                            { idRole: 3, name: 'candidat' }
                        ]);
                    } else {
                        setRoles([
                            { idRole: 3, name: 'candidat' }
                        ]);
                    }
                    setPermision(true)
                }
                else {
                    setPermision(false)
                }
            } catch (error) {
                console.error(error)
                setError("Failed to fetch user data");
            }
        };
        fetchUserProfile();
        setError(null);
        setSuccess(null)
    }, [id, user]);

    const handleSaveChanges = async () => {
        setError(null);
        setSuccess(null)
        try {
            const accessToken = localStorage.getItem('accessToken');
            await axios.put(`${BACKEND_URL}/users/update/${id}`, userData, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            setSuccess('Changes saved successfully');
        } catch (err) {
            console.error(err)
            setError('Failed to save changes');
        }
    };
    if (!permision) {
        return (
            <Box maxWidth="md" margin="auto">

                <Typography variant="h4">Not Allowed!</Typography>
            </Box>
        )
    }
    else {
        return (<Box maxWidth="md" margin="auto">
            <Typography variant="h4" gutterBottom>
                {`${userData.firstName} ${userData.lastName}`}
            </Typography>
            <form onSubmit={handleSaveChanges}>
                <Box
                    display="flex"
                    flexWrap="wrap"
                    gap={2}
                >
                    <Box flexBasis={{ xs: "100%", md: "48%" }}>
                        <TextField
                            label="First Name"
                            fullWidth
                            value={userData.firstName}
                            onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                            margin="normal"
                            required
                        />
                    </Box>
                    <Box flexBasis={{ xs: "100%", md: "48%" }}>
                        <TextField
                            label="Last Name"
                            fullWidth
                            value={userData.lastName}
                            onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                            margin="normal"
                            required
                        />
                    </Box>
                    <Box flexBasis={{ xs: "100%", md: "48%" }}>
                        <TextField
                            label="JMBG"
                            fullWidth
                            value={userData.jmbg}
                            onChange={(e) => setUserData({ ...userData, jmbg: e.target.value })}
                            margin="normal"
                            required
                        />
                    </Box>
                    <Box flexBasis={{ xs: "100%", md: "48%" }}>
                        <TextField
                            label="Phone"
                            fullWidth
                            value={userData.phone}
                            onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                            margin="normal"
                            required
                        />
                    </Box>
                    <Box flexBasis={{ xs: "100%", md: "48%" }}>
                        <TextField
                            label="City"
                            fullWidth
                            value={userData.city}
                            onChange={(e) => setUserData({ ...userData, city: e.target.value })}
                            margin="normal"
                        />
                    </Box>
                    <Box flexBasis={{ xs: "100%", md: "48%" }}>
                        <TextField
                            label="School"
                            fullWidth
                            value={userData.school}
                            onChange={(e) => setUserData({ ...userData, school: e.target.value })}
                            margin="normal"
                        />
                    </Box>
                    <Box flexBasis={{ xs: "100%", md: "48%" }}>
                        <TextField
                            label="Email"
                            aria-readonly
                            fullWidth
                            value={user?.email || ' '}
                            margin="normal"
                        />
                    </Box>
                    <Box flexBasis={{ xs: "100%", md: "48%" }}>
                        <TextField
                            label="Role"
                            fullWidth
                            select
                            disabled={!isAdmin}
                            value={userData.role.idRole}
                            onChange={(e) => {
                                const selectedRole = roles.find(role => role.idRole === Number(e.target.value));
                                if (selectedRole)
                                    setUserData({ ...userData, role: selectedRole });
                            }}
                            margin="normal"
                            required
                        >
                            {roles.map((role) => (
                                <MenuItem key={role.idRole} value={role.idRole}>
                                    {role.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </Box>
                {error && <Typography color="error">{error}</Typography>}
                {success && <Typography color="success">{success}</Typography>}
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSaveChanges}
                    style={{ marginTop: '16px' }}
                >
                    Save Changes
                </Button>
            </form>

            {/* Jobs Table */}
            <Typography variant="h5" gutterBottom style={{ marginTop: '32px' }}>
                Jobs Attended
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Job Name</TableCell>
                            <TableCell>Num Of Seats</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {jobs.map(job => (
                            <TableRow key={job.idJob}>
                                <TableCell>{job.name}</TableCell>
                                <TableCell>{job.numOfSeats}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
        );
    }
};

export default UserProfilePage;
