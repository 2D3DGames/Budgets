import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser, login, logout, register, updateProfile } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const checkAuth = async () => {
        try {
            const userData = await getCurrentUser();
            setUser(userData);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const handleLogin = async (credentials) => {
        try {
            setError(null);
            const data = await login(credentials);
            setUser(data.user);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            throw err;
        }
    };

    const handleRegister = async (userData) => {
        try {
            setError(null);
            const data = await register(userData);
            setUser(data.user);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            throw err;
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            setUser(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Logout failed');
        }
    };

    const handleUpdateProfile = async (userData) => {
        try {
            setError(null);
            const updatedUser = await updateProfile(userData);
            setUser(updatedUser);
            return updatedUser;
        } catch (err) {
            setError(err.response?.data?.message || 'Profile update failed');
            throw err;
        }
    };

    const value = {
        user,
        loading,
        error,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        updateProfile: handleUpdateProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext; 