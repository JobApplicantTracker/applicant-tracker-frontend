"use client"
import { JobCard } from "@/components/JobCard";
import { BACKEND_URL } from "@/constants/constants";
import { useUser } from "@/contexts/UserContext";
import { JobsDTO } from "@/types/Jobs.dto";
import { Box, Button, CircularProgress, Container, Grid, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function JobsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [jobs, setJobs] = useState<JobsDTO[]>([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useUser()
    const router = useRouter()

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/jobs`);
                setJobs(response.data);
            } catch (err) {
                console.error("Error fetching jobs:", err);
                setError("Failed to fetch jobs");
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter(job =>
        job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.numOfSeats.toString().includes(searchTerm)
    );

    if (loading) {
        return (
            <Container>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Container>
        );
    }

    return (
        <Container>
            <Box
                display="flex"
                justifyContent="space-between" // Ensures the elements are spaced apart
                alignItems="center" // Aligns items vertically in the center
                marginBottom={2} // Adds spacing below the search and button row
            >
                <TextField
                    label="Search by name or number of seats"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ flexGrow: 1, marginRight: 2 }} // Allows the search bar to grow and adds space between the button and search
                />
                {(user?.role.name === 'admin' || user?.role.name === 'employee') && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => router.push('jobs/create')}
                    >
                        Create Job
                    </Button>
                )}
            </Box>
            <Box
                display="grid"
                gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" // Responsive grid
                gap={2} // Space between cards
            >
                {filteredJobs.map(job => (
                    <Box key={job.idJob}>
                        <JobCard job={job} />
                    </Box>
                ))}
            </Box>
        </Container>
    );
}
