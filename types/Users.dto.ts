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

    role: {
        idRole: number,
        name: string
    }
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