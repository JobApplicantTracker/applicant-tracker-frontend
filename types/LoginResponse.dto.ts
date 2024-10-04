import { UsersDTO } from "./Users.dto"


export type LoginResponseDTO = {
    user: UsersDTO,
    backendTokens: {
        accessToken: string,
        refreshToken: string,
        expiresIn: string,
    }
}