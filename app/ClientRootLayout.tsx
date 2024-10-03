// app/ClientRootLayout.tsx (Client-Side Logic for MUI)
'use client'; // Enable client-side rendering for MUI

import { ReactNode } from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import localFont from 'next/font/local';
import './globals.css';
import TheHeader from '@/components/TheHeader';
import { UserProvider } from '@/contexts/UserContext';

// Custom font setup
const geistSans = localFont({
    src: './fonts/GeistVF.woff',
    variable: '--font-geist-sans',
    weight: '100 900',
});

const geistMono = localFont({
    src: './fonts/GeistMonoVF.woff',
    variable: '--font-geist-mono',
    weight: '100 900',
});

const theme = createTheme({
    palette: {
        mode: 'light',
    },
});

export default function ClientRootLayout({ children }: { children: ReactNode }) {
    return (
        <div className={`${geistSans.variable} ${geistMono.variable}`}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <UserProvider>
                    <TheHeader />
                    {children}
                </UserProvider>
            </ThemeProvider>
        </div>
    );
}
