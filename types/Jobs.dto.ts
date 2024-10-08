import { UsersDTO } from "./Users.dto";

export type JobsDTO = {
    idJob: number;

    name: string;

    city: string;

    numOfSeats: number;

    description: string;

    deleted: boolean

    creator?: UsersDTO;

    candidates?: UsersDTO[]
}