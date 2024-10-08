"use client";
import React, { useState, useEffect } from 'react';
import { Box, Button, Container, MenuItem, TextField, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Snackbar, IconButton } from "@mui/material";
import axios from 'axios';
import { BACKEND_URL, genderTypes } from "@/constants/constants";
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { JobsDTO } from '@/types/Jobs.dto';
import { UpdateUserDTO } from '@/types/Users.dto';
import { Role } from '@/types/Role.dto';
import { UniversitiesDTO } from '@/types/Universities.dto';
import GridViewIcon from '@mui/icons-material/GridView';

const UserProfilePage = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [jobs, setJobs] = useState<JobsDTO[]>([]);
    const [createdJobs, setCreatedJobs] = useState<JobsDTO[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null)
    const { user } = useUser();
    const { id } = useParams();
    const [permision, setPermision] = useState<boolean>(false)
    const isAdmin = user?.role.name === 'admin'
    const [universities, setUniversities] = useState<UniversitiesDTO[]>([])
    const router = useRouter()
    const [userData, setUserData] = useState<UpdateUserDTO>({
        firstName: '',
        lastName: '',
        jmbg: '',
        phone: '',
        city: '',
        gender: '',
        school: null,
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

                    const jobsResponse = await axios.get(`${BACKEND_URL}/jobs/user/applied/${id}`, {
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
        const fetchCreatedJobs = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/jobs/created/${id}`);
                setCreatedJobs(response.data);
            } catch (err) {
                console.error('Failed to fetch universities');
            }
        };
        fetchCreatedJobs()
    }, []);

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
        return (<Box maxWidth="md" margin="auto" sx={{ mb: '25px', mt: '25px' }}>
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
                            label="Email"
                            aria-readonly
                            fullWidth
                            value={user?.email || ' '}
                            margin="normal"
                        />
                    </Box>
                    <Box flexBasis={{ xs: "100%", md: "48%" }}>
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
                    </Box>
                    <Box flexBasis={{ xs: "100%", md: "48%" }}>
                        <TextField
                            label="University"
                            fullWidth
                            select
                            value={userData.school?.idUniversity}
                            onChange={(e) => {
                                const selectedUniversity = universities.find(uni => uni.idUniversity === Number(e.target.value));
                                if (selectedUniversity)
                                    setUserData({ ...userData, school: selectedUniversity });
                            }}
                            margin="normal"
                            required
                        >
                            {universities.map((university) => (
                                <MenuItem key={university.idUniversity} value={university.idUniversity}>
                                    {university.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                    <Box flexBasis={{ xs: "100%", md: "48%" }}>
                        <TextField
                            label="Role"
                            fullWidth
                            select
                            disabled={!isAdmin}
                            value={userData.role?.idRole}
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

            {permision && user?.role.name != 'candidat' && (
                <>
                    <Typography variant="h5" gutterBottom style={{ marginTop: '32px' }}>
                        Jobs Created
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Job Name</TableCell>
                                    <TableCell>City</TableCell>
                                    <TableCell>Num Of Seats</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {createdJobs.map(job => (
                                    <TableRow key={job.idJob}>
                                        <TableCell>{job.name}</TableCell>
                                        <TableCell>{job.city}</TableCell>
                                        <TableCell>{job.numOfSeats}</TableCell>
                                        <TableCell>{job.deleted ? 'CLOSED' : 'OPENED'}</TableCell>
                                        <TableCell><IconButton onClick={() => router.push(`/jobs/${job.idJob}`)}><GridViewIcon /></IconButton></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}
            {user?.role.name != 'admin' && (
                <>
                    <Typography variant="h5" gutterBottom style={{ marginTop: '32px' }}>
                        Jobs Attended
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Job Name</TableCell>
                                    <TableCell>City</TableCell>
                                    <TableCell>Num Of Seats</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {jobs.map(job => (
                                    <TableRow key={job.idJob}>
                                        <TableCell>{job.name}</TableCell>
                                        <TableCell>{job.city}</TableCell>
                                        <TableCell>{job.numOfSeats}</TableCell>
                                        <TableCell></TableCell>
                                        <TableCell><IconButton onClick={() => router.push(`/jobs/${job.idJob}`)}><GridViewIcon /></IconButton></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}
            <Snackbar
                open={Boolean(success)}
                autoHideDuration={6000}
                onClose={() => setSuccess(null)}
                message={success}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            />
        </Box>
        );
    }
};

export default UserProfilePage;
