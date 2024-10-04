"use client";
import { LoginResponseDTO } from '@/types/LoginResponse.dto';
import { UsersDTO } from '@/types/Users.dto';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface UserContextType {
    isLoggedIn: boolean;
    user: UsersDTO | null; // Adjust the type as per your user structure
    loginContextSaving: (loginResponse: LoginResponseDTO) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [user, setUser] = useState<UsersDTO | null>(null);

    useEffect(() => {
        // Rehydrate user from localStorage when the app starts
        const accessToken = localStorage.getItem('accessToken');
        const savedUser = localStorage.getItem('user');

        if (accessToken && savedUser) {
            setUser(JSON.parse(savedUser)); // Parse saved user data
            setIsLoggedIn(true);
        }
    }, []);

    const loginContextSaving = (loginResponse: LoginResponseDTO) => {
        if (loginResponse && loginResponse.backendTokens) {
            setUser(loginResponse.user);
            setIsLoggedIn(true);
            localStorage.setItem('accessToken', loginResponse.backendTokens.accessToken);
            localStorage.setItem('refreshToken', loginResponse.backendTokens.refreshToken);
            localStorage.setItem('user', JSON.stringify(loginResponse.user));
        }
    };

    const logout = () => {
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
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
