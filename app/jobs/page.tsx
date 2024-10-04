"use client"
import { JobCard } from "@/components/JobCard";
import { BACKEND_URL } from "@/constants/constants";
import { JobsDTO } from "@/types/Jobs.dto";
import { Box, CircularProgress, Container, Grid, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

export default function JobsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [jobs, setJobs] = useState<JobsDTO[]>([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
            <TextField
                label="Search by name or number of seats"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                margin="normal"
            />
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
