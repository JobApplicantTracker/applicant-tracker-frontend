"use client";
import { LoginResponseDTO } from '@/types/LoginResponseDTO.types';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserContextType {
    isLoggedIn: boolean;
    user: any; // Adjust the type as per your user structure
    loginContextSaving: (loginResponse: LoginResponseDTO) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            // Decode the token to get user info or validate the token
            setIsLoggedIn(true);
            // Optionally, set user info from the token
        }
    }, []);

    const loginContextSaving = (loginResponse: LoginResponseDTO) => {
        if (loginResponse && loginResponse.backendTokens) {
            setUser(loginResponse.user);
            setIsLoggedIn(true);
            localStorage.setItem('accessToken', loginResponse.backendTokens.accessToken);
            localStorage.setItem('refreshToken', loginResponse.backendTokens.refreshToken);
        }
    };

    const logout = () => {
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    };

    return (
        <UserContext.Provider value={{ isLoggedIn, user, loginContextSaving, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
