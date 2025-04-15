import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
    IconButton,
    Menu,
    MenuItem,
    useMediaQuery,
    useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        logout();
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    const menuItems = user ? [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Budgets', path: '/budgets' },
        { label: 'Transactions', path: '/transactions' },
        { label: 'Reports', path: '/reports' }
    ] : [];

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component={RouterLink}
                        to="/"
                        sx={{
                            mr: 2,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                            flexGrow: { xs: 1, md: 0 }
                        }}
                    >
                        BUDGET APP
                    </Typography>

                    {user && (
                        <>
                            {isMobile ? (
                                <Box>
                                    <IconButton
                                        size="large"
                                        aria-label="menu"
                                        aria-controls="menu-appbar"
                                        aria-haspopup="true"
                                        onClick={handleMenu}
                                        color="inherit"
                                    >
                                        <MenuIcon />
                                    </IconButton>
                                    <Menu
                                        id="menu-appbar"
                                        anchorEl={anchorEl}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={Boolean(anchorEl)}
                                        onClose={handleClose}
                                    >
                                        {menuItems.map((item) => (
                                            <MenuItem
                                                key={item.path}
                                                onClick={handleClose}
                                                component={RouterLink}
                                                to={item.path}
                                                selected={isActive(item.path)}
                                            >
                                                {item.label}
                                            </MenuItem>
                                        ))}
                                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                    </Menu>
                                </Box>
                            ) : (
                                <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                    {menuItems.map((item) => (
                                        <Button
                                            key={item.path}
                                            component={RouterLink}
                                            to={item.path}
                                            color="inherit"
                                            sx={{
                                                borderBottom: isActive(item.path) ? '2px solid white' : 'none',
                                                borderRadius: 0
                                            }}
                                        >
                                            {item.label}
                                        </Button>
                                    ))}
                                    <Button
                                        color="inherit"
                                        onClick={logout}
                                        sx={{ ml: 2 }}
                                    >
                                        Logout
                                    </Button>
                                </Box>
                            )}
                        </>
                    )}

                    {!user && (
                        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button
                                color="inherit"
                                component={RouterLink}
                                to="/login"
                                sx={{
                                    borderBottom: isActive('/login') ? '2px solid white' : 'none',
                                    borderRadius: 0
                                }}
                            >
                                Login
                            </Button>
                            <Button
                                color="inherit"
                                component={RouterLink}
                                to="/register"
                                sx={{
                                    borderBottom: isActive('/register') ? '2px solid white' : 'none',
                                    borderRadius: 0
                                }}
                            >
                                Register
                            </Button>
                        </Box>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar; 