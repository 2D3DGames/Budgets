import axios from 'axios';

const API_URL = 'http://localhost:5002/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'http://localhost:3002'
    }
});

// Add token to requests if it exists
const setAuthToken = (token) => {
    if (token) {
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
    }
};

// Check for existing token on app load
const token = localStorage.getItem('token');
if (token) {
    setAuthToken(token);
}

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            setAuthToken(null);
        }
        return Promise.reject(error);
    }
);

// User related API calls
export const register = async (userData) => {
    try {
        const response = await api.post('/users/register', userData);
        if (response.data.token) {
            setAuthToken(response.data.token);
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Registration failed' };
    }
};

export const login = async (credentials) => {
    try {
        const response = await api.post('/users/login', credentials);
        if (response.data.token) {
            setAuthToken(response.data.token);
        }
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Login failed' };
    }
};

export const logout = async () => {
    try {
        setAuthToken(null);
        return { success: true };
    } catch (error) {
        throw error.response?.data || { message: 'Logout failed' };
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await api.get('/users/me');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to get user data' };
    }
};

export const updateProfile = async (userData) => {
    try {
        const response = await api.put('/users/profile', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to update profile' };
    }
};

// Transaction related API calls
export const getTransactions = async () => {
    try {
        const response = await api.get('/transactions');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to get transactions' };
    }
};

export const createTransaction = async (transactionData) => {
    try {
        const response = await api.post('/transactions', transactionData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to create transaction' };
    }
};

export const updateTransaction = async (id, transactionData) => {
    try {
        const response = await api.put(`/transactions/${id}`, transactionData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to update transaction' };
    }
};

export const deleteTransaction = async (id) => {
    try {
        const response = await api.delete(`/transactions/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to delete transaction' };
    }
};

// Budget related API calls
export const getBudgets = async () => {
    try {
        const response = await api.get('/budgets');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to get budgets' };
    }
};

export const createBudget = async (budgetData) => {
    try {
        const response = await api.post('/budgets', budgetData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to create budget' };
    }
};

export const updateBudget = async (id, budgetData) => {
    try {
        const response = await api.put(`/budgets/${id}`, budgetData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to update budget' };
    }
};

export const deleteBudget = async (id) => {
    try {
        const response = await api.delete(`/budgets/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to delete budget' };
    }
};

// Reports related API calls
export const getReport = async (startDate, endDate) => {
    try {
        const response = await api.get('/reports', {
            params: { startDate, endDate }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to get report' };
    }
};

export const getCategoryReport = async (startDate, endDate) => {
    try {
        const response = await api.get('/reports/category', {
            params: { startDate, endDate }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to get category report' };
    }
}; 