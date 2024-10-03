"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Container, Typography, CircularProgress } from "@mui/material";
import axios from "axios"; // Assuming you're using Axios
import { BACKEND_URL } from "@/constants/constants";

export default function JobPage() {
    const router = useRouter();
    const { id } = useParams(); // Extract the dynamic ID from the URL
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            axios.get(`${BACKEND_URL}/jobs/${id}`)
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

    return (
        <Container>
            <Typography variant="h4">{job.title}</Typography>
            <Typography variant="body1">{job.description}</Typography>
            {/* Add other job details as needed */}
        </Container>
    );
}
