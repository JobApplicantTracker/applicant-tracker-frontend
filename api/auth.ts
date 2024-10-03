import { BACKEND_URL } from '@/constants/constants';
import { LoginResponseDTO } from '@/types/LoginResponseDTO.types';
import { CreateUserDTO, UsersDTO } from '@/types/UsersDto.types';
import axios from 'axios';

// Update this to your backend URL

export async function login(email: string, password: string): Promise<LoginResponseDTO | null> {
    try {
        const response = await axios.post<LoginResponseDTO>(`${BACKEND_URL}/auth/login`, {
            email,
            password,
        });
        if (response.status === 201) {
            return response.data;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Failed to login', error);
        return null;
    }
}

export async function register(userData: CreateUserDTO): Promise<boolean> {
    try {
        const response = await axios.post(`${BACKEND_URL}/auth/register`, userData);
        if (response.status === 201) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        throw new Error('Failed to register');
    }
}
