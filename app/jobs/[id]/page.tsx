"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Container, Typography, CircularProgress, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar, CardContent, Card, IconButton } from "@mui/material";
import axios from "axios";
import { BACKEND_URL } from "@/constants/constants";
import { useUser } from "@/contexts/UserContext";
import DeleteIcon from '@mui/icons-material/Delete';
import { JobsDTO } from "@/types/Jobs.dto";
import GridViewIcon from '@mui/icons-material/GridView';

export default function JobPage() {
    const router = useRouter();
    const { id } = useParams();
    const [job, setJob] = useState<JobsDTO>();
    const [loading, setLoading] = useState(true);
    const { user } = useUser();
    const [message, setMessage] = useState<string | null>(null);
    const isDeletable = user?.role.name === 'admin' || user?.idUser === job?.creator
    useEffect(() => {
        if (id) {
            axios.get(`${BACKEND_URL}/jobs/job/${id}`)
                .then((response) => {
                    setJob(response.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching job data:", error);
                    setLoading(false);
                });
        }
    }, [id]);

    const handleDelete = async () => {
        const accessToken = localStorage.getItem('accessToken');
        try {
            const response = await axios.patch(`${BACKEND_URL}/jobs/delete/${job?.idJob}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`, // Set the Authorization header
                    },
                }
            );
            setMessage('Successfully deleted Job!');
            setTimeout(() => {
                router.push("/jobs");
            }, 1000);
        } catch (error) {
            console.error("Error delete for the job:", error);
            setMessage("Failed to delete for the job.");
        }
    }

    const handleApply = async () => {
        if (!user) {
            router.push('/login');
            return;
        }
        const accessToken = localStorage.getItem('accessToken');
        try {
            const response = await axios.post(`${BACKEND_URL}/jobs/apply/${job?.idJob}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`, // Set the Authorization header
                    },
                }
            );
            setMessage(response.data);
            setTimeout(() => {
                router.push("/jobs");
            }, 1000);
        } catch (error) {
            console.error("Error applying for the job:", error);
            setMessage("Failed to apply for the job.");
        }
    };

    if (loading) {
        return (
            <Container sx={{ mb: '25px', mt: '25px' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (!job) {
        return (
            <Container sx={{ mb: '25px', mt: '25px' }}>
                <Typography variant="h5" color="error">
                    Job not found
                </Typography>
            </Container>
        );
    }
    const isAdmin = user ? user.role.name === 'admin' : false;
    const isEmployee = user ? user.role.name === 'employee' : false;

    const removeCandidat = async (jobId: number, userId: number) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const response = await axios.patch(`${BACKEND_URL}/jobs/delete/user/${userId}`, { jobId }, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            setMessage(response.data);
            await axios.get(`${BACKEND_URL}/jobs/job/${id}`)
                .then((response) => {
                    setJob(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching updated job data:", error);
                });
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <Container sx={{ mb: '25px', mt: '25px' }}>
            <Card>
                <CardContent>
                    <Typography variant="h3" sx={{ pb: '10px' }}>{job.name}</Typography>
                    <Typography variant="h5" sx={{ pb: '10px' }}>{job.city}</Typography>
                    <Typography variant="h5" sx={{ pb: '10px' }}>Currently applied: {job?.candidates?.length}</Typography>
                    <Typography variant="h4" sx={{ pb: '10px' }}>Description:</Typography>
                    <Typography variant="h5" sx={{ pb: '10px' }}>{job.description}</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={isAdmin}
                        style={{ marginTop: '16px' }}
                        onClick={handleApply}
                    >
                        APPLY
                    </Button>
                    {isDeletable && (
                        <Button
                            variant="contained"
                            color="error"
                            style={{ marginTop: '16px', marginLeft: '10px' }}
                            onClick={handleDelete}
                        >
                            DELETE
                        </Button>
                    )}
                </CardContent>

            </Card>
            {(isAdmin || isEmployee) && job.candidates && job.candidates.length > 0 && (
                <TableContainer component={Paper} style={{ marginTop: '16px' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>First Name</TableCell>
                                <TableCell>Last Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Gender</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {job.candidates.map((candidate: any) => (
                                <TableRow key={candidate.idUser}>
                                    <TableCell>{candidate.firstName}</TableCell>
                                    <TableCell>{candidate.lastName}</TableCell>
                                    <TableCell>{candidate.email}</TableCell>
                                    <TableCell>{candidate.phone}</TableCell>
                                    <TableCell>{candidate.gender}</TableCell>
                                    <TableCell>
                                        <IconButton>
                                            <DeleteIcon onClick={() => removeCandidat(job.idJob, candidate.idUser)} />
                                        </IconButton>
                                        <IconButton onClick={() => router.push(`/users/${candidate.idUser}`)}><GridViewIcon /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
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
