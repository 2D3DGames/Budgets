import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box } from '@mui/material';

// Context Providers
import { AuthProvider } from './context/AuthContext';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import BudgetList from './components/BudgetList';
import TransactionList from './components/TransactionList';
import Reports from './components/Reports';

// Create theme
const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <AuthProvider>
                    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                        <Navbar />
                        <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
                            <Routes>
                                <Route path="/register" element={<Register />} />
                                <Route path="/login" element={<Login />} />
                                <Route
                                    path="/dashboard"
                                    element={
                                        <ProtectedRoute>
                                            <Dashboard />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/budgets"
                                    element={
                                        <ProtectedRoute>
                                            <BudgetList />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/transactions"
                                    element={
                                        <ProtectedRoute>
                                            <TransactionList />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/reports"
                                    element={
                                        <ProtectedRoute>
                                            <Reports />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            </Routes>
                        </Container>
                    </Box>
                </AuthProvider>
            </Router>
        </ThemeProvider>
    );
}

export default App;
