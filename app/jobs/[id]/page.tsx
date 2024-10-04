"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Container, Typography, CircularProgress, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Snackbar, CardContent, Card } from "@mui/material";
import axios from "axios";
import { BACKEND_URL } from "@/constants/constants";
import { useUser } from "@/contexts/UserContext";

export default function JobPage() {
    const router = useRouter();
    const { id } = useParams();
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useUser();
    const [message, setMessage] = useState<string | null>(null);


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

    const handleApply = async () => {
        if (!user) {
            router.push('/login');
            return;
        }
        const accessToken = localStorage.getItem('accessToken');


        try {
            const response = await axios.post(`${BACKEND_URL}/jobs/apply/${job.idJob}`,
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
            }, 2000);
        } catch (error) {
            console.error("Error applying for the job:", error);
            setMessage("Failed to apply for the job.");
        }
    };

    if (loading) {
        return (
            <Container>
                <CircularProgress />
            </Container>
        );
    }

    if (!job) {
        return (
            <Container>
                <Typography variant="h5" color="error">
                    Job not found
                </Typography>
            </Container>
        );
    }
    console.log(user?.role.name)
    const isAdmin = user ? user.role.name === 'admin' : false;
    const isEmployee = user ? user.role.name === 'employee' : false;

    return (
        <Container>
            <Card>
                <CardContent>
                    <Typography variant="h3" sx={{ pb: '10px' }}>{job.name}</Typography>
                    <Typography variant="h5" sx={{ pb: '10px' }}>Currently applied: {job.candidates.length}</Typography>
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
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {job.candidates.map((candidate: any) => (
                                <TableRow key={candidate.id}>
                                    <TableCell>{candidate.firstName}</TableCell>
                                    <TableCell>{candidate.lastName}</TableCell>
                                    <TableCell>{candidate.email}</TableCell>
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
