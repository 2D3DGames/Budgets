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
import { getTransactions, deleteTransaction } from '../services/api';
import TransactionForm from './TransactionForm';

const TransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openForm, setOpenForm] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const data = await getTransactions();
            setTransactions(data);
        } catch (err) {
            setError('Failed to fetch transactions');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleEdit = (transaction) => {
        setSelectedTransaction(transaction);
        setOpenForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await deleteTransaction(id);
                await fetchTransactions();
            } catch (err) {
                setError('Failed to delete transaction');
            }
        }
    };

    const handleFormSubmit = async () => {
        setOpenForm(false);
        setSelectedTransaction(null);
        await fetchTransactions();
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5">Transactions</Typography>
                <Button
                    variant="contained"
                    onClick={() => setOpenForm(true)}
                >
                    Add Transaction
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
                            <TableCell>Date</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell align="right">Amount</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((transaction) => (
                            <TableRow key={transaction._id}>
                                <TableCell>
                                    {new Date(transaction.date).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                                </TableCell>
                                <TableCell>{transaction.category}</TableCell>
                                <TableCell align="right" sx={{
                                    color: transaction.type === 'expense' ? 'error.main' : 'success.main'
                                }}>
                                    ${transaction.amount.toFixed(2)}
                                </TableCell>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        onClick={() => handleEdit(transaction)}
                                        color="primary"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleDelete(transaction._id)}
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {transactions.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No transactions found
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
                    setSelectedTransaction(null);
                }}
                maxWidth="sm"
                fullWidth
            >
                <Box sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        {selectedTransaction ? 'Edit Transaction' : 'Add New Transaction'}
                    </Typography>
                    <TransactionForm
                        initialData={selectedTransaction}
                        onSubmit={handleFormSubmit}
                    />
                </Box>
            </Dialog>
        </Box>
    );
};

export default TransactionList; 