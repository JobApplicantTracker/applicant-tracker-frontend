import { LoginResponseDTO } from '@/types/LoginResponseDTO.types';
import axios from 'axios';

const API_URL = 'http://localhost:3333/auth'; // Update this to your backend URL

export async function login(email: string, password: string): Promise<LoginResponseDTO | null> {
    try {
        const response = await axios.post<LoginResponseDTO>(`${API_URL}/login`, {
            email,
            password,
        });

        // Store tokens in localStorage
        console.log(response)
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
