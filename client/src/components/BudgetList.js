import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Button,
    Dialog,
    Alert,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { getBudgets, deleteBudget } from '../services/api';
import BudgetForm from './BudgetForm';

const BudgetList = () => {
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openForm, setOpenForm] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState(null);

    const fetchBudgets = async () => {
        try {
            setLoading(true);
            const data = await getBudgets();
            setBudgets(data);
        } catch (err) {
            setError('Failed to fetch budgets');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBudgets();
    }, []);

    const handleEdit = (budget) => {
        setSelectedBudget(budget);
        setOpenForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this budget?')) {
            try {
                await deleteBudget(id);
                await fetchBudgets();
            } catch (err) {
                setError('Failed to delete budget');
            }
        }
    };

    const handleFormSubmit = async () => {
        setOpenForm(false);
        setSelectedBudget(null);
        await fetchBudgets();
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">Budgets</Typography>
                <Button
                    variant="contained"
                    onClick={() => setOpenForm(true)}
                >
                    Add Budget
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell align="right">Amount</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>End Date</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {budgets.map((budget) => (
                            <TableRow key={budget._id}>
                                <TableCell>{budget.title}</TableCell>
                                <TableCell>{budget.category}</TableCell>
                                <TableCell align="right">
                                    ${budget.amount.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    {new Date(budget.startDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    {new Date(budget.endDate).toLocaleDateString()}
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        onClick={() => handleEdit(budget)}
                                        color="primary"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleDelete(budget._id)}
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {budgets.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No budgets found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={openForm}
                onClose={() => {
                    setOpenForm(false);
                    setSelectedBudget(null);
                }}
                maxWidth="sm"
                fullWidth
            >
                <Box sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        {selectedBudget ? 'Edit Budget' : 'Add New Budget'}
                    </Typography>
                    <BudgetForm
                        initialData={selectedBudget}
                        onSubmit={handleFormSubmit}
                    />
                </Box>
            </Dialog>
        </Box>
    );
};

export default BudgetList; 