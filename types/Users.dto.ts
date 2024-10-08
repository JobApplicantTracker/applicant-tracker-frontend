import { Role } from "./Role.dto";
import { UniversitiesDTO } from "./Universities.dto";

export type UsersDTO = {
    idUser: number;

    firstName: string;

    lastName: string;

    jmbg: string;

    phone: string;

    city: string;

    gender: string;

    school: UniversitiesDTO;

    email: string;

    password: string;

    role: Role
}
export type CreateUserDTO = {
    firstName: string;

    lastName: string;

    jmbg: string;

    phone: string;

    city: string;

    gender: string;

    idUniversity: number | null;

    email: string;

    password: string;

    idRole: number
}

export type UpdateUserDTO = {
    firstName: string;

    lastName: string;

    jmbg: string;

    phone: string;

    city: string;

    gender: string

    school: UniversitiesDTO | null

    role: Role | null
}