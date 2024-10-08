import { JobsDTO } from "@/types/Jobs.dto";
import { Card, CardContent, Link, Typography } from "@mui/material";

export const JobCard = ({ job }: { job: JobsDTO }) => (
    <Link href={`/jobs/${job.idJob}`} style={{ textDecoration: 'none' }}>
        <Card sx={{ backgroundColor: 'grey.300', cursor: 'pointer', textDecoration: 'none' }}>
            <CardContent>
                <Typography variant="h5">{job.name}</Typography>
                <Typography variant="subtitle1">{`Seats: ${job.numOfSeats}`}</Typography>
                <Typography variant="subtitle1">{`City: ${job.city}`}</Typography>
                <Typography variant="body2">{job.description}</Typography>
            </CardContent>
        </Card>
    </Link>

);
