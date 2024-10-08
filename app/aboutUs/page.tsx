import { Button, Grid, Paper, Typography } from "@mui/material";

export default function AboutUsPage() {
    return (
        <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h4" gutterBottom>
                About My Graduation Project
            </Typography>
            <Typography variant="body1" paragraph>
                Welcome to my graduation project! I am excited to present a mechanism developed for
                the firm OROZ that simplifies the process of posting open positions and allows candidates to apply for these roles.
            </Typography>
            <Typography variant="body1" paragraph>
                The goal of this project is to create an efficient and user-friendly platform that
                connects job seekers with potential employers. Through this mechanism, OROZ can easily post job openings and manage applications, streamlining the hiring process.
            </Typography>
            <Typography variant="body1" paragraph>
                Key features of the project include:
            </Typography>
            <ul>
                <li>
                    <Typography variant="body1">Posting and managing job openings</Typography>
                </li>
                <li>
                    <Typography variant="body1">Candidate applications and tracking</Typography>
                </li>
                <li>
                    <Typography variant="body1">User-friendly interface for both employers and candidates</Typography>
                </li>
            </ul>
            <Typography variant="body1" paragraph>
                I believe this project will not only benefit OROZ but also enhance the overall job application experience for candidates.
                Thank you for visiting this page, and I hope you find the project as exciting as I do!
            </Typography>
            <Button variant="contained" color="primary" href="/">
                Go Back Home
            </Button>
        </Paper>
    );
}
