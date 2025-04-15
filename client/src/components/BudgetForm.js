import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Grid,
    MenuItem,
    Alert,
} from '@mui/material';
import { createBudget, updateBudget } from '../services/api';

const categories = [
    'Food',
    'Housing',
    'Transportation',
    'Utilities',
    'Healthcare',
    'Entertainment',
    'Shopping',
    'Other'
];

const BudgetForm = ({ onSubmit, initialData = null }) => {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        amount: initialData?.amount || '',
        category: initialData?.category || '',
        startDate: initialData?.startDate?.split('T')[0] || '',
        endDate: initialData?.endDate?.split('T')[0] || ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = initialData
                ? await updateBudget(initialData._id, formData)
                : await createBudget(formData);

            onSubmit(response);
            // Reset form if it's a new budget
            if (!initialData) {
                setFormData({
                    title: '',
                    amount: '',
                    category: '',
                    startDate: '',
                    endDate: ''
                });
            }
        } catch (err) {
            setError(err.message || 'Failed to save budget');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Amount"
                        name="amount"
                        type="number"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                        inputProps={{ min: 0 }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        select
                        label="Category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        {categories.map((category) => (
                            <MenuItem key={category} value={category}>
                                {category}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Start Date"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="End Date"
                        name="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : initialData ? 'Update Budget' : 'Create Budget'}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default BudgetForm; 