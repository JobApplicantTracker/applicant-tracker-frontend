import { UsersDTO } from "./UsersDto.types"


export type LoginResponseDTO = {
    user: UsersDTO,
    backendTokens: {
        accessToken: string,
        refreshToken: string,
        expiresIn: string,
    }
}