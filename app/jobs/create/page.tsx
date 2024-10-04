"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import axios from "axios";
import { BACKEND_URL } from "@/constants/constants";
import { useUser } from "@/contexts/UserContext";

export default function CreateJobPage() {
    const [name, setName] = useState("");
    const [numOfSeats, setNumOfSeats] = useState<number | string>("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const router = useRouter();
    const { user } = useUser();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (!user) {
            router.push("/login");
            return;
        }

        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            setError("No access token found. Please log in.");
            return;
        }

        try {
            const response = await axios.post(
                `${BACKEND_URL}/jobs/create`,
                {
                    name,
                    numOfSeats: parseInt(numOfSeats as string, 10),
                    description,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`, // Send access token in headers
                    },
                }
            );
            setSuccessMessage("Job created successfully!");
            setName("");
            setNumOfSeats("");
            setDescription("");
            setTimeout(() => {
                router.push("/jobs");
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create job.");
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>
                Create Job
            </Typography>

            {error && (
                <Typography color="error" gutterBottom>
                    {error}
                </Typography>
            )}

            {successMessage && (
                <Typography color="primary" gutterBottom>
                    {successMessage}
                </Typography>
            )}

            <form onSubmit={handleSubmit}>
                <TextField
                    label="Job Name"
                    variant="outlined"
                    fullWidth
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    margin="normal"
                />
                <TextField
                    label="Number of Seats"
                    variant="outlined"
                    fullWidth
                    required
                    type="number"
                    value={numOfSeats}
                    onChange={(e) => setNumOfSeats(e.target.value)}
                    margin="normal"
                />
                <TextField
                    label="Description"
                    variant="outlined"
                    fullWidth
                    required
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    margin="normal"
                />
                <Box mt={2}>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Create Job
                    </Button>
                </Box>
            </form>
        </Container>
    );
}
