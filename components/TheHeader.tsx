"use client";
import * as React from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Container, Avatar, Button, Tooltip, Menu, MenuItem } from '@mui/material';
import AdbIcon from '@mui/icons-material/Adb';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { useState } from 'react';

const pages = {
    jobs: "Jobs",
    aboutUs: "About Us",
    contact: "Contact"
};

function TheHeader() {
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const router = useRouter();
    const { isLoggedIn, logout, user } = useUser();

    const handleLogout = () => {
        logout();
        handleCloseUserMenu()
        router.push('/');
    };

    const handleProfile = () => {
        handleCloseUserMenu();
        handleNavigate(`/users/${user ? user.idUser : ''}`);
    };

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleNavigate = (path: string) => {
        handleCloseUserMenu()
        router.push(path);
    };

    return (
        <AppBar position="static" sx={{
            mb: '20px',
        }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <AdbIcon sx={{ mr: 2 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        OROZ
                    </Typography>

                    <Box sx={{ flexGrow: 1 }}>
                        {user && (user.role.name === 'admin' || user.role.name === 'employee') && (
                            <>
                                <Button
                                    sx={{ my: 2, color: 'white' }}
                                    onClick={() => handleNavigate('/users')}
                                >
                                    Users
                                </Button>
                            </>
                        )}
                        {Object.entries(pages).map(([key, value]) => (
                            <Button
                                key={key} // Use the key for the unique identifier
                                sx={{ my: 2, color: 'white' }}
                                onClick={() => handleNavigate(`/${key}`)} // Use key for routing
                            >
                                {value}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        {isLoggedIn ? (
                            <>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar alt="Remy Sharp" src="" />
                                        <Typography color='white'>

                                            &nbsp;{user?.firstName}
                                        </Typography>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    <MenuItem onClick={handleProfile}>
                                        <Typography textAlign="center">Profile</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout}>
                                        <Typography textAlign="center">Logout</Typography>
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <>
                                <Button color="inherit" onClick={() => handleNavigate('/login')}>
                                    Login
                                </Button>
                                <Button color="inherit" onClick={() => handleNavigate('/register')}>
                                    Register
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default TheHeader;
