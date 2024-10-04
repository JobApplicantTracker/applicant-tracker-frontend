import { Role } from "./Role.dto";

export type UsersDTO = {
    idUser: number;

    firstName: string;

    lastName: string;

    jmbg: string;

    phone: string;

    city: string;

    school: string;

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

    school: string;

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

    school: string

    role: Role
}